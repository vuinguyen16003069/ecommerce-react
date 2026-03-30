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

### 🛍️ Hệ thống Thương mại Điện tử Hiện đại

<br/>

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-latest-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-22C55E?style=for-the-badge)](LICENSE)

<br/>

![JSHOP Preview](https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1600)

<br/>

</div>

---

## 📖 Giới thiệu

**JSHOP** là một ứng dụng React mô phỏng trọn vẹn một hệ thống thương mại điện tử chuyên nghiệp — bao gồm đầy đủ luồng mua sắm dành cho **khách hàng** lẫn **bảng điều khiển quản trị** dành cho người bán.

Dự án được phát triển trên kiến trúc **React 19 + Vite** với **TailwindCSS v4**, tập trung vào việc xây dựng một kiến trúc thư mục sạch sẽ, dễ mở rộng và sẵn sàng tích hợp với bất kỳ backend API nào.

<br/>

## ✨ Tính năng

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

```
┌─────────────────────────────────────────────────────────────────┐
│                         TECH STACK                              │
├──────────────────────┬──────────────────────────────────────────┤
│  ⚡ Frontend         │  React 19 + Vite (HMR siêu nhanh)        │
│  🟢 Backend          │  Node.js + Express                       │
│  🍃 Database         │  MongoDB + Mongoose                      │
│  🎨 Styling          │  Tailwind CSS v4 + CSS Variables         │
│  📊 Charts           │  Chart.js + react-chartjs-2              │
│  🔷 Icons            │  SVG Components nội bộ (Lucide-based)    │
│  💾 State / Storage  │  Zustand + LocalStorage                  │
└──────────────────────┴──────────────────────────────────────────┘
```

> **Điểm nổi bật về thiết kế:** Toàn bộ icon được tự xây dựng thành component SVG nội bộ dựa trên Lucide — đồng nhất về style, không phụ thuộc vào thư viện icon nặng nề.

<br/>

## ⚙️ Cài đặt & Chạy dự án

### Yêu cầu hệ thống

- **Node.js** ≥ v18
- **MongoDB** (Local server hoặc MongoDB Atlas)

### Các bước thực hiện

**1. Cài đặt Backend & Database**

```bash
cd server
npm install
```

**2. Cấu hình Biến môi trường**

Tạo file `.env` trong thư mục `server/` (nếu chưa có):

```env
MONGO_URI=mongodb://localhost:27017/ecommerce
PORT=5000
```

**3. Khởi tạo dữ liệu mẫu (Seed Data)**

Lệnh này sẽ xóa dữ liệu cũ và nạp dữ liệu mặc định vào MongoDB:

```bash
# Tại thư mục server/
npm run seed
```

**4. Khởi động Backend Server**

```bash
# Tại thư mục server/
npm run dev
```

**5. Cài đặt & Chạy Frontend (Mở terminal mới)**

```bash
# Quay lại thư mục gốc
cd ..
npm install
npm run dev
```

**6. Mở trình duyệt tại:**

```
http://localhost:5173/
```

<br/>

> ### 🔑 Thông tin đăng nhập Admin
>
> Để truy cập trang quản trị, nhấn **Đăng nhập** ở góc trên bên phải và dùng thông tin sau:
>
> | Trường   | Giá trị           |
> | -------- | ----------------- |
> | Email    | `admin@jshop.com` |
> | Mật khẩu | `123`             |

<br/>

## 🗂️ Cấu trúc thư mục

```
ecommerce-react/
│
├── 📁 src/
│   ├── 📁 components/
│   │   ├── 📁 layout/          # Hệ thống cấu trúc Web (Header, Footer)
│   │   ├── 📁 product/         # Components riêng của SP (ProductCard, FlashSale)
│   │   ├── 📁 ui/              # Tiện ích UI tái sử dụng (Toast, Modal, Skeleton)
│   │   └── 📄 Icons.jsx        # Cụm Icons SVG nội bộ
│   │
│   ├── 📁 data/
│   │   └── 📄 db.js            # Mockup Database — Initial State
│   │
│   ├── 📁 hooks/               # Custom Hooks (useStickyState, useDebounce)
│   ├── 📁 utils/               # Helper functions (text, tiền tệ, ngày tháng)
│   │
│   ├── 📁 views/
│   │   ├── 📁 admin/           # Toàn bộ Views khu vực Quản trị
│   │   └── 📄 *.jsx            # Các Views mặt tiền dành cho User
│   │
│   ├── 📄 App.jsx              # Root Component — Route Logic & Global State
│   ├── 📄 index.css            # Base CSS + Tailwind Variables
│   └── 📄 main.jsx             # Vite Entry Point
│
├── 📄 index.html
├── 📄 package.json
└── 📄 vite.config.js
```

<br/>

## 🔭 Lộ trình mở rộng

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
