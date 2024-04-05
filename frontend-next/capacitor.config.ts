import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.jacsn.chatmaps',
  appName: 'ChatMaps',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  }
};

export default config;
