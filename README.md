# EduTest Pro (CertPrep) - Nền Tảng Luyện Thi Chứng Chỉ Chuẩn Next.js App Router

Nền tảng luyện thi chứng chỉ trực tuyến tiêu chuẩn cao dành cho các kỳ thi: **IELTS**, **HSK**, **TOEIC**, **CFA**, **GMAT**, **ACCA**, **Digital SAT**, **THPTQG** với giao diện làm bài chuẩn quốc tế, đồng hồ đếm ngược và phân tích lời giải chi tiết.

Dự án đã được refactor toàn diện từ Vite SPA sang kiến trúc **Next.js (App Router)** hiện đại, hỗ trợ SSR/SSG, Dynamic Routing và Clean Architecture.

---

## 📋 Yêu cầu môi trường (Prerequisites)

- **Node.js**: Phiên bản 18 trở lên (khuyên dùng Node.js 20 hoặc 22). Kiểm tra bằng lệnh:
  ```bash
  node -v
  npm -v
  ```

---

## 🚀 Hướng dẫn cài đặt & Khởi chạy (Quick Start)

### Bước 1: Mở terminal tại thư mục dự án
Đảm bảo bạn đang đứng ở thư mục gốc của dự án:
```bash
cd e:\edutest-pro---nền-tảng-luyện-thi-chứng-chỉ-thông-minh
```

### Bước 2: Cài đặt các gói thư viện phụ thuộc
Dự án sử dụng React 19 và Next.js 16, sử dụng lệnh:
```bash
npm install --legacy-peer-deps
```

### Bước 3: Khởi chạy máy chủ phát triển (Next.js Dev Server)
Chạy lệnh sau để khởi động Next.js server trên cổng 3000:
```bash
npm run dev
```

Sau khi chạy thành công, terminal sẽ thông báo:
```text
  ▲ Next.js 16.3.7
  - Local:        http://localhost:3000
  - Experiments: turbo
  ✓ Starting...
  ✓ Ready in 1500ms
```

### Bước 4: Mở ứng dụng trên trình duyệt
Mở trình duyệt (Chrome, Edge, Firefox, Cốc Cốc...) và truy cập:
👉 **[http://localhost:3000/](http://localhost:3000/)**

---

## 🛠️ Các lệnh hữu ích khác

| Lệnh | Mô tả |
| :--- | :--- |
| `npm run dev` | Khởi chạy môi trường phát triển Next.js tại `http://localhost:3000/` |
| `npm run build` | Biên dịch và đóng gói tối ưu cho Production theo chuẩn Next.js App Router |
| `npm run start` | Khởi chạy máy chủ sản phẩm (Production Server) tại cổng 3000 |
| `node test_e2e.cjs` | Chạy kịch bản tự động mở Google Chrome thật kiểm thử toàn bộ luồng E2E (`headless: false`) |

---

## 💡 Cấu trúc dự án Next.js App Router chuẩn

```text
edutest-pro/
├── public/                     # Static assets (favicon.svg, logo, v.v.)
├── src/
│   ├── app/                    # Next.js App Router directory
│   │   ├── layout.tsx          # Root Layout (Fonts, Metadata, AppShell)
│   │   ├── globals.css         # Tailwind CSS v4 setup & custom styles
│   │   ├── page.tsx            # Route / (Trang chủ)
│   │   ├── library/
│   │   │   └── page.tsx        # Route /library (Kho đề thi & Bộ lọc)
│   │   ├── exam/
│   │   │   ├── page.tsx        # Route /exam (Điều hướng đề mặc định)
│   │   │   └── [id]/
│   │   │       └── page.tsx    # Route /exam/[id] (Phòng thi động theo mã đề)
│   │   └── result/
│   │       ├── page.tsx        # Route /result (Điều hướng kết quả mặc định)
│   │       └── [id]/
│   │           └── page.tsx    # Route /result/[id] (Báo cáo kết quả thi)
│   ├── components/             # Reusable UI Components
│   │   ├── AppShell.tsx        # Client Layout Shell (Navbar, Footer, Modals, Drawers)
│   │   ├── Navbar.tsx          # Header thanh điều hướng và menu chứng chỉ
│   │   ├── Footer.tsx          # Chân trang thông tin hệ thống
│   │   ├── VocabDrawer.tsx     # Sổ tra từ vựng chuyên ngành
│   │   ├── MistakeNotebookModal.tsx # Sổ ghi chú lỗi sai & bẫy tư duy
│   │   └── DictionaryPopup.tsx # Popup tra từ điển nhanh
│   ├── context/
│   │   └── AppContext.tsx      # Global React Context quản lý trạng thái modal & đề thi
│   ├── views/                  # View Components tách biệt cho từng màn hình
│   │   ├── HomePage.tsx
│   │   ├── LibraryPage.tsx
│   │   ├── ExamPage.tsx
│   │   └── ResultPage.tsx
│   ├── data/
│   │   └── mockData.ts         # Ngân hàng đề thi, dữ liệu mẫu chuẩn khảo thí
│   └── types.ts                # TypeScript Type Definitions
├── next.config.mjs             # Next.js Configuration
├── postcss.config.mjs          # PostCSS configuration cho Tailwind v4
└── tsconfig.json               # TypeScript configuration kèm Path Aliases (@/*)
```
