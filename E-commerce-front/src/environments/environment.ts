export const environment = {
  production: false,
  // In dev the Angular dev-server proxies "/api" to the local backend (see proxy.conf.json)
  apiUrl: '/api',
  // Firebase web app config (Firebase Console → Project Settings → Your apps).
  // Leave apiKey empty to hide the "Continue with Google" button until configured.
  firebase: {
    apiKey: 'AIzaSyClBLKZe1Exe0hrHsjqmf7XtKc0754FEIU',
    authDomain: 'e-commerce-b3d90.firebaseapp.com',
    projectId: 'e-commerce-b3d90',
    storageBucket: 'e-commerce-b3d90.firebasestorage.app',
    messagingSenderId: '839699806656',
    appId: '1:839699806656:web:4a252aef111ec4748bb025',
    measurementId: 'G-TG3QPXQPGP'
  }
};
