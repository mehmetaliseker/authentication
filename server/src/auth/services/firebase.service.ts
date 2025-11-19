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
      const privateKey = process.env.FIREBASE_PRIVATE_KEY;
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

      if (!privateKey || !clientEmail) {
        throw new Error('Firebase yapılandırması eksik. Lütfen .env dosyasında FIREBASE_PRIVATE_KEY ve FIREBASE_CLIENT_EMAIL değerlerini ayarlayın.');
      }

      // Private key'deki \n karakterlerini düzgün parse et
      const formattedPrivateKey = privateKey.replace(/\\n/g, '\n');

      // Project ID'yi client email'den çıkar
      const projectId = clientEmail.split('@')[1]?.split('.')[0] || 'authentication-33eb6';

      this.app = admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          privateKey: formattedPrivateKey,
          clientEmail,
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
