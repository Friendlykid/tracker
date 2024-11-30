import { Google } from "@mui/icons-material";
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
import { useMemo, useState } from "react";
import { GoogleAuthProvider } from "firebase/auth";
import { loginAtom } from "@/lib/atoms";
import { useRecoilState } from "recoil";
import { useUser } from "@/lib/query";
import { useRegisterUser, useSignInMutation } from "@/lib/mutations";
import { enqueueSnackbar } from "notistack";

export default function Login() {
  const [loginOpen, setLoginOpen] = useRecoilState(loginAtom);
  const user = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tabItem, setTabItem] = useState(0);
  const [passWordError, setPasswordError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const googleProvider = useMemo(() => new GoogleAuthProvider(), []);
  const { mutate: signIn } = useSignInMutation();
  const { mutate: register } = useRegisterUser();
  const onSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (email === "") {
      setEmailError(true);
      return;
    }
    if (password === "") {
      setPasswordError(true);
      return;
    }
    if (tabItem === 0) {
      try {
        signIn({ provider: "email", email, password });
      } catch (error) {
        enqueueSnackbar({ variant: "error", message: "Something went wrong" });
        if (String(error).includes("auth/missing-password")) {
          setPasswordError(true);
        }
        if (String(error).includes("auth/invalid-email")) {
          setEmailError(true);
        }
      }
    }
    if (!emailError && !passWordError && tabItem === 1) {
      register({ email, password });
    }
  };
  return (
    <Dialog
      open={loginOpen && !user}
      onClose={() => setLoginOpen(false)}
      aria-modal="true"
    >
      <Paper
        elevation={2}
        component={"form"}
        onSubmit={onSubmit}
        sx={{ width: 300, overflow: "hidden" }}
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
                name="email"
                type="email"
                placeholder="example@example.com"
                variant="standard"
                value={email}
                slotProps={{
                  htmlInput: {
                    autoComplete: "email",
                  },
                }}
                onChange={(e) => {
                  if (emailError) setEmailError(false);
                  setEmail(e.target.value);
                }}
                error={emailError}
                helperText={emailError && "Missing email"}
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
                slotProps={{
                  htmlInput: {
                    autoComplete: "current-password",
                  },
                }}
                onChange={(e) => {
                  if (passWordError) setPasswordError(false);
                  setPassword(e.target.value);
                }}
                error={passWordError}
                helperText={passWordError && "Missing password"}
              />
            </FormControl>
            <Button type="submit">{tabItem ? "Register" : "Log in"}</Button>
            <Button
              startIcon={<Google />}
              onClick={() => signIn({ provider: googleProvider })}
            >
              Log in with Google
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Dialog>
  );
}
