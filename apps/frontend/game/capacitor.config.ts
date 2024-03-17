import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'playrooms.enegix.alpha',
  appName: 'Playrooms',
  webDir: '../../../dist/apps/frontend/next/.next',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https',
  },
};

export default config;
