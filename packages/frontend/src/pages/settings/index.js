import Layout from "@/components/Layout/Layout";
import { useReauthenticateUser, useSetPassword, useUser } from "@/lib/query";
import { Delete } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { deleteUser } from "firebase/auth";
import { useRouter } from "next/router";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";

export default function Settings() {
  const user = useUser();
  const router = useRouter();
  const [openDelete, setOpenDelete] = useState(false);
  const [originalPass, setOriginalPass] = useState("");
  const [originalError, setOriginalError] = useState(false);
  const [newPass, setNewPass] = useState("");
  const [retypePass, setRetypePass] = useState("");
  const { mutateAsync: reauthenticateUser } = useReauthenticateUser({
    onError: () => setOriginalError(true),
  });
  const { mutate: updatePassword } = useSetPassword({
    onError: (e) => {
      console.log(e);
      enqueueSnackbar("Something went wrong", { variant: "error" });
    },
    onSuccess: () => {
      enqueueSnackbar("Password changed", { variant: "success" });
      router.push("/dashboard");
    },
  });

  const handleChangePass = async (e) => {
    e.preventDefault();
    if (newPass !== retypePass) return;
    if (newPass === originalPass) {
      enqueueSnackbar("New password is the same as old one", {
        variant: "warning",
        autoHideDuration: 1500,
      });
      return;
    }
    const result = await reauthenticateUser(originalPass);
    if (!result) {
      setOriginalError(false);
    }
    updatePassword(newPass);
  };

  if (!user) return;
  return (
    <Layout>
      <Stack gap={10}>
        {user.providerData[0].providerId === "password" && (
          <form style={{ maxWidth: 400 }} onSubmit={handleChangePass}>
            <Stack gap={2}>
              <Typography variant="h5">Change password</Typography>
              <TextField
                variant="standard"
                type="password"
                label="Original Password"
                value={originalPass}
                onChange={(event) => {
                  setOriginalPass(event.target.value);
                  if (originalError) setOriginalError(false);
                }}
                helperText={originalError && "Wrong password"}
                error={originalError}
              />
              <TextField
                variant="standard"
                type="password"
                label="New Password"
                autoComplete="off"
                value={newPass}
                onChange={(event) => setNewPass(event.target.value)}
              />
              <TextField
                variant="standard"
                type="password"
                label="Type new password again"
                autoComplete="off"
                value={retypePass}
                onChange={(event) => setRetypePass(event.target.value)}
                error={retypePass !== newPass}
                helperText={retypePass !== newPass && "Password doesn't match"}
              />
              <Button type="submit" sx={{ maxWidth: 200 }}>
                Update Password
              </Button>
            </Stack>
          </form>
        )}
        <Button
          variant="contained"
          color="error"
          startIcon={<Delete />}
          onClick={() => setOpenDelete(true)}
          sx={{ maxWidth: 200 }}
        >
          Delete account
        </Button>
      </Stack>
      <Dialog
        sx={{
          "& .MuiDialog-paper": {
            width: "80%",
            maxHeight: 435,
            py: 3,
          },
        }}
        maxWidth="xs"
        onClose={() => setOpenDelete(false)}
        open={openDelete}
      >
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent>
          <Typography>Your account with your data will be deleted</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            autoFocus
            onClick={() => setOpenDelete(false)}
          >
            No
          </Button>
          <Button onClick={() => deleteUser(user)}>Yes</Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}
