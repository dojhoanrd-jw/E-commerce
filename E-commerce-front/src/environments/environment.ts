export const environment = {
  production: false,
  // In dev the Angular dev-server proxies "/api" to the local backend (see proxy.conf.json)
  apiUrl: '/api',
  // Firebase web app config (Firebase Console → Project Settings → Your apps).
  // Leave apiKey empty to hide the "Continue with Google" button until configured.
  firebase: {
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: ''
  }
};
