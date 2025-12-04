import { Button as MuiButton, ButtonProps as MuiButtonProps } from "@mui/material";
import React from "react";

export interface ButtonProps extends Omit<MuiButtonProps, "variant"> {
  variant?: "contained" | "outlined" | "text";
}

export const Button: React.FC<ButtonProps> = ({ children, variant = "contained", ...props }) => {
  return (
    <MuiButton variant={variant} {...props}>
      {children}
    </MuiButton>
  );
};
