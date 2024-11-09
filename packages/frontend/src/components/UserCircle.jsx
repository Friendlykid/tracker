import { auth } from "@/firebase/firebase";
import { useUser } from "@/lib/query";
import { AccountCircle } from "@mui/icons-material";
import { Button, IconButton, Menu, MenuItem } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";

export const UserCircle = ({ openLogin }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const router = useRouter();
  const open = Boolean(anchorEl);
  const user = useUser();
  console.log(user);
  if (!user) {
    return (
      <Button color="inherit" onClick={openLogin}>
        Login
      </Button>
    );
  }
  return (
    <>
      <IconButton
        onClick={(event) => {
          setAnchorEl(event.currentTarget);
        }}
      >
        <AccountCircle />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem>Change password</MenuItem>
        <MenuItem
          onClick={() => {
            auth.signOut();
            router.push("/");
          }}
        >
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};
