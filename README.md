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

| Tính năng | Mô tả |
|-----------|-------|
| 🏠 **Trang chủ** | Banner, Flash Sale, Sản phẩm nổi bật |
| 🔍 **Cửa hàng** | Lọc theo danh mục, sắp xếp, tìm kiếm debounced |
| 📦 **Chi tiết SP** | Gallery ảnh, đánh giá, gợi ý tương tự |
| 🛒 **Giỏ hàng** | Quản lý bằng Zustand, lưu trực tiếp Database |
| 🔐 **Bảo mật** | Đăng ký/Đăng nhập, **Quên mật khẩu bằng mã OTP** |

</td>
<td width="50%" valign="top">

### ⚙️ Khu vực Quản trị

| Tính năng | Mô tả |
|-----------|-------|
| 📊 **Dashboard** | Thống kê doanh thu & đơn hàng với Chart.js |
| 📦 **Sản phẩm** | Quản lý CRUD (Thêm, Sửa, Xóa) bài bản |
| 📋 **Đơn hàng** | Quản lý trạng thái và thông tin khách hàng |
| 📧 **Email** | Hệ thống tự động gửi OTP xác thực qua Gmail |
| 👥 **Người dùng** | Quản lý danh sách thành viên và phân quyền |

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

Tạo file `.env` trong thư mục `server/`:
```env
MONGO_URI=mongodb://localhost:27017/jshop
PORT=5000

# Cấu hình gửi mail (OTP)
GMAIL_USER=your-email@gmail.com
GMAIL_PASS=your-app-password
```

**3. Khởi động dự án (Cực nhanh)**

Bạn không cần mở 2 terminal, chỉ cần chạy đúng 1 lệnh tại thư mục gốc:
```bash
npm start
```
*Lệnh này sẽ tự động chạy cả Client (5173) và Server (5000) cùng lúc nhờ `concurrently`.*

<br/>

> ### 🔑 Thông báo quan trọng
> - **Dữ liệu mẫu:** Chạy `cd server && npm run seed` để khởi tạo sản phẩm mẫu.
> - **Admin:** Email `admin@jshop.com` / Pass `123`.

<br/>

## 🗂️ Cấu trúc thư mục mới

```bash
ecommerce-react/
│
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
