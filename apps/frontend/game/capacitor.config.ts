import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'kingo.enegix.alpha',
  appName: 'Kingo',
  webDir: '../../../dist/apps/frontend/next/.next',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https',
  },
};

export default config;
