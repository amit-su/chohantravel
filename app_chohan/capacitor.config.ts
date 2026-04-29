import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'app.chohantoursandtravels.com',
    appName: 'Chohan Travels',
    webDir: 'dist/browser',
    android: {
        // Allow the web content to render edge-to-edge
        // CSS env(safe-area-inset-*) will provide correct insets
        backgroundColor: '#dc2626'
    },
    plugins: {
        StatusBar: {
            // Do NOT overlay web content — safe-area CSS handles spacing
            overlaysWebView: false,
            style: 'LIGHT',
            backgroundColor: '#dc2626'
        },
        SplashScreen: {
            launchShowDuration: 3000,
            launchAutoHide: false,
            backgroundColor: '#dc2626',
            showSpinner: false
        }
    }
};

export default config;
