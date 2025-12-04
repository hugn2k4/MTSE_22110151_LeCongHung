import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Box, Button, Container, Divider, Paper, Typography } from "@mui/material";
import React from "react";
import { CartListProps } from "../../types";
import { CartItem } from "./CartItem";
import { useCart } from "./CartProvider";

export const CartList: React.FC<CartListProps> = ({
  showTotal = true,
  showCheckoutButton = true,
  onCheckout,
  emptyMessage = "Giỏ hàng của bạn đang trống",
  checkoutButtonText = "Thanh toán",
}) => {
  const { items, totalItems, totalPrice, removeItem, updateQuantity } = useCart();

  if (items.length === 0) {
    return (
      <Container maxWidth="md">
        <Paper
          elevation={3}
          sx={{
            p: 6,
            textAlign: "center",
            backgroundColor: "#f5f5f5",
            borderRadius: 2,
          }}
        >
          <ShoppingCartIcon
            sx={{
              fontSize: 80,
              color: "text.secondary",
              mb: 2,
            }}
          />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            {emptyMessage}
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <ShoppingCartIcon sx={{ fontSize: 32, mr: 1, color: "primary.main" }} />
          <Typography variant="h4" component="h2" fontWeight="bold">
            Giỏ hàng
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ ml: 2 }}>
            ({totalItems} sản phẩm)
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Box>
          {items.map((item) => (
            <CartItem key={item.id} item={item} onRemove={removeItem} onUpdateQuantity={updateQuantity} />
          ))}
        </Box>

        {showTotal && (
          <>
            <Divider sx={{ my: 3 }} />
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <Typography variant="h6">Tổng số lượng:</Typography>
              <Typography variant="h6" fontWeight="bold">
                {totalItems} sản phẩm
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
              <Typography variant="h5" fontWeight="bold">
                Tổng tiền:
              </Typography>
              <Typography variant="h5" color="primary" fontWeight="bold">
                ${totalPrice.toFixed(2)}
              </Typography>
            </Box>
          </>
        )}

        {showCheckoutButton && (
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={onCheckout}
            sx={{
              py: 1.5,
              fontSize: "1.1rem",
              fontWeight: "bold",
              boxShadow: 3,
              "&:hover": {
                boxShadow: 6,
              },
            }}
          >
            {checkoutButtonText}
          </Button>
        )}
      </Paper>
    </Container>
  );
};
