import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { Alert, Box, Button, Paper, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { CartAddFormProps } from "../../types";
import { useCart } from "./CartProvider";

export const CartAddForm: React.FC<CartAddFormProps> = ({ onAdd, buttonText = "Thêm vào giỏ hàng" }) => {
  const { addItem } = useCart();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !price) {
      return;
    }

    const newItem = {
      id: Date.now().toString(),
      name,
      price: parseFloat(price),
      quantity: parseInt(quantity) || 1,
      image: image || undefined,
      description: description || undefined,
    };

    addItem(newItem);

    if (onAdd) {
      onAdd(newItem);
    }

    // Reset form
    setName("");
    setPrice("");
    setQuantity("1");
    setImage("");
    setDescription("");

    // Show success message
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" component="h2" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
        Thêm sản phẩm mới
      </Typography>

      {showSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Đã thêm sản phẩm vào giỏ hàng thành công!
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Tên sản phẩm"
          variant="outlined"
          fullWidth
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <TextField
          label="Giá"
          variant="outlined"
          fullWidth
          required
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          inputProps={{ min: 0, step: 0.01 }}
        />

        <TextField
          label="Số lượng"
          variant="outlined"
          fullWidth
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          inputProps={{ min: 1 }}
        />

        <TextField
          label="URL hình ảnh"
          variant="outlined"
          fullWidth
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="https://example.com/image.jpg"
        />

        <TextField
          label="Mô tả"
          variant="outlined"
          fullWidth
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          startIcon={<AddShoppingCartIcon />}
          sx={{
            mt: 1,
            py: 1.5,
            fontSize: "1rem",
            fontWeight: "bold",
          }}
        >
          {buttonText}
        </Button>
      </Box>
    </Paper>
  );
};
