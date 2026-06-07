import { Platform } from 'react-native';

const tintColorLight = '#1A2F1A';
const tintColorDark = '#39FF14';

export const Colors = {
  light: {
    text: '#1A2F1A',
    textSecondary: '#666666',
    textOnPrimary: '#FFFFFF', 
    background: '#F4F9F1',
    backgroundPrimary: '#6C9953', 
    card: '#FFFFFF',
    border: '#1A2F1A',
    tint: tintColorLight,
    icon: '#666666',
    buttonBackground: '#b3d19f',
    buttonText: '#1A2F1A',
    danger: '#D9534F',
    divider: '#FFFFFF',
    statusIcon: '#6C9953', // <-- CORREÇÃO: Propriedade adicionada
  },
  dark: {
    text: '#FFFFFF',
    textSecondary: '#AAAAAA',
    textOnPrimary: '#39FF14', 
    background: '#050505',
    backgroundPrimary: '#050505', 
    card: '#0A0A0A',
    border: '#1A1A1A',
    tint: tintColorDark,
    icon: '#AAAAAA',
    buttonBackground: '#1A1A1A',
    buttonText: '#39FF14',
    danger: '#D9534F',
    divider: '#151515',
    statusIcon: '#39FF14', // <-- CORREÇÃO: Propriedade adicionada
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});