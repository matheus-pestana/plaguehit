import os
import cv2
import numpy as np
import tensorflow as tf
from flask import Flask, request, jsonify
from tensorflow.keras.models import Model
import firebase_admin
from firebase_admin import credentials, storage, firestore
import uuid

# ==========================================
# 1. CONFIGURAÇÕES INICIAIS
# ==========================================
app = Flask(__name__)

# Configuração do Firebase
cred = credentials.Certificate("firebase-adminsdk.json")
firebase_admin.initialize_app(cred, {
    # IMPORTANTE: Altere a linha abaixo para o ID do bucket do seu projeto no Firebase
    'storageBucket': 'SEU_PROJETO.appspot.com' 
})
db = firestore.client()
bucket = storage.bucket()

# Carregamento do Modelo
CAMINHO_MODELO = 'modelo_pragas_feijao_v2.keras'
print(f'🤖 A carregar o modelo: {CAMINHO_MODELO} ...')
model = tf.keras.models.load_model(CAMINHO_MODELO)
TARGET_H = model.input_shape[1]
TARGET_W = model.input_shape[2]
CLASSES = ['mosca_branca', 'saudavel', 'sintomas']
print('✅ Modelo carregado com sucesso!')

# ==========================================
# 2. FUNÇÃO GRAD-CAM ADAPTADA PARA SERVIDOR
# ==========================================
def processar_imagem(img_path):
    img_original = cv2.imread(img_path)
    img_rgb = cv2.cvtColor(img_original, cv2.COLOR_BGR2RGB)
    img_redimensionada = cv2.resize(img_rgb, (TARGET_W, TARGET_H))
    raio_x = np.expand_dims(img_redimensionada, axis=0) / 255.0

    ultima_camada_conv = None
    for layer in reversed(model.layers):
        if 'conv' in layer.name.lower() or isinstance(layer, tf.keras.layers.Conv2D) or 'Conv_1' in layer.name:
            ultima_camada_conv = layer.name
            break
    if not ultima_camada_conv:
        ultima_camada_conv = 'Conv_1'

    grad_model = Model(
        inputs=[model.inputs],
        outputs=[model.get_layer(ultima_camada_conv).output, model.output]
    )

    with tf.GradientTape() as tape:
        conv_outputs, predictions = grad_model(raio_x)
        classe_predita_idx = np.argmax(predictions[0])
        perda = predictions[0][classe_predita_idx]

    grads = tape.gradient(perda, conv_outputs)[0]
    cam = np.dot(conv_outputs[0], tf.reduce_mean(grads, axis=(0, 1)))
    cam = cv2.resize(cam, (img_original.shape[1], img_original.shape[0]))
    cam = np.maximum(cam, 0)

    mapa_calor = (cam - cam.min()) / (cam.max() - cam.min() + 1e-10)
    mapa_calor = np.uint8(255 * mapa_calor)
    mapa_calor = cv2.applyColorMap(mapa_calor, cv2.COLORMAP_JET)

    imagem_final = cv2.addWeighted(img_original, 0.6, mapa_calor, 0.4, 0)
    
    nome_classe = CLASSES[classe_predita_idx]
    confianca = float(predictions[0][classe_predita_idx]) * 100

    output_path = f"processed_{os.path.basename(img_path)}"
    cv2.imwrite(output_path, imagem_final)
    
    return nome_classe, confianca, output_path

# ==========================================
# 3. ENDPOINT DA API FLASK
# ==========================================
@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({"erro": "Nenhuma imagem enviada"}), 400

    file = request.files['file']
    umidade = request.form.get('umidade', '0')

    temp_filename = f"temp_{uuid.uuid4().hex}.jpg"
    file.save(temp_filename)

    try:
        diagnostico, confianca, imagem_processada = processar_imagem(temp_filename)
        print(f"[DIAGNÓSTICO] {diagnostico} | Confiança: {confianca:.2f}% | Umidade: {umidade}%")

        blob = bucket.blob(f"diagnosticos/{imagem_processada}")
        blob.upload_from_filename(imagem_processada)
        blob.make_public()
        image_url = blob.public_url

        doc_ref = db.collection('diagnosticos').document()
        doc_ref.set({
            'diagnostico': diagnostico,
            'confianca': confianca,
            'umidade': int(umidade),
            'imagem_url': image_url,
            'timestamp': firestore.SERVER_TIMESTAMP
        })

        os.remove(temp_filename)
        os.remove(imagem_processada)

        return jsonify({
            "status": "sucesso",
            "diagnostico": diagnostico,
            "confianca": confianca,
            "url_imagem": image_url
        }), 200

    except Exception as e:
        return jsonify({"erro": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)