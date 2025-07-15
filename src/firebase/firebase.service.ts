import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseAdminService {
  constructor() {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
    }
  }

  async getUserInfo(uid: string) {
    try {
      const userRecord = await admin.auth().getUser(uid);
      return {
        displayName: userRecord.displayName,
        photoURL: userRecord.photoURL,
        email: userRecord.email,
      };
    } catch {
      return null;
    }
  }
}
