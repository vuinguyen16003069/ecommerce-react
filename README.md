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

### 🛍️ Hệ thống Thương mại Điện tử Hiện đại (Fullstack)

<br/>

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-latest-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Nodemailer](https://img.shields.io/badge/Nodemailer-8.0-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](https://nodemailer.com/)

<br/>

![JSHOP Preview](https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1600)

<br/>

</div>

---

## 📖 Giới thiệu

**JSHOP** là một ứng dụng Fullstack thương mại điện tử chuyên nghiệp, tích hợp hoàn chỉnh giữa **React 19 (Frontend)** và **Node.js/Express (Backend)**.

Dự án không chỉ tập trung vào giao diện hiện đại với **TailwindCSS v4** mà còn chú trọng vào bảo mật (OTP Auth) và quản lý trạng thái hiệu quả với **Zustand**.

<br/>

## ✨ Tính năng nổi bật

<table>
<tr>
<td width="50%" valign="top">

### 🛒 Khu vực Khách hàng

| Tính năng          | Mô tả                                                                             |
| ------------------ | --------------------------------------------------------------------------------- |
| 🏠 **Trang chủ**   | Banner, Flash Sale + đồng hồ bấm giờ, thanh tiến trình lượt bán, sản phẩm nổi bật |
| 🔍 **Cửa hàng**    | Lọc theo danh mục, sắp xếp giá, tìm kiếm debounced, phân trang                    |
| 📦 **Chi tiết SP** | Gallery ảnh, đánh giá & xếp hạng sao, bộ đếm số lượng, gợi ý tương tự             |
| 🛒 **Giỏ hàng**    | Điều chỉnh số lượng, mã giảm giá, xác nhận hóa đơn                                |
| 👤 **Tài khoản**   | Đăng nhập / Đăng ký, lịch sử đơn hàng, danh sách yêu thích                        |

</td>
<td width="50%" valign="top">

### ⚙️ Khu vực Quản trị

| Tính năng                  | Mô tả                                                              |
| -------------------------- | ------------------------------------------------------------------ |
| 📊 **Dashboard**           | Thống kê tổng quan, biểu đồ Doanh thu (Line) & Đơn hàng (Doughnut) |
| 📦 **Sản phẩm / Bài viết** | Bảng CRUD đầy đủ, form thao tác trong Modal                        |
| 📋 **Đơn hàng**            | Xem thông tin khách hàng, cập nhật trạng thái giao hàng            |
| 👥 **Người dùng**          | Khóa / Mở khóa tài khoản, phân quyền Roles & Permissions           |

</td>
</tr>
</table>

<br/>

## 🚀 Công nghệ sử dụng

```bash
┌─────────────────────────────────────────────────────────────────┐
│                         TECH STACK                              │
├──────────────────────┬──────────────────────────────────────────┤
│  ⚡ Frontend         │  React 19 + Vite + React Router 7        │
│  🟢 Backend          │  Node.js + Express                       │
│  🍃 Database         │  MongoDB + Mongoose                      │
│  🎨 Styling          │  Tailwind CSS v4 + Vanilla CSS           │
│  📊 Charts           │  Chart.js + react-chartjs-2              │
│  ✉️ Email            │  Nodemailer (Gmail SMTP / Brevo)         │
│  💾 State Management │  Zustand (Global Store)                  │
│  🔒 Authentication   │  JWT Token (RFC 6750 Bearer Token)       │
│  ⚙️ Security         │  bcryptjs + jsonwebtoken                 │
└──────────────────────┴──────────────────────────────────────────┘
```

<br/>

## ⚙️ Cài đặt & Chạy dự án

### Yêu cầu hệ thống

- **Node.js** ≥ v18
- **MongoDB** (Local hoặc Atlas)

### Các bước thực hiện

**1. Clone dự án và cài đặt Node modules**

```bash
# Cài đặt cho Client (thư mục gốc)
npm install

# Cài đặt cho Server
cd server
npm install
```

**2. Cấu hình Biến môi trường**

Tạo file `.env` **tại thư mục gốc** của dự án (⚠️ KHÔNG phải trong folder `server/`):

```env
# Database Configuration
MONGO_URI=mongodb://localhost:27017/jshop
PORT=5000
NODE_ENV=development

# Email Configuration (Gmail SMTP)
GMAIL_USER=your-email@gmail.com
GMAIL_PASS=your-app-password

# JWT Authentication (Security - v1.0.2+)
JWT_SECRET=your_jwt_secret_key_change_this_in_production_12345
JWT_EXPIRES_IN=7d
```

> **⚠️ IMPORTANT - Production Security:**
> - Thay đổi `JWT_SECRET` thành một giá trị phức tạp trong production
> - Đừng commit file `.env` lên Git (thêm vào `.gitignore`)
> - Sử dụng các biến môi trường từ hệ thống thay vì hardcode

**3. Nạp dữ liệu mẫu (tùy chọn)**

```bash
# Trong thư mục server/
npm run seed
```

**4. Khởi động Backend Server**

```bash
# Trong thư mục server/
npm run dev
```

**5. Khởi động Frontend (terminal mới)**

```bash
# Quay lại thư mục gốc
cd ..
npm run dev
```

**6. Build cho Production (tùy chọn)**

```bash
# Build Frontend
npm run build

# Xem preview build
npm run preview
```

Sau khi build, thư mục `dist/` sẽ chứa file production-ready để deploy.

**7. Hoặc dùng duy nhất 1 lệnh (Client + Server)**

```bash
npm start
```

_Script `npm start` sử dụng `concurrently` để chạy cả Client (5173) và Server (5000) cùng lúc._

**8. Mở trình duyệt tại:**

```
http://localhost:5173/
```

<br/>

> ### 🔑 Thông tin quan trọng
>
> - **Dữ liệu mẫu:** Chạy `cd server && npm run seed` để khởi tạo bộ sản phẩm mặc định (có thể chạy lại bất cứ lúc nào).
> - **Admin demo:** Sử dụng thông tin dưới đây để đăng nhập khu vực quản trị.
>
> | Trường   | Giá trị           |
> | -------- | ----------------- |
> | Email    | `admin@jshop.com` |
> | Mật khẩu | `123`             |

<br/>

## 🗂️ Cấu trúc thư mục dự án

```bash
ecommerce-react/
├── 📁 public/
├── 📁 server/
│   ├── 📁 config/
│   │   ├── db.js
│   │   └── permissions.js
│   ├── 📁 controllers/
│   │   ├── couponController.js
│   │   ├── orderController.js
│   │   ├── permissionController.js
│   │   ├── postController.js
│   │   ├── productController.js
│   │   ├── roleController.js
│   │   └── userController.js
│   ├── 📁 middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorHandler.js
│   │   └── upload.js
│   ├── 📁 models/
│   │   ├── Coupon.js
│   │   ├── Order.js
│   │   ├── Permission.js
│   │   ├── Post.js
│   │   ├── Product.js
│   │   ├── Role.js
│   │   └── User.js
│   ├── 📁 routes/
│   │   ├── coupons.js
│   │   ├── orders.js
│   │   ├── permissions.js
│   │   ├── posts.js
│   │   ├── products.js
│   │   ├── roles.js
│   │   └── users.js
│   ├── 📁 seeds/
│   │   └── seed.js
│   ├── 📁 services/
│   │   └── emailService.js
│   ├── 📁 uploads/
│   │   └── avatars/
│   ├── nodemon.json
│   ├── package.json
│   └── server.js
├── 📁 src/
│   ├── 📁 assets/
│   │   ├── icons/
│   │   └── images/
│   ├── 📁 components/
│   │   ├── 📁 common/
│   │   │   ├── Icons.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── RequireAuth.jsx
│   │   │   ├── ScrollToTop.jsx
│   │   │   ├── SkeletonCard.jsx
│   │   │   ├── StarRating.jsx
│   │   │   └── Toast.jsx
│   │   ├── 📁 layout/
│   │   │   ├── AdminSidebar.jsx
│   │   │   ├── AuthLayout.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── Header.jsx
│   │   ├── 📁 product/
│   │   │   ├── FlashSale.jsx
│   │   │   └── ProductCard.jsx
│   │   └── Icons.jsx
│   ├── 📁 constants/
│   │   └── index.js
│   ├── 📁 hooks/
│   │   ├── index.js
│   │   ├── useDebounce.js
│   │   └── useStickyState.js
│   ├── 📁 layouts/
│   │   ├── AdminLayout.jsx
│   │   └── MainLayout.jsx
│   ├── 📁 pages/
│   │   ├── 📁 admin/
│   │   │   ├── CouponsPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── OrdersPage.jsx
│   │   │   ├── PermissionsPage.jsx
│   │   │   ├── PostsPage.jsx
│   │   │   ├── ProductsPage.jsx
│   │   │   ├── RolesPage.jsx
│   │   │   └── UsersPage.jsx
│   │   ├── BlogDetailPage.jsx
│   │   ├── BlogPage.jsx
│   │   ├── CartPage.jsx
│   │   ├── CheckoutPage.jsx
│   │   ├── ForgotPasswordPage.jsx
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── ProductDetailPage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── RegisterPage.jsx
│   │   └── ShopPage.jsx
│   ├── 📁 services/
│   │   └── api.js
│   ├── 📁 store/
│   │   ├── authStore.js
│   │   ├── cartStore.js
│   │   ├── index.js
│   │   └── toastStore.js
│   ├── 📁 utils/
│   │   └── helpers.js
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
│   └── router.jsx
├── .gitattributes
├── .prettierignore
├── .prettierrc
├── eslint.config.js
├── CHANGELOG.md
├── index.html
├── LICENSE
├── package.json
├── README.md
└── vite.config.js
```

### 📋 Giải thích cấu trúc

| Thư mục | Mô tả |
|---------|-------|
| **server/** | Backend Express.js - API routes, controllers, models, middleware, config |
| **src/components/** | React components tái sử dụng (common, layout, product) |
| **src/pages/** | Page components - User pages + admin pages |
| **src/store/** | Zustand stores - Global state (auth, cart, toast) |
| **src/hooks/** | Custom React hooks (useDebounce, useStickyState) |
| **src/services/** | API client services |
| **src/utils/** | Helper functions |
| **src/layouts/** | Layout wrappers (MainLayout, AdminLayout) |

<br/>

## Các lệnh NPM (Scripts)

| Lệnh                | Mô tả                                           |
| ------------------- | ----------------------------------------------- |
| `npm start`         | ⚡ Chạy Client + Server (concurrently)           |
| `npm run dev`       | ⚡ Chạy Frontend dev server (Vite)              |
| `npm run dev:client`| 🖥️ Chạy Frontend riêng (port 5173)            |
| `npm run dev:server`| 🔧 Chạy Backend riêng (port 5000)             |
| `npm run build`     | 🏗️ Build Frontend cho Production               |
| `npm run preview`   | 👀 Preview build trước khi deploy               |
| `npm run lint`      | ✅ Kiểm tra lỗi code (ESLint)                   |
| `npm run lint:fix`  | 🔧 Tự động sửa lỗi code                        |
| `npm run format`    | 💅 Format code (Prettier)                       |
| `npm run format:check` | 📋 Kiểm tra format code              |

<br/>

## � Bảo Mật & Xác Thực (v1.0.2+)

### JWT Token Authentication

Ứng dụng sử dụng **JWT (JSON Web Token)** để xác thực người dùng một cách an toàn:

- ✅ **Bearer Token Schema** — Tuân theo RFC 6750 standard
- ✅ **Server-side Verification** — Token được xác thực trên server với secret key
- ✅ **Token Expiration** — Token hết hạn sau 7 ngày (tùy chỉnh qua `JWT_EXPIRES_IN`)
- ✅ **Secure Headers** — Không sử dụng custom headers dễ bị giả mạo
- ✅ **Database Verification** — Kiểm tra user từ database trước khi chấp nhận

### Flow Xác Thực

```
1. User đăng nhập (email + password)
   ↓
2. Server xác thực → Tạo JWT token
   ↓
3. Frontend lưu token vào localStorage
   ↓
4. Mỗi request sau đó gửi: Authorization: Bearer <token>
   ↓
5. Server xác thực token + kiểm tra user từ DB
   ↓
6. Nếu hợp lệ → Cho phép request, ngược lại → 401 Unauthorized
```

### Cấu Hình

```env
JWT_SECRET=your_secure_random_string_here
JWT_EXPIRES_IN=7d
```

⚠️ **Production**: Thay đổi `JWT_SECRET` thành một giá trị phức tạp ngẫu nhiên!

Xem thêm: [SECURITY_FIXES.md](./SECURITY_FIXES.md) để hiểu chi tiết về sửa lỗi bảo mật.

<br/>

## �🔭 Lộ trình mở rộng

Dự án được thiết kế để dễ dàng nâng cấp thành nền tảng thương mại thực thụ. Một số hướng phát triển gợi ý:

- 🔌 **Tích hợp Backend API** — Node.js / Python / Java / Go
- 🔐 **Xác thực thực sự** — JWT, OAuth2, session-based auth
- 💳 **Cổng thanh toán** — VNPay, Stripe, PayPal
- 🚀 **Deploy lên Cloud** — Vercel, AWS, Railway
- 🌐 **Đa ngôn ngữ (i18n)** — `react-i18next`

<br/>

## 🤝 Đóng góp

Dự án được tạo ra để **demo và tham khảo** cách phân tách kiến trúc thư mục React một cách sạch sẽ, bài bản. Bạn hoàn toàn tự do chỉnh sửa, fork và mở rộng theo nhu cầu.

Nếu bạn thấy dự án hữu ích, hãy ⭐ **Star** để ủng hộ nhé!

<br/>

---

<div align="center">

Được xây dựng với ❤️ bằng **React** · **Vite** · **Tailwind CSS**

</div>
