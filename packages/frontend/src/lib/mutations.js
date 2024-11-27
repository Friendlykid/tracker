import { COLLECTIONS } from "@/firebase/constants";
import { auth, db } from "@/firebase/firebase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  doc,
  getDoc,
  runTransaction,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { useUser } from "./query";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  signInWithPopup,
  updatePassword,
} from "firebase/auth";
import {
  doCreateUserWithEmailAndPassword,
  doSignInWithEmailAndPassword,
} from "@/firebase/auth";

export const useSignInMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationKey: ["signIn"],
    mutationFn: async ({ provider, email, password }) => {
      const result =
        provider === "email"
          ? doSignInWithEmailAndPassword(email, password)
          : await signInWithPopup(auth, provider);
      const user = result?.user;

      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userRef);

        // If user does not exist, add them to the "users" collection
        if (!userSnapshot.exists()) {
          await setDoc(userRef, {
            uid: user.uid,
            email: user.email,
            createdAt: new Date(),
            lastVisited: new Date(),
          });
          queryClient.setQueryData(["lastVisited"], () => new Date());
        } else {
          queryClient.setQueryData(
            ["lastVisited"],
            () => userSnapshot.data().lastVisited
          );
          await updateDoc(userRef, {
            lastVisited: new Date(),
          });
        }
      }

      return user;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], () => data);
      router.push("/dashboard/new");
    },
  });
};

export const useRegisterUser = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationKey: ["register"],
    mutationFn: async ({ email, password }) => {
      const result = await doCreateUserWithEmailAndPassword(email, password);
      const user = result?.user;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, {
          uid: user.uid,
          email: email,
          createdAt: new Date(),
          lastVisited: new Date(),
        });
        queryClient.setQueryData(["lastVisited"], () => new Date());
      }

      return user;
    },
    onSuccess: (data) => {
      // Update user for useUser hook
      queryClient.setQueryData(["user"], () => data);
      router.push("/dashboard/new");
    },
  });
};

export const useReauthenticateUser = ({ onError, onSuccess }) => {
  const user = useUser();
  return useMutation({
    mutationKey: ["revalidateUser"],
    mutationFn: async (password) => {
      if (!user) return false;
      const credential = EmailAuthProvider.credential(user.email, password);
      try {
        await reauthenticateWithCredential(user, credential);
        return true;
      } catch (e) {
        return false;
      }
    },
    onError,
    onSuccess,
  });
};

export const useSetPassword = ({ onError, onSuccess }) => {
  const user = useUser();
  return useMutation({
    mutationKey: ["setPassword"],
    mutationFn: async (newPassword) => {
      if (!user) return false;

      return updatePassword(user, newPassword);
    },
    onError,
    onSuccess,
  });
};

export const useIsAddressDuplicate = (options) => {
  const user = useUser();
  return useMutation({
    mutationKey: ["duplicate"],
    mutationFn: async ({ address, blockchain }) => {
      if (!blockchain || !address) return false;
      const subRef = doc(
        db,
        blockchain === "btc"
          ? COLLECTIONS.BTC_SUBSCRIPTIONS(user.uid)
          : COLLECTIONS.ETH_SUBSCRIPTIONS(user.uid),
        address
      );

      const docSnapshot = await getDoc(subRef);
      return docSnapshot.exists();
    },
    ...options,
  });
};
/**
 * For creating or updating user subscription to blockchain wallet
 * @returns useMutation hook
 */
export const useSubscribe = ({ ...options }) => {
  const user = useUser();
  return useMutation({
    mutationKey: ["subscribe"],
    mutationFn: async ({ blockchain, address, ...other }) => {
      const subRef = doc(
        db,
        blockchain === "btc"
          ? COLLECTIONS.BTC_SUBSCRIPTIONS(user.uid)
          : COLLECTIONS.ETH_SUBSCRIPTIONS(user.uid),
        address
      );
      await runTransaction(db, async (transaction) => {
        transaction.set(subRef, { address, ...other }, { merge: true });
      });
    },
    ...options,
  });
};
