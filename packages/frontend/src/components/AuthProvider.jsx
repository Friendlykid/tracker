import { auth } from "@/firebase/firebase";
import { userAtom } from "@/lib/recoilProvider";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";

export const AuthProvider = ({ children }) => {
  const setUser = useSetRecoilState(userAtom);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log("authStateChanged", user);
      setUser(user);
    });
    return unsubscribe;
  }, [setUser]);
  return <>{children}</>;
};
