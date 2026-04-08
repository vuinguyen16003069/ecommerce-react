'use strict';

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const Product    = require('../models/Product');
const User       = require('../models/User');
const Role       = require('../models/Role');
const Permission = require('../models/Permission');
const Post       = require('../models/Post');
const Coupon     = require('../models/Coupon');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/jshop';

const img = (id) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=500`;

const mockProducts = [
  {
    _id: '69c9eb9760f11a220a75975b',
    name: 'Áo Khoác Bomber',
    price: 650000, category: 'Thời trang nam',
    image: img('1591047139829-d91aecb6caea'),
    images: [img('1591047139829-d91aecb6caea')],
    rating: 4.7, sold: 45, stock: 20,
    desc: 'Phong cách đường phố năng động, giữ ấm tốt.',
    reviews: [], isFlashSale: true, flashSaleDiscount: 35, createdAt: '2023-01-04',
  },
  {
    _id: '69c9eb9760f11a220a759751',
    name: 'Áo Thun Basic Cotton 100%',
    price: 150000, category: 'Thời trang nam',
    image: img('1521572163474-6864f9cf17ab'),
    images: [img('1521572163474-6864f9cf17ab'), img('1581655353564-df123a1eb820')],
    rating: 4.5, sold: 120, stock: 50,
    desc: 'Chất liệu thoáng mát, thấm hút mồ hôi tốt. Phù hợp mặc hàng ngày.',
    reviews: [], isFlashSale: true, flashSaleDiscount: 50, createdAt: '2023-01-01',
  },
  {
    _id: '69c9eb9760f11a220a759752',
    name: 'Áo Sơ Mi Oxford Nam',
    price: 280000, category: 'Thời trang nam',
    image: img('1594938298603-c8148c4dae35'),
    images: [img('1594938298603-c8148c4dae35')],
    rating: 4.7, sold: 87, stock: 30,
    desc: 'Vải Oxford cao cấp, phù hợp công sở lẫn dạo phố.',
    reviews: [], isFlashSale: false, flashSaleDiscount: 0, createdAt: '2023-01-02',
  },
  {
    _id: '69c9eb9760f11a220a759753',
    name: 'Quần Jeans Skinny Xanh',
    price: 320000, category: 'Thời trang nam',
    image: img('1542272604-787c3835535d'),
    images: [img('1542272604-787c3835535d')],
    rating: 4.6, sold: 156, stock: 40,
    desc: 'Vải denim bền, form ôm vừa vặn.',
    reviews: [], isFlashSale: false, flashSaleDiscount: 0, createdAt: '2023-01-03',
  },
  {
    _id: '69c9eb9760f11a220a759754',
    name: 'Quần Chinos Beige',
    price: 380000, category: 'Thời trang nam',
    image: img('1667844485987-80c84a3c3210'),
    images: [img('1667844485987-80c84a3c3210')],
    rating: 4.4, sold: 92, stock: 35,
    desc: 'Thoải mái khi mặc, phù hợp công sở lẫn đi chơi.',
    reviews: [], isFlashSale: false, flashSaleDiscount: 0, createdAt: '2023-01-05',
  },

  {
    _id: '69c9eb9760f11a220a759755',
    name: 'Váy Hoa Nhí Vintage',
    price: 350000, category: 'Thời trang nữ',
    image: img('1515372039744-b8f02a3ae446'),
    images: [img('1515372039744-b8f02a3ae446')],
    rating: 4.3, sold: 210, stock: 45,
    desc: 'Phong cách nhẹ nhàng, vải voan lụa cao cấp, nhiều hoạ tiết hoa.',
    reviews: [], isFlashSale: true, flashSaleDiscount: 40, createdAt: '2023-02-01',
  },
  {
    _id: '69c9eb9760f11a220a759756',
    name: 'Áo Crop Top Đen',
    price: 180000, category: 'Thời trang nữ',
    image: img('1618354691373-d851c5c3a990'),
    images: [img('1618354691373-d851c5c3a990')],
    rating: 4.8, sold: 234, stock: 55,
    desc: 'Thiết kế hiện đại, phù hợp mọi dịp.',
    reviews: [], isFlashSale: false, flashSaleDiscount: 0, createdAt: '2023-02-02',
  },
  {
    _id: '69c9eb9760f11a220a759757',
    name: 'Quần Jogger Nữ',
    price: 220000, category: 'Thời trang nữ',
    image: img('1571019614242-c5c5dee9f50b'),
    images: [img('1571019614242-c5c5dee9f50b')],
    rating: 4.5, sold: 178, stock: 60,
    desc: 'Thoải mái, lý tưởng cho hoạt động thể thao và tập gym.',
    reviews: [], isFlashSale: false, flashSaleDiscount: 0, createdAt: '2023-02-03',
  },
  {
    _id: '69c9eb9760f11a220a759758',
    name: 'Áo Khoác Cardigan',
    price: 420000, category: 'Thời trang nữ',
    image: img('1434389677669-e08b4cac3105'),
    images: [img('1434389677669-e08b4cac3105')],
    rating: 4.6, sold: 134, stock: 28,
    desc: 'Chất liệu mềm mại, tạo kiểu dáng nữ tính thanh lịch.',
    reviews: [], isFlashSale: false, flashSaleDiscount: 0, createdAt: '2023-02-04',
  },

  {
    _id: '69c9eb9760f11a220a759759',
    name: 'Giày Sneaker Sport Pro',
    price: 850000, category: 'Giày dép',
    image: img('1542291026-7eec264c27ff'),
    images: [img('1542291026-7eec264c27ff')],
    rating: 5, sold: 54, stock: 25,
    desc: 'Đế êm, chuyên dụng chạy bộ, thiết kế khí động học hiện đại.',
    reviews: [], isFlashSale: true, flashSaleDiscount: 50, createdAt: '2023-03-01',
  },
  {
    _id: '69c9eb9760f11a220a75975a',
    name: 'Giày Slip-on Vải',
    price: 280000, category: 'Giày dép',
    image: img('1649920566440-eb5678255340'),
    images: [img('1649920566440-eb5678255340')],
    rating: 4.4, sold: 121, stock: 42,
    desc: 'Dễ mang, thoải mái cho ngày thường.',
    reviews: [], isFlashSale: false, flashSaleDiscount: 0, createdAt: '2023-03-02',
  },
  {
    _id: '69c9eb9760f11a220a75975c',
    name: 'Dép Xỏ Ngón Cao Cấp',
    price: 120000, category: 'Giày dép',
    image: img('1659963970293-b12cfeb286c5'),
    images: [img('1659963970293-b12cfeb286c5')],
    rating: 4.3, sold: 267, stock: 100,
    desc: 'Nhẹ, thoáng mát, lý tưởng cho mùa hè.',
    reviews: [], isFlashSale: false, flashSaleDiscount: 0, createdAt: '2023-03-03',
  },
  {
    _id: '69c9eb9760f11a220a75975d',
    name: 'Giày Boot Cao Cổ',
    price: 720000, category: 'Giày dép',
    image: img('1735653104441-68983326a042'),
    images: [img('1735653104441-68983326a042')],
    rating: 4.7, sold: 43, stock: 18,
    desc: 'Chất lượng cao, thích hợp mặc trang trọng và đi dạo.',
    reviews: [], isFlashSale: false, flashSaleDiscount: 0, createdAt: '2023-03-04',
  },

  {
    _id: '69c9eb9760f11a220a75975e',
    name: 'Đồng Hồ Classic Leather',
    price: 1200000, category: 'Phụ kiện',
    image: img('1524592094714-0f0654e20314'),
    images: [img('1524592094714-0f0654e20314')],
    rating: 4, sold: 32, stock: 15,
    desc: 'Dây da thật, chống nước 3ATM. Kính sapphire chống trầy.',
    reviews: [], isFlashSale: false, flashSaleDiscount: 0, createdAt: '2023-04-01',
  },
  {
    _id: '69c9eb9760f11a220a75975f',
    name: 'Ba Lô Laptop Chống Nước',
    price: 450000, category: 'Phụ kiện',
    image: img('1553062407-98eeb64c6a62'),
    images: [img('1553062407-98eeb64c6a62')],
    rating: 4.8, sold: 89, stock: 100,
    desc: 'Đựng vừa laptop 15.6 inch, ngăn đệm chống sốc.',
    reviews: [], isFlashSale: false, flashSaleDiscount: 0, createdAt: '2023-04-02',
  },
  {
    _id: '69c9eb9760f11a220a759760',
    name: 'Túi Xách Da Công Sở',
    price: 950000, category: 'Phụ kiện',
    image: img('1584917865442-de89df76afd3'),
    images: [img('1584917865442-de89df76afd3')],
    rating: 4.6, sold: 28, stock: 20,
    desc: 'Da tổng hợp cao cấp, dáng sang trọng chuyên nghiệp.',
    reviews: [], isFlashSale: false, flashSaleDiscount: 0, createdAt: '2023-04-03',
  },
  {
    _id: '69c9eb9760f11a220a759761',
    name: 'Dây Chuyền Mạ Vàng',
    price: 320000, category: 'Phụ kiện',
    image: img('1599643478518-a784e5dc4c8f'),
    images: [img('1599643478518-a784e5dc4c8f')],
    rating: 4.5, sold: 156, stock: 80,
    desc: 'Thiết kế thanh lịch, bền lâu không phai màu.',
    reviews: [], isFlashSale: false, flashSaleDiscount: 0, createdAt: '2023-04-04',
  },
  {
    _id: '69c9eb9760f11a220a759762',
    name: 'Nón Lưỡi Trai',
    price: 140000, category: 'Phụ kiện',
    image: img('1644028297513-06dbfbde5b2a'),
    images: [img('1644028297513-06dbfbde5b2a')],
    rating: 4.2, sold: 198, stock: 75,
    desc: 'Chỉnh size được, phù hợp mọi khuôn mặt.',
    reviews: [], isFlashSale: false, flashSaleDiscount: 0, createdAt: '2023-04-05',
  },

  {
    _id: '69c9eb9760f11a220a759763',
    name: 'Tai Nghe Bluetooth Bass',
    price: 590000, category: 'Công nghệ',
    image: img('1505740420928-5e560c06d30e'),
    images: [img('1505740420928-5e560c06d30e')],
    rating: 4.9, sold: 300, stock: 70,
    desc: 'Pin 20h, chống ồn chủ động ANC. Âm bass mạnh mẽ.',
    reviews: [], isFlashSale: false, flashSaleDiscount: 0, createdAt: '2023-05-01',
  },
  {
    _id: '69c9eb9760f11a220a759764',
    name: 'Sạc Nhanh 65W',
    price: 180000, category: 'Công nghệ',
    image: img('1558618666-fcd25c85cd64'),
    images: [img('1558618666-fcd25c85cd64')],
    rating: 4.6, sold: 245, stock: 120,
    desc: 'Tương thích nhiều thiết thiết bị, sạc nhanh và an toàn.',
    reviews: [], isFlashSale: false, flashSaleDiscount: 0, createdAt: '2023-05-02',
  },
  {
    _id: '69c9eb9760f11a220a759765',
    name: 'Pin Dự Phòng 20000mAh',
    price: 320000, category: 'Công nghệ',
    image: img('1585771724684-38269d6639fd'),
    images: [img('1585771724684-38269d6639fd')],
    rating: 4.7, sold: 167, stock: 90,
    desc: 'Hỗ trợ sạc nhanh 18W, màn hình LED hiển thị dung lượng pin.',
    reviews: [], isFlashSale: false, flashSaleDiscount: 0, createdAt: '2023-05-03',
  },

  // --- Adidas ---
  {
    _id: '69c9eb9760f11a220a759766',
    name: 'Adidas Ultraboost 22',
    price: 2890000, category: 'Adidas',
    image: img('1549298916-b41d501d3772'),
    images: [img('1549298916-b41d501d3772')],
    rating: 4.9, sold: 156, stock: 30,
    desc: 'Công nghệ đệm Boost tối ưu hoá năng lượng hoàn trả, đế Continental Rubber siêu bám. Upper Primeknit+ ôm chân hoàn hảo, lý tưởng cho chạy marathon và luyện tập hàng ngày.',
    reviews: [], isFlashSale: true, flashSaleDiscount: 20, createdAt: '2023-06-01',
  },
  {
    _id: '69c9eb9760f11a220a759767',
    name: 'Adidas Stan Smith Classic',
    price: 1650000, category: 'Adidas',
    image: img('1576566588028-4147f3842f27'),
    images: [img('1576566588028-4147f3842f27')],
    rating: 4.7, sold: 312, stock: 50,
    desc: 'Biểu tượng thời trang từ 1973, da bê cao cấp thân thiện môi trường với 3 sọc lỗ đặc trưng và tên Stan Smith in nổi ở gót. Thiết kế kinh điển bất hủ.',
    reviews: [], isFlashSale: false, flashSaleDiscount: 0, createdAt: '2023-06-02',
  },
  {
    _id: '69c9eb9760f11a220a759768',
    name: 'Adidas Superstar Originals',
    price: 1890000, category: 'Adidas',
    image: img('1560769629-975ec94e6a86'),
    images: [img('1560769629-975ec94e6a86')],
    rating: 4.8, sold: 275, stock: 45,
    desc: 'Mũi giày vỏ sò huyền thoại ra đời 1969, da đúc cao cấp cùng 3 sọc bên hông. Biểu tượng văn hoá hip-hop, đế cao su xương cá siêu bám.',
    reviews: [], isFlashSale: false, flashSaleDiscount: 0, createdAt: '2023-06-03',
  },
  {
    _id: '69c9eb9760f11a220a759769',
    name: 'Adidas NMD R1 Boost',
    price: 2490000, category: 'Adidas',
    image: img('1579338559194-a162d19bf842'),
    images: [img('1579338559194-a162d19bf842')],
    rating: 4.8, sold: 189, stock: 35,
    desc: 'Công nghệ Boost full-length tối ưu, plug EVA giả 3D và upper Primeknit ôm nhẹ. Thiết kế streetwear hiện đại, thoải mái đi cả ngày dài.',
    reviews: [], isFlashSale: true, flashSaleDiscount: 15, createdAt: '2023-06-04',
  },
  {
    _id: '69c9eb9760f11a220a75976a',
    name: 'Adidas Gazelle Indoor',
    price: 1750000, category: 'Adidas',
    image: img('1605348532760-6753d2c43329'),
    images: [img('1605348532760-6753d2c43329')],
    rating: 4.6, sold: 142, stock: 40,
    desc: 'Phong cách retro 70s, upper da lộn (suede) mềm mịn với 3 sọc Adidas và logo lá phong vàng ở gót. Lót vải dệt thoáng khí, đế cao su dẻo.',
    reviews: [], isFlashSale: false, flashSaleDiscount: 0, createdAt: '2023-06-05',
  },
  {
    _id: '69c9eb9760f11a220a75976b',
    name: 'Adidas Forum Low',
    price: 1990000, category: 'Adidas',
    image: img('1502982720700-bfff97f2ecac'),
    images: [img('1502982720700-bfff97f2ecac')],
    rating: 4.7, sold: 207, stock: 38,
    desc: 'Huyền thoại bóng rổ 1984, da đúc cổ thấp với dây khóa kéo đặc trưng trên cổ chân. Đế herringbone bám đường, viền nhựa gia cố gót và mũi giày.',
    reviews: [], isFlashSale: false, flashSaleDiscount: 0, createdAt: '2023-06-06',
  },
  {
    _id: '69c9eb9760f11a220a75976c',
    name: 'Adidas Samba OG',
    price: 2250000, category: 'Adidas',
    image: img('1512374382149-233c42b6a83b'),
    images: [img('1512374382149-233c42b6a83b')],
    rating: 4.9, sold: 398, stock: 25,
    desc: 'Ra đời năm 1950 cho phòng tập trong nhà, nay là icon thời trang toàn cầu. Mũi da suede, đế cao su gum độc đáo, 3 sọc kẻ trắng trên nền đen / trắng.',
    reviews: [], isFlashSale: true, flashSaleDiscount: 10, createdAt: '2023-06-07',
  },
  {
    _id: '69c9eb9760f11a220a75976d',
    name: 'Adidas Yeezy Boost 350 V2 Zebra',
    price: 8500000, category: 'Adidas',
    image: img('1606107557195-0e29a4b5b4aa'),
    images: [img('1606107557195-0e29a4b5b4aa')],
    rating: 4.9, sold: 67, stock: 10,
    desc: 'Collab đỉnh cao giữa Adidas và Kanye West. Upper Primeknit họa tiết kẻ sọc trắng-đen, đệm Boost full-length, đế trong suốt bán translucent iconic.',
    reviews: [], isFlashSale: false, flashSaleDiscount: 0, createdAt: '2023-06-08',
  },
  {
    _id: '69c9eb9760f11a220a75976e',
    name: 'Adidas Copa Pure II Elite FG',
    price: 3490000, category: 'Adidas',
    image: img('1516478177764-9fe5bd7e9717'),
    images: [img('1516478177764-9fe5bd7e9717')],
    rating: 4.8, sold: 89, stock: 22,
    desc: 'Giày đá bóng mũi da kangaroo toàn phần, Touch Pod kiểm soát bóng tối ưu. Đinh FG titanium, đế carbon siêu nhẹ, thiết kế công thái học cho tiền vệ.',
    reviews: [], isFlashSale: false, flashSaleDiscount: 0, createdAt: '2023-07-01',
  },
  {
    _id: '69c9eb9760f11a220a75976f',
    name: 'Adidas Terrex Swift R3 GORE-TEX',
    price: 4200000, category: 'Adidas',
    image: img('1583744946564-b52ac1c389c8'),
    images: [img('1583744946564-b52ac1c389c8')],
    rating: 4.7, sold: 54, stock: 18,
    desc: 'Màng GORE-TEX chống thấm 100% giữ chân khô ráo. Đế Continental Rubber siêu bám trên địa hình ướt, midsole EVA nhẹ giảm mỏi, cổ giày gia cố tránh lật.',
    reviews: [], isFlashSale: false, flashSaleDiscount: 0, createdAt: '2023-07-02',
  },
  {
    _id: '69c9eb9760f11a220a759770',
    name: 'Adidas Campus 00s',
    price: 1850000, category: 'Adidas',
    image: img('1595341888016-a392ef81b7de'),
    images: [img('1595341888016-a392ef81b7de')],
    rating: 4.8, sold: 463, stock: 55,
    desc: 'Phục dựng mẫu Campus 1979 với da lộn mịn, đế thun nhăn xếp đặc trưng. Đang là top trend street fashion toàn cầu 2024, màu sắc phong phú đa dạng.',
    reviews: [], isFlashSale: true, flashSaleDiscount: 25, createdAt: '2023-07-03',
  },
  {
    _id: '69c9eb9760f11a220a759771',
    name: 'Adidas Handball Spezial',
    price: 1950000, category: 'Adidas',
    image: img('1570464197285-9949814674a7'),
    images: [img('1570464197285-9949814674a7')],
    rating: 4.7, sold: 234, stock: 32,
    desc: 'Thiết kế cho bóng ném từ 1979, nay là icon đường phố hàng đầu. Da nubuck mờ cao cấp, đế cao su gum siêu bền, 3 sọc nhiều màu sắc đặc trưng.',
    reviews: [], isFlashSale: false, flashSaleDiscount: 0, createdAt: '2023-07-04',
  },
  {
    _id: '69c9eb9760f11a220a759772',
    name: 'Adidas Predator Accuracy.1 FG',
    price: 3890000, category: 'Adidas',
    image: img('1549298916-b41d501d3772'),
    images: [img('1549298916-b41d501d3772')],
    rating: 4.8, sold: 76, stock: 20,
    desc: 'Giày đá bóng đỉnh cao với vùng Hybrid Touch tích hợp gai cao su kiểm soát bóng. Đinh FG định hướng tốc độ, cổ chân ôm sát PowerFrame TPU.',
    reviews: [], isFlashSale: false, flashSaleDiscount: 0, createdAt: '2023-07-05',
  },
  {
    _id: '69c9eb9760f11a220a759773',
    name: 'Adidas Tiro 23 League Training Jacket',
    price: 890000, category: 'Adidas',
    image: img('1515886657613-9f3515b0c78f'),
    images: [img('1515886657613-9f3515b0c78f')],
    rating: 4.6, sold: 178, stock: 60,
    desc: 'Jacket đào tạo chính hãng từ 100% polyester tái chế, công nghệ AEROREADY hút ẩm siêu tốc. Cổ đứng zip 1/4, 2 túi bên hông, logo Adidas thêu tay.',
    reviews: [], isFlashSale: false, flashSaleDiscount: 0, createdAt: '2023-07-06',
  },
  {
    _id: '69c9eb9760f11a220a759774',
    name: 'Adidas Originals Trefoil Hoodie',
    price: 1250000, category: 'Adidas',
    image: img('1547592166-23ac45744acd'),
    images: [img('1547592166-23ac45744acd')],
    rating: 4.7, sold: 289, stock: 48,
    desc: 'Hoodie iconic logo Trefoil to bản trên ngực, cotton nặng 350 g/m² siêu ấm. Túi kangaroo rộng, dây rút điều chỉnh mũ, tay áo ribbed co giãn.',
    reviews: [], isFlashSale: false, flashSaleDiscount: 0, createdAt: '2023-07-07',
  },
  {
    _id: '69c9eb9760f11a220a759775',
    name: 'Adidas Originals SST Track Jacket',
    price: 1450000, category: 'Adidas',
    image: img('1469334031218-e382a71b716b'),
    images: [img('1469334031218-e382a71b716b')],
    rating: 4.5, sold: 143, stock: 35,
    desc: 'Track jacket kinh điển từ bộ sưu tập SST Originals, 3 sọc kẻ trên tay và logo Trefoil thêu ngực trái. Polyester mượt, zip full-length, co giãn nhẹ khi vận động.',
    reviews: [], isFlashSale: true, flashSaleDiscount: 20, createdAt: '2023-07-08',
  },
  {
    _id: '69c9eb9760f11a220a759776',
    name: 'Adidas Essentials 3-Stripes T-Shirt',
    price: 450000, category: 'Adidas',
    image: img('1622445270936-5dcb604970e7'),
    images: [img('1622445270936-5dcb604970e7')],
    rating: 4.5, sold: 412, stock: 100,
    desc: 'Áo thun cơ bản 100% cotton thoáng mát, 3 sọc kẻ đặc trưng trên tay. Logo Adidas nhỏ thêu ngực trái, form regular phù hợp mọi vóc dáng.',
    reviews: [], isFlashSale: false, flashSaleDiscount: 0, createdAt: '2023-07-09',
  },
  {
    _id: '69c9eb9760f11a220a759777',
    name: 'Adidas Tiro 23 League Training Pants',
    price: 650000, category: 'Adidas',
    image: img('1523293182086-7651a899d37f'),
    images: [img('1523293182086-7651a899d37f')],
    rating: 4.6, sold: 267, stock: 70,
    desc: 'Quần đào tạo chuyên nghiệp AEROREADY co giãn 4 chiều, 3 sọc bên hông, zip 2 bên ống quần điều chỉnh hơi rộng. Phù hợp cả luyện tập lẫn đi dạo thường ngày.',
    reviews: [], isFlashSale: false, flashSaleDiscount: 0, createdAt: '2023-07-10',
  },
];

const mockPermissions = [
  { slug: 'product.add',       name: 'Thêm sản phẩm' },
  { slug: 'product.edit',      name: 'Chỉnh sửa sản phẩm' },
  { slug: 'product.delete',    name: 'Xóa sản phẩm' },
  { slug: 'order.manage',      name: 'Quản lý đơn hàng' },
  { slug: 'user.manage',       name: 'Quản lý người dùng' },
  { slug: 'role.manage',       name: 'Quản lý vai trò' },
  { slug: 'permission.manage', name: 'Quản lý quyền' },
  { slug: 'post.manage',       name: 'Quản lý bài viết' },
];

const mockRoles = [
  {
    name: 'admin',
    permissions: [
      'product.add', 'product.edit', 'product.delete',
      'order.manage', 'user.manage', 'role.manage',
      'permission.manage', 'post.manage',
    ],
  },
  {
    name: 'manager',
    permissions: ['product.add', 'product.edit', 'order.manage', 'post.manage'],
  },
  { name: 'staff', permissions: ['order.manage'] },
  { name: 'user',  permissions: [] },
];

const mockUsers = [
  { name: 'Admin User',          email: 'admin@jshop.com',      password: '123', role: 'admin',   status: 'active', phone: '0901234567', wishlist: [], isEmailVerified: true },
  { name: 'Manager JShop',       email: 'manager@jshop.com',    password: '123', role: 'manager', status: 'active', phone: '0902345678', wishlist: [], isEmailVerified: true },
  { name: 'Staff Support',       email: 'staff@jshop.com',      password: '123', role: 'staff',   status: 'active', phone: '0903456789', wishlist: [], isEmailVerified: true },
  { name: 'Khách Hàng Mẫu',     email: 'khach@jshop.com',      password: '123', role: 'user',    status: 'active', phone: '0912345678', wishlist: [], isEmailVerified: true },
  { name: 'Khách Hàng Bị Khóa', email: 'locked@jshop.com',     password: '123', role: 'user',    status: 'locked', phone: '0988888888', wishlist: [], isEmailVerified: true },
  { name: 'Nguyễn Văn A',       email: 'nguyenvana@gmail.com', password: '123', role: 'user',    status: 'active', phone: '0975234567', wishlist: [], isEmailVerified: true },
  { name: 'Trần Thị B',         email: 'tranthib@gmail.com',   password: '123', role: 'user',    status: 'active', phone: '0986234567', wishlist: [], isEmailVerified: true },
  { name: 'Lê Minh C',          email: 'leminhc@gmail.com',    password: '123', role: 'user',    status: 'active', phone: '0997234567', wishlist: [], isEmailVerified: true },
];

const mockPosts = [
  {
    title: 'Xu hướng thời trang Hè 2024',
    author: 'Admin User', category: 'Xu hướng', date: '2024-05-01',
    excerpt: 'Năm nay, các gam màu pastel nhẹ nhàng sẽ lên ngôi. Chất liệu linen thoáng mát là lựa chọn hàng đầu...',
    content: 'Năm nay, các gam màu pastel nhẹ nhàng sẽ lên ngôi. Chất liệu linen thoáng mát là lựa chọn hàng đầu cho những ngày nắng nóng. Các mẫu váy suông, áo linen trắng là những item không thể bỏ lỡ.',
    image: img('1469334031218-e382a71b716b'),
  },
  {
    title: 'Cách bảo quản giày Sneaker bền đẹp',
    author: 'Admin User', category: 'Chăm sóc', date: '2024-06-15',
    excerpt: 'Để giày luôn như mới, bạn nên vệ sinh định kỳ 2 tuần/lần. Tránh phơi trực tiếp dưới ánh nắng...',
    content: 'Để giày luôn như mới, hãy vệ sinh định kỳ 2 tuần/lần bằng xà phòng nhẹ. Tránh phơi trực tiếp dưới ánh nắng. Dùng bột hút ẩm để khử mùi. Thay dây giày khi bị rách để tăng tuổi thọ.',
    image: img('1556906781-9a412961c28c'),
  },
  {
    title: '5 cách phối đồ với áo thun trắng',
    author: 'Admin User', category: 'Phối đồ', date: '2024-07-01',
    excerpt: 'Áo thun trắng là item cơ bản. Khám phá 5 cách phối đồ thú vị...',
    content: 'Áo thun trắng là item cơ bản không thể thiếu. 5 cách phối: 1) Jeans skinny, 2) Layer cardigan, 3) Tuck vào chinos, 4) Váy midi, 5) Váy cạp cao.',
    image: img('1622445270936-5dcb604970e7'),
  },
  {
    title: 'Top 10 phụ kiện phải có mùa này',
    author: 'Admin User', category: 'Xu hướng', date: '2024-07-10',
    excerpt: 'Phụ kiện có thể thay đổi toàn bộ vẻ ngoài. Cùng tìm hiểu 10 item...',
    content: 'Những item phụ kiện phải có: túi mini, nón bucket, kính retro, belt da, dây chuyền mạ vàng, đồng hồ, khăn lụa, vòng tay bạc, vành mũ, và giày loafer.',
    image: img('1523293182086-7651a899d37f'),
  },
  {
    title: 'Cách lựa chọn size quần áo chính xác',
    author: 'Admin User', category: 'Hướng dẫn', date: '2024-07-20',
    excerpt: 'Size không đúng sẽ làm hỏng toàn bộ outfit. Hãy cùng tìm hiểu...',
    content: 'Để chọn size chính xác: 1) Đo vòng ngực, 2) Đo dài tay, 3) Đo vòng eo, 4) Đo dài quần, 5) So bảng size của từng thương hiệu.',
    image: img('1769029271063-64e3084529f2'),
  },
  {
    title: 'Xu hướng tóc & makeup phù hợp với từng trang phục',
    author: 'Admin User', category: 'Thẩm mỹ', date: '2024-08-01',
    excerpt: 'Hairstyle và makeup đóng vai trò quan trọng. Cùng khám phá...',
    content: 'Bomber jacket → tóc gọn, makeup mạnh. Váy điệu → tóc xoăn nhẹ, makeup nhẹ nhàng. Sơ mi công sở → makeup gọn, tóc buộc cao.',
    image: img('1766763845883-020866685bb6'),
  },
];

const mockCoupons = [
  { code: 'JSHOP10',  discount: 10,  desc: 'Giảm 10% cho mọi đơn hàng' },
  { code: 'WELCOME',  discount: 15,  desc: 'Giảm 15% cho thành viên mới' },
  { code: 'SUMMER20', discount: 20,  desc: 'Giảm 20% mùa hè' },
  { code: 'FLASH50K', discount: 10,  desc: 'Giảm 10% cho đơn từ 500K' },
  { code: 'FREESHIP', discount: 5,   desc: 'Giảm 5% + miễn phí ship' },
  { code: 'MEMBER30', discount: 30,  desc: 'Giảm 30% cho thành viên VIP' },
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✓ MongoDB connected:', MONGO_URI);

    await Promise.all([
      Product.deleteMany({}),
      User.deleteMany({}),
      Role.deleteMany({}),
      Permission.deleteMany({}),
      Post.deleteMany({}),
      Coupon.deleteMany({}),
    ]);
    console.log('✓ Database cleared');

    const [products, permissions, roles, users, posts, coupons] = await Promise.all([
      Product.insertMany(mockProducts),
      Permission.insertMany(mockPermissions),
      Role.insertMany(mockRoles),
      User.create(mockUsers),
      Post.insertMany(mockPosts),
      Coupon.insertMany(mockCoupons),
    ]);

    console.log(`✓ ${products.length}    sản phẩm`);
    console.log(`✓ ${permissions.length}     quyền`);
    console.log(`✓ ${roles.length}     vai trò`);
    console.log(`✓ ${users.length}     người dùng`);
    console.log(`✓ ${posts.length}     bài viết`);
    console.log(`✓ ${coupons.length}     mã giảm giá`);
    console.log('\n✅ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('✓ MongoDB disconnected');
  }
}

seedDatabase();
