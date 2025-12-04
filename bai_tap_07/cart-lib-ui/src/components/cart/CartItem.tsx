import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveIcon from "@mui/icons-material/Remove";
import { Box, Button, ButtonGroup, Card, CardContent, CardMedia, IconButton, Typography } from "@mui/material";
import React from "react";
import { CartItemProps } from "../../types";

export const CartItem: React.FC<CartItemProps> = ({
  item,
  onRemove,
  onUpdateQuantity,
  showRemoveButton = true,
  showQuantityControls = true,
}) => {
  const handleIncrement = () => {
    if (onUpdateQuantity) {
      onUpdateQuantity(item.id, item.quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (onUpdateQuantity && item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1);
    }
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove(item.id);
    }
  };

  return (
    <Card
      sx={{
        display: "flex",
        mb: 2,
        boxShadow: 3,
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: 6,
        },
      }}
    >
      {item.image && (
        <CardMedia component="img" sx={{ width: 120, objectFit: "cover" }} image={item.image} alt={item.name} />
      )}
      <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <CardContent sx={{ flex: "1 0 auto" }}>
          <Typography component="div" variant="h6" fontWeight="bold">
            {item.name}
          </Typography>
          {item.description && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {item.description}
            </Typography>
          )}
          <Typography variant="h6" color="primary" fontWeight="bold">
            ${(item.price * item.quantity).toFixed(2)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ${item.price.toFixed(2)} × {item.quantity}
          </Typography>
        </CardContent>
        <Box sx={{ display: "flex", alignItems: "center", pl: 2, pb: 2, gap: 2 }}>
          {showQuantityControls && (
            <ButtonGroup size="small" variant="outlined">
              <Button onClick={handleDecrement} disabled={item.quantity <= 1}>
                <RemoveIcon fontSize="small" />
              </Button>
              <Button disabled sx={{ minWidth: 50, fontWeight: "bold" }}>
                {item.quantity}
              </Button>
              <Button onClick={handleIncrement}>
                <AddIcon fontSize="small" />
              </Button>
            </ButtonGroup>
          )}
          {showRemoveButton && (
            <IconButton aria-label="delete" color="error" onClick={handleRemove} sx={{ ml: "auto", mr: 1 }}>
              <DeleteIcon />
            </IconButton>
          )}
        </Box>
      </Box>
    </Card>
  );
};
