import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  private app: admin.app.App;

  constructor() {
    // Firebase credentials kontrolü
    if (!process.env.FIREBASE_PRIVATE_KEY || !process.env.FIREBASE_CLIENT_EMAIL) {
      console.warn('⚠️  Firebase credentials bulunamadı. Google Authentication devre dışı.');
      return;
    }

    try {
      if (!admin.apps.length) {
        this.app = admin.initializeApp({
          credential: admin.credential.cert({
            projectId: 'authentication-33eb6',
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          }),
        });
        console.log('✅ Firebase Admin SDK başarıyla başlatıldı');
      } else {
        this.app = admin.apps[0] as admin.app.App;
      }
    } catch (error) {
      console.error('❌ Firebase Admin SDK başlatılamadı:', error.message);
      throw new Error('Firebase configuration failed');
    }
  }

  async verifyIdToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
    if (!this.app) {
      throw new Error('Firebase Admin SDK is not initialized');
    }
    
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      return decodedToken;
    } catch (error) {
      throw new Error('Invalid Firebase ID token');
    }
  }
}
