const Product = require("../models/product");
const { Op } = require("sequelize");

// options: { page, limit, cursor }
const listByCategory = async (category, options = {}) => {
  try {
    // ensure some demo data exists
    const existing = await Product.findOne();
    if (!existing) {
      const sample = [
        // Thời trang
        { name: "Áo thun trắng Premium", description: "Áo thun cotton 100% cao cấp, thoáng mát, form dáng chuẩn", price: 120000, category: "Thời trang", image: "https://picsum.photos/600/400" },
        { name: "Quần jean Slim Fit", description: "Quần jean nam dáng ôm vừa vặn, chất liệu denim co giãn nhẹ", price: 450000, category: "Thời trang", image: "https://picsum.photos/800/500" },
        { name: "Áo sơ mi công sở", description: "Áo sơ mi nam dài tay, chất liệu kate mềm mại", price: 280000, category: "Thời trang", image: "https://picsum.photos/500/300" },
        { name: "Váy dạ hội", description: "Váy dạ hội sang trọng, thiết kế tinh tế", price: 850000, category: "Thời trang", image: "https://picsum.photos/700/450" },
        { name: "Giày thể thao", description: "Giày sneaker năng động, đế êm ái", price: 590000, category: "Thời trang", image: "https://picsum.photos/400/400" },
        { name: "Túi xách da", description: "Túi xách da cao cấp, thiết kế sang trọng", price: 1200000, category: "Thời trang", image: "https://picsum.photos/600/400?random=1" },
        
        // Điện tử
        { name: "Tai nghe Bluetooth ANC", description: "Tai nghe không dây chống ồn chủ động, pin 30h", price: 1450000, category: "Điện tử", image: "https://picsum.photos/800/500?random=2" },
        { name: "Sạc dự phòng 20000mAh", description: "Pin sạc dự phòng dung lượng cao, sạc nhanh PD 20W", price: 380000, category: "Điện tử", image: "https://picsum.photos/500/300?random=3" },
        { name: "Chuột gaming RGB", description: "Chuột chơi game DPI cao, LED RGB 16 triệu màu", price: 650000, category: "Điện tử", image: "https://picsum.photos/700/450?random=4" },
        { name: "Bàn phím cơ Blue Switch", description: "Bàn phím cơ 87 phím, switch blue, LED trắng", price: 890000, category: "Điện tử", image: "https://picsum.photos/400/400?random=5" },
        { name: "Webcam Full HD", description: "Webcam 1080p 60fps, micro tích hợp", price: 720000, category: "Điện tử", image: "https://picsum.photos/600/400?random=6" },
        { name: "Đồng hồ thông minh", description: "Smartwatch theo dõi sức khỏe, GPS, chống nước", price: 2100000, category: "Điện tử", image: "https://picsum.photos/800/500?random=7" },
        
        // Sách
        { name: "Sách NodeJS Nâng cao", description: "Học NodeJS từ cơ bản đến nâng cao, 500 trang", price: 180000, category: "Sách", image: "https://picsum.photos/500/300?random=8" },
        { name: "Sách ReactJS Complete Guide", description: "Hướng dẫn React toàn diện, hooks, context, redux", price: 210000, category: "Sách", image: "https://picsum.photos/700/450?random=9" },
        { name: "Sách Design Patterns", description: "23 mẫu thiết kế phần mềm kinh điển", price: 250000, category: "Sách", image: "https://picsum.photos/400/400?random=10" },
        { name: "Sách Clean Code", description: "Nghệ thuật viết code sạch và bảo trì tốt", price: 195000, category: "Sách", image: "https://picsum.photos/600/400?random=11" },
        
        // Gia dụng
        { name: "Nồi cơm điện 1.8L", description: "Nồi cơm điện thông minh, lòng nồi chống dính", price: 890000, category: "Gia dụng", image: "https://picsum.photos/800/500?random=12" },
        { name: "Máy xay sinh tố", description: "Máy xay công suất 500W, cối thủy tinh", price: 650000, category: "Gia dụng", image: "https://picsum.photos/500/300?random=13" },
        { name: "Bộ nồi inox 5 món", description: "Bộ nồi inox 304 cao cấp, đáy 3 lớp", price: 1200000, category: "Gia dụng", image: "https://picsum.photos/700/450?random=14" },
        { name: "Máy hút bụi cầm tay", description: "Máy hút bụi không dây, pin 45 phút", price: 980000, category: "Gia dụng", image: "https://picsum.photos/400/400?random=15" },
        
        // Thể thao
        { name: "Thảm tập Yoga", description: "Thảm yoga TPE 6mm, chống trượt, kèm túi đựng", price: 320000, category: "Thể thao", image: "https://picsum.photos/600/400?random=16" },
        { name: "Tạ tay 10kg (cặp)", description: "Bộ tạ tay bọc cao su, 10kg mỗi chiếc", price: 450000, category: "Thể thao", image: "https://picsum.photos/800/500?random=17" },
        { name: "Xe đạp thể thao", description: "Xe đạp địa hình 21 tốc độ, phanh đĩa", price: 3500000, category: "Thể thao", image: "https://picsum.photos/500/300?random=18" },
        { name: "Bóng đá Size 5", description: "Bóng đá chuẩn thi đấu, da PU cao cấp", price: 280000, category: "Thể thao", image: "https://picsum.photos/700/450?random=19" },
        
        // Làm đẹp
        { name: "Kem dưỡng da ban ngày", description: "Kem dưỡng ẩm chống nắng SPF 50", price: 420000, category: "Làm đẹp", image: "https://picsum.photos/400/400?random=20" },
        { name: "Son môi lì cao cấp", description: "Son lì lâu trôi, nhiều màu sắc", price: 180000, category: "Làm đẹp", image: "https://picsum.photos/600/400?random=21" },
        { name: "Mặt nạ dưỡng da", description: "Hộp 10 miếng mặt nạ dưỡng ẩm", price: 250000, category: "Làm đẹp", image: "https://picsum.photos/800/500?random=22" },
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

module.exports = {
  listByCategory,
  getProductById,
};
