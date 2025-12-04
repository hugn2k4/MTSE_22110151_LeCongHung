import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { Box, Button, Card, CardContent, CardMedia, Typography } from "@mui/material";
import React from "react";
import { ProductCardProps } from "../../types";

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  image,
  description,
  onAddToCart,
  addButtonText = "Thêm vào giỏ",
}) => {
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart({ id, name, price, image, description });
    }
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        boxShadow: 3,
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 8,
        },
      }}
    >
      {image && <CardMedia component="img" height="200" image={image} alt={name} sx={{ objectFit: "cover" }} />}
      <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Typography gutterBottom variant="h6" component="h3" fontWeight="bold">
          {name}
        </Typography>
        {description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
            {description}
          </Typography>
        )}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: "auto" }}>
          <Typography variant="h5" color="primary" fontWeight="bold">
            ${price.toFixed(2)}
          </Typography>
          <Button
            variant="contained"
            size="small"
            startIcon={<AddShoppingCartIcon />}
            onClick={handleAddToCart}
            sx={{ fontWeight: "bold" }}
          >
            {addButtonText}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};
