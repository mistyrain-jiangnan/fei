import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.couple.sweettools',
  appName: '情侣甜蜜小工具',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
    }
  },
  plugins: {
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#fce7f3',
      overlaysWebView: false
    }
  }
};

export default config;
