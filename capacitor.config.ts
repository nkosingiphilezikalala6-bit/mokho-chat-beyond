import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.mokho',
  appName: 'mokho-chat-beyond',
  webDir: 'dist',
  server: {
    url: 'https://81bb00c9-56eb-4d07-aa38-a63a72dad169.lovableproject.com?forceHideBadge=true',
    cleartext: true
  }
};

export default config;
