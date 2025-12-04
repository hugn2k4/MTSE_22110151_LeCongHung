const { Cart, CartItem, Product } = require("../models");
const { sequelize } = require("../config/database");

// Lấy giỏ hàng của user
const getCartService = async (userId) => {
  try {
    // Tìm hoặc tạo cart cho user
    let cart = await Cart.findOne({
      where: { userId },
      include: [
        {
          model: CartItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
            },
          ],
        },
      ],
    });

    if (!cart) {
      cart = await Cart.create({ userId });
      cart.items = [];
    }

    // Tính toán tổng số lượng và giá
    const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const selectedTotalPrice = cart.items
      .filter((item) => item.selected)
      .reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    return {
      EC: 0,
      EM: "Lấy giỏ hàng thành công",
      data: {
        ...cart.toJSON(),
        totalItems,
        totalPrice,
        selectedTotalPrice,
      },
    };
  } catch (error) {
    console.error(">>> Error getCartService:", error);
    throw error;
  }
};

// Thêm sản phẩm vào giỏ hàng
const addToCartService = async (userId, productId, quantity) => {
  try {
    // Kiểm tra sản phẩm có tồn tại không
    const product = await Product.findByPk(productId);
    if (!product) {
      return {
        EC: 1,
        EM: "Sản phẩm không tồn tại",
      };
    }

    // Kiểm tra số lượng tồn kho
    if (product.stock < quantity) {
      return {
        EC: 2,
        EM: `Sản phẩm chỉ còn ${product.stock} sản phẩm trong kho`,
      };
    }

    // Tìm hoặc tạo cart
    let cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
      cart = await Cart.create({ userId });
    }

    // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
    let cartItem = await CartItem.findOne({
      where: { cartId: cart.id, productId },
    });

    if (cartItem) {
      // Cập nhật số lượng
      const newQuantity = cartItem.quantity + quantity;
      if (product.stock < newQuantity) {
        return {
          EC: 2,
          EM: `Không thể thêm. Số lượng tối đa là ${product.stock}`,
        };
      }
      cartItem.quantity = newQuantity;
      await cartItem.save();
    } else {
      // Tạo mới cart item
      cartItem = await CartItem.create({
        cartId: cart.id,
        productId,
        quantity,
        selected: false,
      });
    }

    // Lấy lại cart item với product info
    cartItem = await CartItem.findByPk(cartItem.id, {
      include: [
        {
          model: Product,
          as: "product",
        },
      ],
    });

    return {
      EC: 0,
      EM: "Thêm sản phẩm vào giỏ hàng thành công",
      data: cartItem,
    };
  } catch (error) {
    console.error(">>> Error addToCartService:", error);
    throw error;
  }
};

// Cập nhật số lượng sản phẩm trong giỏ hàng
const updateCartItemService = async (userId, cartItemId, quantity) => {
  try {
    // Tìm cart item
    const cartItem = await CartItem.findOne({
      where: { id: cartItemId },
      include: [
        {
          model: Cart,
          as: "cart",
          where: { userId },
        },
        {
          model: Product,
          as: "product",
        },
      ],
    });

    if (!cartItem) {
      return {
        EC: 1,
        EM: "Không tìm thấy sản phẩm trong giỏ hàng",
      };
    }

    // Kiểm tra số lượng tồn kho
    if (cartItem.product.stock < quantity) {
      return {
        EC: 2,
        EM: `Sản phẩm chỉ còn ${cartItem.product.stock} sản phẩm trong kho`,
      };
    }

    // Cập nhật số lượng
    cartItem.quantity = quantity;
    await cartItem.save();

    // Lấy lại cart item
    const updatedCartItem = await CartItem.findByPk(cartItem.id, {
      include: [
        {
          model: Product,
          as: "product",
        },
      ],
    });

    return {
      EC: 0,
      EM: "Cập nhật giỏ hàng thành công",
      data: updatedCartItem,
    };
  } catch (error) {
    console.error(">>> Error updateCartItemService:", error);
    throw error;
  }
};

// Xóa sản phẩm khỏi giỏ hàng
const removeFromCartService = async (userId, cartItemId) => {
  try {
    const cartItem = await CartItem.findOne({
      where: { id: cartItemId },
      include: [
        {
          model: Cart,
          as: "cart",
          where: { userId },
        },
      ],
    });

    if (!cartItem) {
      return {
        EC: 1,
        EM: "Không tìm thấy sản phẩm trong giỏ hàng",
      };
    }

    await cartItem.destroy();

    return {
      EC: 0,
      EM: "Xóa sản phẩm khỏi giỏ hàng thành công",
    };
  } catch (error) {
    console.error(">>> Error removeFromCartService:", error);
    throw error;
  }
};

// Chọn/bỏ chọn sản phẩm để thanh toán
const selectCartItemsService = async (userId, cartItemIds, selected) => {
  try {
    // Tìm cart của user
    const cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
      return {
        EC: 1,
        EM: "Không tìm thấy giỏ hàng",
      };
    }

    // Cập nhật selected cho các cart items
    await CartItem.update(
      { selected },
      {
        where: {
          id: cartItemIds,
          cartId: cart.id,
        },
      }
    );

    // Lấy lại giỏ hàng
    return await getCartService(userId);
  } catch (error) {
    console.error(">>> Error selectCartItemsService:", error);
    throw error;
  }
};

// Thanh toán các sản phẩm đã chọn
const checkoutService = async (userId) => {
  const transaction = await sequelize.transaction();

  try {
    // Tìm cart và các items đã được chọn
    const cart = await Cart.findOne({
      where: { userId },
      include: [
        {
          model: CartItem,
          as: "items",
          where: { selected: true },
          required: false,
          include: [
            {
              model: Product,
              as: "product",
            },
          ],
        },
      ],
      transaction,
    });

    if (!cart || !cart.items || cart.items.length === 0) {
      await transaction.rollback();
      return {
        EC: 1,
        EM: "Không có sản phẩm nào được chọn để thanh toán",
      };
    }

    // Kiểm tra số lượng tồn kho và tính tổng tiền
    let totalAmount = 0;
    const selectedItems = [];

    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        await transaction.rollback();
        return {
          EC: 2,
          EM: `Sản phẩm "${item.product.name}" chỉ còn ${item.product.stock} sản phẩm trong kho`,
        };
      }

      // Giảm số lượng trong kho
      await Product.update(
        { stock: item.product.stock - item.quantity },
        { where: { id: item.productId }, transaction }
      );

      totalAmount += item.product.price * item.quantity;
      selectedItems.push(item);
    }

    // Xóa các items đã thanh toán khỏi giỏ hàng
    await CartItem.destroy({
      where: {
        cartId: cart.id,
        selected: true,
      },
      transaction,
    });

    await transaction.commit();

    return {
      EC: 0,
      EM: "Thanh toán thành công",
      data: {
        selectedItems,
        totalAmount,
        itemCount: selectedItems.length,
      },
    };
  } catch (error) {
    await transaction.rollback();
    console.error(">>> Error checkoutService:", error);
    throw error;
  }
};

module.exports = {
  getCartService,
  addToCartService,
  updateCartItemService,
  removeFromCartService,
  selectCartItemsService,
  checkoutService,
};
