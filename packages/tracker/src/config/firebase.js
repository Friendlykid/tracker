import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { readFile } from "fs/promises";

const serviceAccount = JSON.parse(await readFile("admin.json"));

export const app = initializeApp({
  credential: cert(serviceAccount),
});

export const db = getFirestore(app);
