import {
  doCreateUserWithEmailAndPassword,
  doSignInWithEmailAndPassword,
} from "@/firebase/auth";
import { auth, db } from "@/firebase/firebase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AuthCredential,
  EmailAuthProvider,
  reauthenticateWithCredential,
  signInWithPopup,
  updatePassword,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const useLastVisitedQuery = () => {
  return useQuery({
    queryKey: ["lastVisited"],
    enabled: false,
  });
};

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
        // Check if user exists in "users" collection
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
      router.push("/dashboard");
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
      console.log(result);
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
      // Update query data for "user" key
      queryClient.setQueryData(["user"], () => data);
      router.push("/dashboard");
    },
  });
};

export const useUser = () => {
  const { data } = useQuery({
    queryKey: ["user"],
    enabled: false,
  });
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      queryClient.setQueryData(["user"], () => user);
    });
    return unsubscribe;
  }, [queryClient]);
  if (!data) return;

  return data;
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
