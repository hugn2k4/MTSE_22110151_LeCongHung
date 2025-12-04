# 🛒 Cart Lib UI

[![npm version](https://img.shields.io/npm/v/@hugn10204/cart-lib-ui.svg)](https://www.npmjs.com/package/@hugn10204/cart-lib-ui)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A beautiful, production-ready React shopping cart library built with Material-UI components. Perfect for e-commerce applications with elegant design and full TypeScript support.

## ✨ Features

- 🎨 **Beautiful UI** - Styled with Material-UI for a modern, professional look
- 📦 **Complete Cart Management** - Add, remove, update quantities, and clear cart
- 🎯 **TypeScript Support** - Full type definitions included
- 🪝 **React Hooks** - Easy-to-use `useCart` hook for cart state management
- 🎭 **Customizable** - Flexible props for styling and behavior
- 📱 **Responsive** - Works perfectly on all screen sizes
- 🚀 **Lightweight** - Minimal bundle size with tree-shaking support

## 📦 Installation

```bash
npm install @hugn10204/cart-lib-ui
```

### Peer Dependencies

Make sure you have these installed:

```bash
npm install react react-dom @mui/material @emotion/react @emotion/styled @mui/icons-material
```

## 🚀 Quick Start

```tsx
import { CartProvider, CartList, CartAddForm } from "@hugn10204/cart-lib-ui";

function App() {
  return (
    <CartProvider>
      <div>
        <h1>My Shop</h1>
        <CartAddForm />
        <CartList showCheckoutButton onCheckout={() => alert("Proceeding to checkout!")} />
      </div>
    </CartProvider>
  );
}
```

## 📚 Components

### CartProvider

Wrap your app with `CartProvider` to enable cart functionality.

```tsx
import { CartProvider } from "@hugn10204/cart-lib-ui";

<CartProvider initialItems={[]} onCartChange={(state) => console.log("Cart updated:", state)}>
  {/* Your app */}
</CartProvider>;
```

**Props:**

- `initialItems?: CartItem[]` - Initial cart items
- `onCartChange?: (state: CartState) => void` - Callback when cart changes

### useCart Hook

Access cart state and methods anywhere in your app.

```tsx
import { useCart } from "@hugn10204/cart-lib-ui";

function MyComponent() {
  const { items, totalPrice, addItem, removeItem, updateQuantity, clearCart } = useCart();

  return (
    <div>
      <p>Total: ${totalPrice.toFixed(2)}</p>
      <button onClick={clearCart}>Clear Cart</button>
    </div>
  );
}
```

### CartList

Display all cart items with totals and checkout button.

```tsx
import { CartList } from "@hugn10204/cart-lib-ui";

<CartList
  showTotal={true}
  showCheckoutButton={true}
  onCheckout={() => console.log("Checkout clicked")}
  emptyMessage="Your cart is empty"
  checkoutButtonText="Checkout"
/>;
```

### CartItem

Display a single cart item (used internally by CartList, can be used standalone).

```tsx
import { CartItem } from "@hugn10204/cart-lib-ui";

<CartItem
  item={myItem}
  onRemove={(id) => console.log("Remove", id)}
  onUpdateQuantity={(id, qty) => console.log("Update", id, qty)}
  showRemoveButton={true}
  showQuantityControls={true}
/>;
```

### CartAddForm

Form to add new products to cart.

```tsx
import { CartAddForm } from "@hugn10204/cart-lib-ui";

<CartAddForm onAdd={(item) => console.log("Added:", item)} buttonText="Add to Cart" />;
```

### ProductCard

Beautiful product card with add to cart button.

```tsx
import { ProductCard, useCart } from "@hugn10204/cart-lib-ui";

function Products() {
  const { addItem } = useCart();

  return (
    <ProductCard
      id="1"
      name="Awesome Product"
      price={29.99}
      image="https://example.com/product.jpg"
      description="This is an amazing product"
      onAddToCart={addItem}
      addButtonText="Add to Cart"
    />
  );
}
```

## 🎨 Styling

All components use Material-UI and respect your MUI theme. Customize by wrapping with `ThemeProvider`:

```tsx
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CartProvider, CartList } from "@hugn10204/cart-lib-ui";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CartProvider>
        <CartList />
      </CartProvider>
    </ThemeProvider>
  );
}
```

## 📖 TypeScript

Full TypeScript support with exported types:

```tsx
import type { CartItemType, CartState, CartContextType } from "@hugn10204/cart-lib-ui";

const myItem: CartItemType = {
  id: "1",
  name: "Product",
  price: 19.99,
  quantity: 2,
  image: "https://example.com/image.jpg",
  description: "Product description",
};
```

## 🔧 API Reference

### CartItem Type

```typescript
interface CartItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  description?: string;
}
```

### Cart Methods

- `addItem(item)` - Add or increase quantity of an item
- `removeItem(id)` - Remove item from cart
- `updateQuantity(id, quantity)` - Update item quantity
- `clearCart()` - Remove all items
- `getItem(id)` - Get specific item by ID

## 📄 License

MIT © [Hung Le](https://github.com/hugn10204)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🐛 Issues

Found a bug? Please open an issue on [GitHub](https://github.com/hugn10204/cart-lib-ui/issues).

---

Made with ❤️ using React, TypeScript, and Material-UI
