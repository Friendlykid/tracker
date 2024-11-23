import { Box, Stack, Typography } from "@mui/material";
import SwitchTheme from "../SwitchTheme";

export const DrawerContent = () => {
  return (
    <Stack justifyContent="space-between" my={2} ml={2} height="100%">
      <Typography>Drawer Content</Typography>
      <SwitchTheme />
    </Stack>
  );
};
