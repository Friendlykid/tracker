import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updatePassword,
} from "firebase/auth";
import { auth } from "./firebase";

export const doCreateUserWithEmailAndPassword = async (email, password) => {
  const user = await createUserWithEmailAndPassword(auth, email, password);
  await doSendEmailVerification();
  return user;
};

export const doSignInWithEmailAndPassword = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const doSignOut = () => {
  return auth.signOut();
};

export const doPasswordReset = (email) => {
  return sendPasswordResetEmail(auth, email);
};

export const doPasswordChange = (password) => {
  return updatePassword(auth.currentUser, password);
};

export const doSendEmailVerification = () => {
  return sendEmailVerification(auth.currentUser, {
    url: `${window.location.origin}/dashboard/new`,
  });
};
