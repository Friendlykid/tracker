import { doSignInWithEmailAndPassword } from "@/firebase/auth";
import { auth } from "@/firebase/firebase";
import {
  Button,
  FormControl,
  FormLabel,
  Paper,
  TextField,
  Stack,
  Tabs,
  Tab,
  Dialog,
} from "@mui/material";
import { useState } from "react";
import { FirebaseAuth } from "./FirebaseAuth";
import { useRecoilValue } from "recoil";
import { userAtom } from "@/lib/recoilProvider";

export default function Login({ open, handleClose }) {
  const isOpen = open && auth.currentUser ? false : open;
  const [isSigningIn, setIsSigningIn] = useState(false);
  const user = useRecoilValue(userAtom);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tabItem, setTabItem] = useState(0);
  const onSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        await doSignInWithEmailAndPassword(email, password);
        setIsSigningIn(false);
      } catch (error) {
        console.log(error);
      }

      // doSendEmailVerification()
    }
  };
  return (
    <Dialog open={isOpen ?? false} onClose={handleClose}>
      <Paper
        elevation={2}
        component={"form"}
        onSubmit={onSubmit}
        sx={{ width: 300 }}
      >
        <Stack gap={2}>
          <Tabs value={tabItem} onChange={(e, value) => setTabItem(value)}>
            <Tab sx={{ width: "50%" }} label="Login" />
            <Tab sx={{ width: "50%" }} label="Sign up" />
          </Tabs>
          <Stack gap={2} m={2}>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <TextField
                // html input attribute
                name="email"
                type="email"
                placeholder="example@example.com"
                variant="standard"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Password</FormLabel>
              <TextField
                // html input attribute
                name="password"
                type="password"
                placeholder="password"
                value={password}
                variant="standard"
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <Button type="submit">{tabItem ? "Register" : "Log in"}</Button>
            {tabItem && <FirebaseAuth />}
          </Stack>
        </Stack>
      </Paper>
    </Dialog>
  );
}
