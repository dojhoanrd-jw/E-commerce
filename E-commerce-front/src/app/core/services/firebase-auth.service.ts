import { Injectable } from '@angular/core';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { Auth, GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class FirebaseAuthService {
  private app?: FirebaseApp;
  private auth?: Auth;

  // True when a Firebase web config has been provided.
  readonly isConfigured = !!environment.firebase.apiKey;

  /**
   * Opens the Google sign-in popup and resolves with the Firebase ID token,
   * which the backend exchanges for our own JWT. Returns null if not configured.
   */
  async signInWithGoogle(): Promise<string | null> {
    if (!this.isConfigured) {
      return null;
    }

    const auth = this.getAuth();
    const result = await signInWithPopup(auth, new GoogleAuthProvider());
    return result.user.getIdToken();
  }

  private getAuth(): Auth {
    if (!this.auth) {
      this.app = initializeApp(environment.firebase);
      this.auth = getAuth(this.app);
    }
    return this.auth;
  }
}
