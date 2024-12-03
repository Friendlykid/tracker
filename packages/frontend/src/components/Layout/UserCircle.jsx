import { auth } from "@/firebase/firebase";
import { useUser } from "@/lib/query";
import { AccountCircle, Settings, Logout } from "@mui/icons-material";
import {
  Button,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Drawer,
  List,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import { useMediaQuery } from "@mui/material";

export const UserCircle = ({ openLogin }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();
  const open = Boolean(anchorEl);
  const user = useUser();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const handleMenuClick = (event) => {
    if (isSmallScreen) {
      setDrawerOpen(true);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
    setDrawerOpen(false);
  };

  if (!user) {
    return (
      <Button
        name="login-button"
        aria-label="login-button"
        variant="contained"
        color={theme.palette.mode === "light" ? "secondary" : "primary"}
        onClick={openLogin}
      >
        Login
      </Button>
    );
  }

  return (
    <>
      <IconButton aria-label="user-icon" onClick={handleMenuClick}>
        <AccountCircle />
      </IconButton>

      {isSmallScreen ? (
        // Drawer for small screens
        <Drawer anchor="right" open={drawerOpen} onClose={handleClose}>
          <List>
            <MenuItem
              onClick={() => {
                router.push("/settings");
                handleClose();
              }}
            >
              <ListItemIcon aria-label="open-subscriptions-button">
                <Settings />
              </ListItemIcon>
              <ListItemText>Settings</ListItemText>
            </MenuItem>

            <MenuItem
              onClick={() => {
                auth.signOut();
                router.push("/");
                handleClose();
              }}
            >
              <ListItemIcon>
                <Logout />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>
          </List>
        </Drawer>
      ) : (
        // Menu for larger screens
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem onClick={() => router.push("/settings")}>
            <ListItemIcon>
              <Settings />
            </ListItemIcon>
            <ListItemText>Settings</ListItemText>
          </MenuItem>

          <MenuItem
            onClick={() => {
              auth.signOut();
              router.push("/");
            }}
          >
            <ListItemIcon>
              <Logout />
            </ListItemIcon>
            <ListItemText>Logout</ListItemText>
          </MenuItem>
        </Menu>
      )}
    </>
  );
};
