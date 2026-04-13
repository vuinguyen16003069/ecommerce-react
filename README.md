<div align="center">

<br/>

```
     ██╗███████╗██╗  ██╗ ██████╗ ██████╗
     ██║██╔════╝██║  ██║██╔═══██╗██╔══██╗
     ██║███████╗███████║██║   ██║██████╔╝
██   ██║╚════██║██╔══██║██║   ██║██╔═══╝
╚█████╔╝███████║██║  ██║╚██████╔╝██║
 ╚════╝ ╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═╝
```

**Hệ thống Thương mại Điện tử Fullstack — Hiện đại · Bảo mật · Mở rộng dễ dàng**

<br/>

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-latest-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18-5FA04E?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Zustand](https://img.shields.io/badge/Zustand-State_Mgmt-F5A623?style=for-the-badge)](https://zustand-demo.pmnd.rs/)
[![JWT](https://img.shields.io/badge/JWT-RFC_6750-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](./LICENSE)

<br/>

![JSHOP Banner](https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1600)

<br/>

[🚀 Demo](#) · [📖 Docs](#️-cài-đặt--chạy-dự-án) · [🐛 Báo lỗi](#) · [💡 Đề xuất tính năng](#)

</div>

---

## 📖 Giới thiệu

**JSHOP** là ứng dụng **Fullstack Thương mại Điện tử** chuyên nghiệp, kết hợp hoàn chỉnh giữa **React 19** (Frontend) và **Node.js / Express** (Backend).

Dự án được xây dựng với trọng tâm vào:

- 🎨 **Giao diện hiện đại** — TailwindCSS v4, responsive toàn diện
- 🔒 **Bảo mật cao** — JWT Bearer Token chuẩn RFC 6750, OTP Email Auth
- ⚡ **Hiệu suất tốt** — Debounced search, lazy loading, Zustand global state
- 🧩 **Cấu trúc sạch** — Kiến trúc thư mục rõ ràng, dễ mở rộng

---

## ✨ Tính năng nổi bật

### 🛒 Khu vực Khách hàng

| Tính năng | Mô tả |
|-----------|-------|
| 🏠 **Trang chủ** | Banner slider, Flash Sale với đồng hồ bấm giờ, thanh tiến trình lượt bán, sản phẩm nổi bật |
| 🔍 **Cửa hàng** | Lọc theo danh mục, sắp xếp giá, tìm kiếm debounced, phân trang thông minh |
| 📦 **Chi tiết sản phẩm** | Gallery ảnh, đánh giá & xếp hạng sao, bộ đếm số lượng, gợi ý sản phẩm tương tự |
| 🛒 **Giỏ hàng** | Điều chỉnh số lượng, áp mã giảm giá, xác nhận hóa đơn trước khi đặt |
| 👤 **Tài khoản** | Đăng ký / Đăng nhập / Quên mật khẩu, lịch sử đơn hàng, danh sách yêu thích |
| 📝 **Blog** | Danh sách bài viết, trang chi tiết bài viết |

### ⚙️ Khu vực Quản trị

| Tính năng | Mô tả |
|-----------|-------|
| 📊 **Dashboard** | Thống kê tổng quan, biểu đồ Doanh thu (Line Chart) & Đơn hàng (Doughnut Chart) |
| 📦 **Sản phẩm / Bài viết** | Bảng CRUD đầy đủ, form thao tác trong Modal, upload ảnh |
| 📋 **Đơn hàng** | Xem chi tiết thông tin khách, cập nhật trạng thái vận chuyển |
| 🎟️ **Mã giảm giá** | Tạo, chỉnh sửa, xóa coupon theo % hoặc số tiền cố định |
| 👥 **Người dùng** | Khóa / Mở khóa tài khoản, phân quyền với Roles & Permissions linh hoạt |

---

## 🚀 Tech Stack

```
┌─────────────────────────────────────────────────────────────────────┐
│                           TECH STACK                                │
├───────────────────────┬─────────────────────────────────────────────┤
│  ⚡  Frontend         │  React 19 + Vite + React Router v7          │
│  🟢  Backend          │  Node.js + Express.js                       │
│  🍃  Database         │  MongoDB + Mongoose ODM                     │
│  🎨  Styling          │  Tailwind CSS v4 + Vanilla CSS              │
│  📊  Charts           │  Chart.js + react-chartjs-2                 │
│  ✉️   Email            │  Nodemailer (Gmail SMTP / Brevo)            │
│  💾  State Management │  Zustand (Global Store)                     │
│  🔒  Authentication   │  JWT Bearer Token (RFC 6750)                │
│  ⚙️   Security         │  bcryptjs + jsonwebtoken                    │
│  🔄  Dev Tools        │  ESLint + Prettier + Nodemon + Concurrently │
└───────────────────────┴─────────────────────────────────────────────┘
```

---

## ⚙️ Cài đặt & Chạy dự án

### Yêu cầu hệ thống

| Công cụ | Phiên bản tối thiểu |
|---------|---------------------|
| **Node.js** | `>= 18.x` |
| **npm** | `>= 9.x` |
| **MongoDB** | Local hoặc [MongoDB Atlas](https://www.mongodb.com/atlas) |

---

### Bước 1 — Clone & Cài đặt

```bash
# Clone repository
git clone https://github.com/your-username/jshop.git
cd jshop

# Cài đặt dependencies cho Client (thư mục gốc)
npm install

# Cài đặt dependencies cho Server
cd server && npm install && cd ..
```

---

### Bước 2 — Cấu hình môi trường

> ⚠️ Tạo file `.env` tại **thư mục gốc** của dự án (KHÔNG phải trong `server/`)

```env
# ──────────────────────────────────────────
# 🍃 Database
# ──────────────────────────────────────────
MONGO_URI=mongodb://localhost:27017/jshop
PORT=5000
NODE_ENV=development

# ──────────────────────────────────────────
# ✉️ Email (Gmail SMTP)
# ──────────────────────────────────────────
GMAIL_USER=your-email@gmail.com
GMAIL_PASS=your-app-password

# ──────────────────────────────────────────
# 🔒 JWT Authentication
# ──────────────────────────────────────────
JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRES_IN=7d
```

> 💡 **Tip:** Gmail yêu cầu [App Password](https://myaccount.google.com/apppasswords) (không dùng mật khẩu thường). Thêm `.env` vào `.gitignore` để bảo mật.

---

### Bước 3 — Seed dữ liệu mẫu *(tuỳ chọn)*

```bash
cd server && npm run seed
```

Lệnh này sẽ khởi tạo sản phẩm, danh mục, tài khoản admin mẫu. Có thể chạy lại bất cứ lúc nào.

---

### Bước 4 — Chạy dự án

**Cách 1 — Chạy tất cả cùng lúc (khuyến nghị)**

```bash
npm start
```

Lệnh này dùng `concurrently` để khởi động đồng thời:
- 🖥️ **Frontend** tại `http://localhost:5173`
- 🔧 **Backend** tại `http://localhost:5000`

**Cách 2 — Chạy riêng lẻ**

```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
npm run dev
```

---

### Bước 5 — Build Production *(tuỳ chọn)*

```bash
# Build frontend
npm run build

# Preview bản build
npm run preview
```

Thư mục `dist/` chứa static files production-ready, sẵn sàng deploy lên bất kỳ hosting nào.

---

### 🔑 Tài khoản Demo

| Vai trò | Email | Mật khẩu |
|---------|-------|----------|
| **Admin** | `admin@jshop.com` | `123` |

> Đăng nhập để truy cập khu vực quản trị tại `/admin`

---

## 🗂️ Cấu trúc thư mục

<details>
<summary>📁 Xem toàn bộ cấu trúc</summary>

```
jshop/
├── 📁 public/                     # Static assets
│
├── 📁 server/                     # ── BACKEND ──────────────────────
│   ├── 📁 config/
│   │   ├── db.js                  # Kết nối MongoDB
│   │   └── permissions.js         # Định nghĩa quyền hệ thống
│   ├── 📁 controllers/            # Xử lý logic nghiệp vụ
│   │   ├── couponController.js
│   │   ├── orderController.js
│   │   ├── permissionController.js
│   │   ├── postController.js
│   │   ├── productController.js
│   │   ├── roleController.js
│   │   └── userController.js
│   ├── 📁 middleware/
│   │   ├── authMiddleware.js      # Xác thực JWT
│   │   ├── errorHandler.js        # Xử lý lỗi tập trung
│   │   └── upload.js              # Upload file (Multer)
│   ├── 📁 models/                 # Mongoose Schemas
│   │   ├── Coupon.js
│   │   ├── Order.js
│   │   ├── Permission.js
│   │   ├── Post.js
│   │   ├── Product.js
│   │   ├── Role.js
│   │   └── User.js
│   ├── 📁 routes/                 # API Endpoints
│   │   ├── coupons.js
│   │   ├── orders.js
│   │   ├── permissions.js
│   │   ├── posts.js
│   │   ├── products.js
│   │   ├── roles.js
│   │   └── users.js
│   ├── 📁 seeds/
│   │   └── seed.js                # Script khởi tạo dữ liệu mẫu
│   ├── 📁 services/
│   │   └── emailService.js        # Gửi email OTP
│   ├── 📁 uploads/
│   │   └── avatars/               # Lưu avatar người dùng
│   └── server.js                  # Entry point backend
│
├── 📁 src/                        # ── FRONTEND ─────────────────────
│   ├── 📁 assets/                 # Ảnh, icon tĩnh
│   ├── 📁 components/
│   │   ├── 📁 common/             # Tái sử dụng toàn cục
│   │   │   ├── Icons.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── RequireAuth.jsx
│   │   │   ├── ScrollToTop.jsx
│   │   │   ├── SkeletonCard.jsx
│   │   │   ├── StarRating.jsx
│   │   │   └── Toast.jsx
│   │   ├── 📁 layout/             # Header, Footer, Sidebar
│   │   └── 📁 product/            # FlashSale, ProductCard
│   ├── 📁 constants/              # Hằng số dùng chung
│   ├── 📁 hooks/                  # Custom Hooks
│   │   ├── useDebounce.js
│   │   └── useStickyState.js
│   ├── 📁 layouts/
│   │   ├── AdminLayout.jsx
│   │   └── MainLayout.jsx
│   ├── 📁 pages/
│   │   ├── 📁 admin/              # Dashboard, CRUD pages
│   │   ├── HomePage.jsx
│   │   ├── ShopPage.jsx
│   │   ├── ProductDetailPage.jsx
│   │   ├── CartPage.jsx
│   │   ├── CheckoutPage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── BlogPage.jsx
│   │   └── ...
│   ├── 📁 services/
│   │   └── api.js                 # Axios / Fetch wrapper
│   ├── 📁 store/                  # Zustand stores
│   │   ├── authStore.js
│   │   ├── cartStore.js
│   │   └── toastStore.js
│   ├── 📁 utils/
│   │   └── helpers.js             # Hàm tiện ích
│   ├── App.jsx
│   ├── router.jsx                 # React Router config
│   └── main.jsx
│
├── .env                           # ⚠️ KHÔNG commit lên Git
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

</details>

---

## 📜 NPM Scripts

| Lệnh | Mô tả |
|------|-------|
| `npm start` | ⚡ Chạy Client + Server song song (concurrently) |
| `npm run dev` | 🖥️ Chạy Frontend dev server (Vite, port 5173) |
| `npm run dev:client` | 🖥️ Chạy Frontend riêng |
| `npm run dev:server` | 🔧 Chạy Backend riêng (port 5000) |
| `npm run build` | 🏗️ Build Frontend cho Production |
| `npm run preview` | 👀 Preview bản build |
| `npm run lint` | ✅ Kiểm tra lỗi ESLint |
| `npm run lint:fix` | 🔧 Tự động sửa lỗi ESLint |
| `npm run format` | 💅 Format code với Prettier |
| `npm run format:check` | 📋 Kiểm tra code đã được format chưa |

---

## 🔒 Bảo mật & Xác thực

JSHOP triển khai **JWT Bearer Token Authentication** theo chuẩn RFC 6750:

```
┌──────────┐         ┌──────────────┐         ┌──────────┐
│  Client  │         │   Express    │         │  MongoDB │
└────┬─────┘         └──────┬───────┘         └────┬─────┘
     │                      │                      │
     │  POST /login         │                      │
     │─────────────────────►│                      │
     │                      │  Find user by email  │
     │                      │─────────────────────►│
     │                      │◄─────────────────────│
     │                      │  bcrypt.compare()    │
     │  JWT Token           │                      │
     │◄─────────────────────│                      │
     │                      │                      │
     │  Authorization:      │                      │
     │  Bearer <token>      │                      │
     │─────────────────────►│                      │
     │                      │  Verify + DB check   │
     │                      │─────────────────────►│
     │                      │◄─────────────────────│
     │  200 OK / 401        │                      │
     │◄─────────────────────│                      │
```

**Các tính năng bảo mật đã triển khai:**

- ✅ Bearer Token Schema — Chuẩn RFC 6750
- ✅ Server-side Verification — Token xác thực bằng secret key
- ✅ Token Expiration — Hết hạn sau 7 ngày (cấu hình qua `JWT_EXPIRES_IN`)
- ✅ Password Hashing — `bcryptjs` salt rounds
- ✅ Database Verification — Kiểm tra user tồn tại trước mỗi request
- ✅ Role-based Access Control — Roles & Permissions linh hoạt

---

## 🔭 Lộ trình phát triển

- [ ] 💳 **Cổng thanh toán** — Tích hợp VNPay / Stripe / PayPal
- [ ] 🔔 **Thông báo realtime** — Socket.io cho đơn hàng mới
- [ ] 🌐 **Đa ngôn ngữ** — `react-i18next` (VI / EN)
- [ ] 🚀 **CI/CD Pipeline** — GitHub Actions + Docker
- [ ] ☁️ **Cloud Deploy** — Vercel (Frontend) + Railway (Backend)
- [ ] 📱 **PWA** — Hỗ trợ cài đặt như ứng dụng mobile
- [ ] 🔍 **SEO** — Server-side Rendering với Next.js (v2)

---

## 🤝 Đóng góp

Mọi đóng góp đều được hoan nghênh! Để đóng góp:

1. **Fork** repository này
2. Tạo branch mới: `git checkout -b feature/ten-tinh-nang`
3. Commit thay đổi: `git commit -m "feat: thêm tính năng X"`
4. Push lên branch: `git push origin feature/ten-tinh-nang`
5. Mở **Pull Request** và mô tả thay đổi của bạn

---

## 📄 License

Phát hành theo giấy phép [MIT License](./LICENSE) — Tự do sử dụng, chỉnh sửa và phân phối.

---

<div align="center">

Được xây dựng với ❤️ bằng **React** · **Vite** · **Tailwind CSS** · **Node.js**

<br/>

Nếu dự án hữu ích với bạn, hãy nhấn ⭐ **Star** để ủng hộ nhé!

<br/>

[![Star History](https://img.shields.io/github/stars/vuinguyen16003069/ecommerce-react?style=social)](https://github.com/vuinguyen16003069/ecommerce-react)

</div>
