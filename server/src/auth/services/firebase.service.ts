import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  private app: admin.app.App;

  constructor() {
    this.initializeFirebase();
  }

  private initializeFirebase(): void {
    if (!admin.apps.length) {
      // Hardcoded Firebase yapılandırması
      const privateKey = `your-private-key`;
      
      const clientEmail = 'your-client-email';

      this.app = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: 'authentication-33eb6',
          privateKey: privateKey,
          clientEmail: clientEmail,
        }),
      });

      console.log('Firebase Admin SDK başarıyla yapılandırıldı');
    } else {
      this.app = admin.app();
    }
  }

  async verifyIdToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      return decodedToken;
    } catch (error) {
      console.error('Firebase token doğrulama hatası:', error);
      throw new Error('Geçersiz Firebase token');
    }
  }

  async createCustomToken(uid: string, additionalClaims?: object): Promise<string> {
    try {
      return await admin.auth().createCustomToken(uid, additionalClaims);
    } catch (error) {
      console.error('Firebase custom token oluşturma hatası:', error);
      throw new Error('Custom token oluşturulamadı');
    }
  }

  async getUserByUid(uid: string): Promise<admin.auth.UserRecord> {
    try {
      return await admin.auth().getUser(uid);
    } catch (error) {
      console.error('Firebase kullanıcı bilgisi alma hatası:', error);
      throw new Error('Kullanıcı bilgisi alınamadı');
    }
  }
}
