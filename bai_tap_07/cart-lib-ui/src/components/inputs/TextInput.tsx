import { TextField, TextFieldProps } from "@mui/material";
import React from "react";

export interface TextInputProps extends Omit<TextFieldProps, "variant"> {
  variant?: "outlined" | "filled" | "standard";
}

export const TextInput: React.FC<TextInputProps> = ({ variant = "outlined", ...props }) => {
  return <TextField variant={variant} {...props} />;
};