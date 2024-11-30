import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";

export const DeleteSubscriptionDialog = ({ open, handleClose, action }) => {
  return (
    <Dialog
      sx={{
        "& .MuiDialog-paper": {
          width: "80%",
          maxHeight: 435,
          py: 3,
        },
      }}
      aria-modal="true"
      maxWidth="xs"
      onClose={handleClose}
      open={open}
    >
      <DialogTitle>Are you sure?</DialogTitle>

      <DialogActions>
        <Button variant="contained" autoFocus onClick={handleClose}>
          No
        </Button>
        <Button onClick={action}>Yes</Button>
      </DialogActions>
    </Dialog>
  );
};
