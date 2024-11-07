import { useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebaseui/dist/firebaseui.css";
import { auth } from "@/firebase/firebase";

export function FirebaseAuth() {
  useEffect(() => {
    const fn = async () => {
      const firebaseui = await import("firebaseui");

      const ui =
        firebaseui.auth.AuthUI.getInstance() ||
        new firebaseui.auth.AuthUI(auth);

      ui.start("#firebaseui-auth-container", {
        signInSuccessUrl: "/home",
        signInOptions: [
          {
            provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            clientId:
              "669565576564-91u3hk5sfqorbcua2qdum2eiceu6qkqv.apps.googleusercontent.com",
          },
          {
            provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
          },
        ],
        credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO,
      });
    };
    fn();
  }, []);
  if (!window) return;

  return <div id="firebaseui-auth-container"></div>;
}
