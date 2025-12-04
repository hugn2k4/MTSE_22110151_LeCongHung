export interface CartItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  description?: string;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export interface CartContextType extends CartState {
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (id: string | number) => void;
  updateQuantity: (id: string | number, quantity: number) => void;
  clearCart: () => void;
  getItem: (id: string | number) => CartItem | undefined;
}

export interface CartProviderProps {
  children: React.ReactNode;
  initialItems?: CartItem[];
  onCartChange?: (state: CartState) => void;
}

export interface CartItemProps {
  item: CartItem;
  onRemove?: (id: string | number) => void;
  onUpdateQuantity?: (id: string | number, quantity: number) => void;
  showRemoveButton?: boolean;
  showQuantityControls?: boolean;
}

export interface CartListProps {
  showTotal?: boolean;
  showCheckoutButton?: boolean;
  onCheckout?: () => void;
  emptyMessage?: string;
  checkoutButtonText?: string;
}

export interface CartAddFormProps {
  onAdd?: (item: CartItem) => void;
  buttonText?: string;
}

export interface ProductCardProps {
  id: string | number;
  name: string;
  price: number;
  image?: string;
  description?: string;
  onAddToCart?: (item: Omit<CartItem, "quantity">) => void;
  addButtonText?: string;
}
