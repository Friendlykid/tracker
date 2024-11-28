import { Box, Typography } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useEffect, useRef } from "react";

export default function Custom404() {
  const snackbarShown = useRef(false);

  useEffect(() => {
    if (!snackbarShown.current) {
      enqueueSnackbar("Something went wrong", {
        variant: "error",
        autoHideDuration: 1000,
      });
      snackbarShown.current = true;
    }
  }, []);

  return (
    <Box width="100%" height="100vh">
      <Typography mt={5} textAlign="center" color="error">
        404 - Page Not Found
      </Typography>
    </Box>
  );
}
