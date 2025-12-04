const Product = require("../models/product");
const { Op } = require("sequelize");
const Fuse = require("fuse.js");

// options: { page, limit, cursor }
const listByCategory = async (category, options = {}) => {
  try {
    // ensure some demo data exists
    const existing = await Product.findOne();
    if (!existing) {
      const sample = [
        // Thời trang
        {
          name: "Áo thun trắng Premium",
          description: "Áo thun cotton 100% cao cấp, thoáng mát, form dáng chuẩn",
          price: 120000,
          category: "Thời trang",
          image: "https://picsum.photos/600/400",
          discount: 10,
          views: 150,
          stock: 50,
          rating: 4.5,
        },
        {
          name: "Quần jean Slim Fit",
          description: "Quần jean nam dáng ôm vừa vặn, chất liệu denim co giãn nhẹ",
          price: 450000,
          category: "Thời trang",
          image: "https://picsum.photos/800/500",
          discount: 15,
          views: 230,
          stock: 30,
          rating: 4.7,
        },
        {
          name: "Áo sơ mi công sở",
          description: "Áo sơ mi nam dài tay, chất liệu kate mềm mại",
          price: 280000,
          category: "Thời trang",
          image: "https://picsum.photos/500/300",
          discount: 0,
          views: 89,
          stock: 45,
          rating: 4.3,
        },
        {
          name: "Váy dạ hội",
          description: "Váy dạ hội sang trọng, thiết kế tinh tế",
          price: 850000,
          category: "Thời trang",
          image: "https://picsum.photos/700/450",
          discount: 20,
          views: 312,
          stock: 15,
          rating: 4.8,
        },
        {
          name: "Giày thể thao",
          description: "Giày sneaker năng động, đế êm ái",
          price: 590000,
          category: "Thời trang",
          image: "https://picsum.photos/400/400",
          discount: 25,
          views: 567,
          stock: 80,
          rating: 4.6,
        },
        {
          name: "Túi xách da",
          description: "Túi xách da cao cấp, thiết kế sang trọng",
          price: 1200000,
          category: "Thời trang",
          image: "https://picsum.photos/600/400?random=1",
          discount: 5,
          views: 198,
          stock: 22,
          rating: 4.4,
        },

        // Điện tử
        {
          name: "Tai nghe Bluetooth ANC",
          description: "Tai nghe không dây chống ồn chủ động, pin 30h",
          price: 1450000,
          category: "Điện tử",
          image: "https://picsum.photos/800/500?random=2",
          discount: 30,
          views: 890,
          stock: 60,
          rating: 4.9,
        },
        {
          name: "Sạc dự phòng 20000mAh",
          description: "Pin sạc dự phòng dung lượng cao, sạc nhanh PD 20W",
          price: 380000,
          category: "Điện tử",
          image: "https://picsum.photos/500/300?random=3",
          discount: 15,
          views: 445,
          stock: 120,
          rating: 4.5,
        },
        {
          name: "Chuột gaming RGB",
          description: "Chuột chơi game DPI cao, LED RGB 16 triệu màu",
          price: 650000,
          category: "Điện tử",
          image: "https://picsum.photos/700/450?random=4",
          discount: 20,
          views: 678,
          stock: 75,
          rating: 4.7,
        },
        {
          name: "Bàn phím cơ Blue Switch",
          description: "Bàn phím cơ 87 phím, switch blue, LED trắng",
          price: 890000,
          category: "Điện tử",
          image: "https://picsum.photos/400/400?random=5",
          discount: 10,
          views: 523,
          stock: 40,
          rating: 4.8,
        },
        {
          name: "Webcam Full HD",
          description: "Webcam 1080p 60fps, micro tích hợp",
          price: 720000,
          category: "Điện tử",
          image: "https://picsum.photos/600/400?random=6",
          discount: 0,
          views: 234,
          stock: 55,
          rating: 4.3,
        },
        {
          name: "Đồng hồ thông minh",
          description: "Smartwatch theo dõi sức khỏe, GPS, chống nước",
          price: 2100000,
          category: "Điện tử",
          image: "https://picsum.photos/800/500?random=7",
          discount: 35,
          views: 1234,
          stock: 30,
          rating: 4.9,
        },

        // Sách
        {
          name: "Sách NodeJS Nâng cao",
          description: "Học NodeJS từ cơ bản đến nâng cao, 500 trang",
          price: 180000,
          category: "Sách",
          image: "https://picsum.photos/500/300?random=8",
          discount: 0,
          views: 156,
          stock: 100,
          rating: 4.6,
        },
        {
          name: "Sách ReactJS Complete Guide",
          description: "Hướng dẫn React toàn diện, hooks, context, redux",
          price: 210000,
          category: "Sách",
          image: "https://picsum.photos/700/450?random=9",
          discount: 5,
          views: 289,
          stock: 85,
          rating: 4.7,
        },
        {
          name: "Sách Design Patterns",
          description: "23 mẫu thiết kế phần mềm kinh điển",
          price: 250000,
          category: "Sách",
          image: "https://picsum.photos/400/400?random=10",
          discount: 10,
          views: 423,
          stock: 60,
          rating: 4.8,
        },
        {
          name: "Sách Clean Code",
          description: "Nghệ thuật viết code sạch và bảo trì tốt",
          price: 195000,
          category: "Sách",
          image: "https://picsum.photos/600/400?random=11",
          discount: 0,
          views: 567,
          stock: 75,
          rating: 4.9,
        },

        // Gia dụng
        {
          name: "Nồi cơm điện 1.8L",
          description: "Nồi cơm điện thông minh, lòng nồi chống dính",
          price: 890000,
          category: "Gia dụng",
          image: "https://picsum.photos/800/500?random=12",
          discount: 15,
          views: 345,
          stock: 40,
          rating: 4.4,
        },
        {
          name: "Máy xay sinh tố",
          description: "Máy xay công suất 500W, cối thủy tinh",
          price: 650000,
          category: "Gia dụng",
          image: "https://picsum.photos/500/300?random=13",
          discount: 20,
          views: 278,
          stock: 50,
          rating: 4.3,
        },
        {
          name: "Bộ nồi inox 5 món",
          description: "Bộ nồi inox 304 cao cấp, đáy 3 lớp",
          price: 1200000,
          category: "Gia dụng",
          image: "https://picsum.photos/700/450?random=14",
          discount: 10,
          views: 189,
          stock: 25,
          rating: 4.6,
        },
        {
          name: "Máy hút bụi cầm tay",
          description: "Máy hút bụi không dây, pin 45 phút",
          price: 980000,
          category: "Gia dụng",
          image: "https://picsum.photos/400/400?random=15",
          discount: 25,
          views: 412,
          stock: 35,
          rating: 4.5,
        },

        // Thể thao
        {
          name: "Thảm tập Yoga",
          description: "Thảm yoga TPE 6mm, chống trượt, kèm túi đựng",
          price: 320000,
          category: "Thể thao",
          image: "https://picsum.photos/600/400?random=16",
          discount: 0,
          views: 234,
          stock: 90,
          rating: 4.2,
        },
        {
          name: "Tạ tay 10kg (cặp)",
          description: "Bộ tạ tay bọc cao su, 10kg mỗi chiếc",
          price: 450000,
          category: "Thể thao",
          image: "https://picsum.photos/800/500?random=17",
          discount: 15,
          views: 456,
          stock: 45,
          rating: 4.6,
        },
        {
          name: "Xe đạp thể thao",
          description: "Xe đạp địa hình 21 tốc độ, phanh đĩa",
          price: 3500000,
          category: "Thể thao",
          image: "https://picsum.photos/500/300?random=18",
          discount: 10,
          views: 789,
          stock: 12,
          rating: 4.7,
        },
        {
          name: "Bóng đá Size 5",
          description: "Bóng đá chuẩn thi đấu, da PU cao cấp",
          price: 280000,
          category: "Thể thao",
          image: "https://picsum.photos/700/450?random=19",
          discount: 5,
          views: 321,
          stock: 100,
          rating: 4.4,
        },

        // Làm đẹp
        {
          name: "Kem dưỡng da ban ngày",
          description: "Kem dưỡng ẩm chống nắng SPF 50",
          price: 420000,
          category: "Làm đẹp",
          image: "https://picsum.photos/400/400?random=20",
          discount: 20,
          views: 567,
          stock: 70,
          rating: 4.5,
        },
        {
          name: "Son môi lì cao cấp",
          description: "Son lì lâu trôi, nhiều màu sắc",
          price: 180000,
          category: "Làm đẹp",
          image: "https://picsum.photos/600/400?random=21",
          discount: 15,
          views: 890,
          stock: 150,
          rating: 4.7,
        },
        {
          name: "Mặt nạ dưỡng da",
          description: "Hộp 10 miếng mặt nạ dưỡng ẩm",
          price: 250000,
          category: "Làm đẹp",
          image: "https://picsum.photos/800/500?random=22",
          discount: 10,
          views: 456,
          stock: 80,
          rating: 4.6,
        },
      ];
      await Product.bulkCreate(sample);
      console.log(`>>> Đã tạo ${sample.length} sản phẩm mẫu`);
    }
    const limit = parseInt(options.limit) || 12;
    const page = parseInt(options.page) || 1;
    const cursor = options.cursor ? parseInt(options.cursor) : null;

    // Cursor-based (infinite scroll) if cursor provided
    if (cursor) {
      const items = await Product.findAll({
        where: {
          category,
          id: { [Op.gt]: cursor },
        },
        order: [["id", "ASC"]],
        limit,
      });
      const nextCursor = items.length ? items[items.length - 1].id : null;
      return { items, nextCursor };
    }

    // Offset-based pagination
    const offset = (page - 1) * limit;
    const { rows: items, count: total } = await Product.findAndCountAll({
      where: category ? { category } : {},
      order: [["id", "DESC"]],
      limit,
      offset,
    });

    return { items, total, page, limit };
  } catch (e) {
    console.error(">>> Error listByCategory:", e);
    throw e;
  }
};

const getProductById = async (id) => {
  try {
    const product = await Product.findByPk(id);
    return product;
  } catch (e) {
    console.error(">>> Error getProductById:", e);
    throw e;
  }
};

/**
 * Advanced product search with fuzzy search and multiple filters
 * @param {Object} filters - Search filters
 * @param {string} filters.q - Search query (fuzzy search on name and description)
 * @param {string} filters.category - Filter by category
 * @param {number} filters.minPrice - Minimum price
 * @param {number} filters.maxPrice - Maximum price
 * @param {number} filters.minDiscount - Minimum discount percentage
 * @param {number} filters.hasDiscount - Filter products with discount (true/false)
 * @param {number} filters.minViews - Minimum views count
 * @param {number} filters.minRating - Minimum rating
 * @param {boolean} filters.inStock - Filter only in-stock products
 * @param {string} filters.sortBy - Sort field (price, views, rating, discount, created_at)
 * @param {string} filters.sortOrder - Sort order (asc, desc)
 * @param {number} filters.page - Page number
 * @param {number} filters.limit - Items per page
 */
const searchProducts = async (filters = {}) => {
  try {
    const {
      q,
      category,
      minPrice,
      maxPrice,
      minDiscount,
      hasDiscount,
      minViews,
      minRating,
      inStock,
      sortBy = "id",
      sortOrder = "DESC",
      page = 1,
      limit = 12,
    } = filters;

    // Build WHERE conditions for database query
    const whereConditions = {};

    // Category filter
    if (category) {
      whereConditions.category = category;
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      whereConditions.price = {};
      if (minPrice !== undefined) {
        whereConditions.price[Op.gte] = parseFloat(minPrice);
      }
      if (maxPrice !== undefined) {
        whereConditions.price[Op.lte] = parseFloat(maxPrice);
      }
    }

    // Discount filters
    if (minDiscount !== undefined && minDiscount !== null && minDiscount !== "") {
      if (hasDiscount === "true" || hasDiscount === true) {
        // Both conditions: minDiscount AND hasDiscount
        whereConditions.discount = {
          [Op.and]: [{ [Op.gte]: parseFloat(minDiscount) }, { [Op.gt]: 0 }],
        };
      } else {
        whereConditions.discount = { [Op.gte]: parseFloat(minDiscount) };
      }
    } else if (hasDiscount === "true" || hasDiscount === true) {
      // Only hasDiscount condition
      whereConditions.discount = { [Op.gt]: 0 };
    }

    // Views filter
    if (minViews !== undefined && minViews !== null && minViews !== "") {
      whereConditions.views = { [Op.gte]: parseInt(minViews) };
    }

    // Rating filter
    if (minRating !== undefined && minRating !== null && minRating !== "") {
      whereConditions.rating = { [Op.gte]: parseFloat(minRating) };
    }

    // Stock filter
    if (inStock === "true" || inStock === true) {
      whereConditions.stock = { [Op.gt]: 0 };
    }

    // Fetch products from database
    const allProducts = await Product.findAll({
      where: whereConditions,
      order: [[sortBy, sortOrder.toUpperCase()]],
    });

    let filteredProducts = allProducts;

    // Apply fuzzy search if query provided
    if (q && q.trim()) {
      const fuse = new Fuse(allProducts, {
        keys: [
          { name: "name", weight: 0.7 },
          { name: "description", weight: 0.3 },
        ],
        threshold: 0.4, // 0.0 = perfect match, 1.0 = match anything
        includeScore: true,
        minMatchCharLength: 2,
      });

      const fuseResults = fuse.search(q.trim());
      filteredProducts = fuseResults.map((result) => result.item);
    }

    // Pagination
    const total = filteredProducts.length;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const paginatedProducts = filteredProducts.slice(offset, offset + parseInt(limit));

    return {
      items: paginatedProducts,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
      filters: {
        q,
        category,
        minPrice,
        maxPrice,
        minDiscount,
        hasDiscount,
        minViews,
        minRating,
        inStock,
        sortBy,
        sortOrder,
      },
    };
  } catch (e) {
    console.error(">>> Error searchProducts:", e);
    throw e;
  }
};

// Lấy sản phẩm tương tự (cùng category, trừ sản phẩm hiện tại)
const getSimilarProducts = async (productId, limit = 6) => {
  try {
    const product = await Product.findByPk(productId);
    if (!product) {
      return [];
    }

    const similarProducts = await Product.findAll({
      where: {
        category: product.category,
        id: { [Op.ne]: productId },
      },
      order: [["views", "DESC"]],
      limit: parseInt(limit),
    });

    return similarProducts;
  } catch (e) {
    console.error(">>> Error getSimilarProducts:", e);
    throw e;
  }
};

// Lấy thống kê sản phẩm (số lượt mua, số bình luận)
const getProductStatsService = async (productId) => {
  try {
    const { Purchase, Comment, Favorite } = require("../models");

    // Đếm số lượt mua (unique users)
    const purchaseCount = await Purchase.count({
      where: { productId },
      distinct: true,
      col: "userId",
    });

    // Đếm số bình luận
    const commentCount = await Comment.count({
      where: { productId },
    });

    // Đếm số lượt yêu thích
    const favoriteCount = await Favorite.count({
      where: { productId },
    });

    return {
      EC: 0,
      data: {
        purchaseCount,
        commentCount,
        favoriteCount,
      },
    };
  } catch (e) {
    console.error(">>> Error getProductStatsService:", e);
    throw e;
  }
};

module.exports = {
  listByCategory,
  getProductById,
  searchProducts,
  getSimilarProducts,
  getProductStatsService,
};
