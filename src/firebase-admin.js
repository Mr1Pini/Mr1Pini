import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

let serviceAccount;

if (process.env.FIREBASE_CONFIG) {
  // На хостингу: читаємо з змінної середовища
  serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);
} else {
  // Локально: читаємо з файлу
  serviceAccount = JSON.parse(
    await readFile(join(__dirname, '../serviceAccountKey.json'))
  );
}

const adminApp = initializeApp({
  credential: cert(serviceAccount)
});

export const adminDb = getFirestore(adminApp);