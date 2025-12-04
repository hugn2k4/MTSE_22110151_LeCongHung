import CloseIcon from "@mui/icons-material/Close";
import { Dialog, DialogActions, DialogContent, DialogProps, DialogTitle, IconButton } from "@mui/material";
import React from "react";

export interface ModalProps extends Omit<DialogProps, "open"> {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  showCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
  actions,
  showCloseButton = true,
  ...props
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth {...props}>
      {title && (
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {title}
          {showCloseButton && (
            <IconButton aria-label="close" onClick={onClose} sx={{ color: "grey.500" }}>
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>
      )}
      <DialogContent dividers>{children}</DialogContent>
      {actions && <DialogActions>{actions}</DialogActions>}
    </Dialog>
  );
};
