import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import serviceAccount from "../../admin.json" assert { type: "json" };

export const app = initializeApp({
  credential: cert(serviceAccount),
});

export const db = getFirestore(app);
