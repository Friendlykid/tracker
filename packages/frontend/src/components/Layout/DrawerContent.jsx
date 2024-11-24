import {
  Stack,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
} from "@mui/material";
import SwitchTheme from "../SwitchTheme";
import { useRouter } from "next/router";
import { ExpandLess, ExpandMore, Add } from "@mui/icons-material";
import { Bitcoin } from "../Icons/Bitcoin";
import { useState } from "react";
import { Ethereum } from "../Icons/Ethereum";

export const DrawerContent = () => {
  const [subOpen, setSubOpen] = useState(false);
  return (
    <Stack justifyContent="space-between" my={2} height="100%">
      <List
        sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        component="nav"
      >
        <ListItemButton onClick={() => setSubOpen((old) => !old)}>
          <ListItemIcon>
            <Add />
          </ListItemIcon>
          <ListItemText
            primary="Create Subscription"
            sx={{ whiteSpace: "nowrap" }}
          />

          {subOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={subOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <Bitcoin />
              </ListItemIcon>
              <ListItemText primary="New Bitcoin sub" />
            </ListItemButton>
          </List>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <Ethereum />
              </ListItemIcon>
              <ListItemText primary="New Ethereum sub" />
            </ListItemButton>
          </List>
        </Collapse>
      </List>
      <SwitchTheme />
    </Stack>
  );
};
