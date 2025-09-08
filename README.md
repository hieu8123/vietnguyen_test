# Hệ thống Quản lý Sản xuất Viet Nguyen Precision

Ứng dụng web quản lý sản xuất toàn diện cho công ty Viet Nguyen Precision, số hóa tất cả các biểu mẫu giấy thành các module web tương tác.

## 🚀 Tính năng chính

### 📊 Dashboard Tổng quan
- Thống kê thời gian thực về sản xuất, chất lượng, kho bãi
- Biểu đồ xu hướng và phân tích hiệu suất
- Cảnh báo và thông báo quan trọng
- Theo dõi KPI và OEE

### 🏭 Quản lý Sản xuất
- **Lệnh sản xuất (F-PN-01-02)**: Tạo và quản lý đơn hàng sản xuất
- **BOM Khách hàng (F-PR-01-01)**: Quản lý danh sách nguyên vật liệu
- **Báo cáo Máy (F-PR-03-02)**: Theo dõi hiệu suất máy móc
- **Kiểm soát Công đoạn**: Giám sát quy trình sản xuất
- **Đánh giá Quy trình**: Phân tích và cải thiện quy trình

### 🔍 Kiểm soát Chất lượng
- **Kiểm tra NVL đầu vào (F-QC-15-02)**: Kiểm tra nguyên vật liệu
- **Phiếu kiểm tra (F-QC-03-01)**: Kiểm tra trong quá trình sản xuất
- **Kiểm tra cuối cùng (F-QC-04-02)**: Kiểm tra thành phẩm
- **Phiếu kiểm tra QC (F-QC-02-02)**: Báo cáo chất lượng chi tiết
- **Kiểm tra Chương trình (F-TN-04-01/02)**: Quản lý chương trình CNC

### 📦 Quản lý Kho
- **Nhập kho NVL (F-WH-08-01)**: Quản lý nhập nguyên vật liệu
- **Xuất kho NVL (F-WH-09-01)**: Quản lý xuất nguyên vật liệu
- **Thành phẩm tồn kho (F-WH-11-01)**: Theo dõi thành phẩm
- **Phiếu giao nhận (F-WH-04-01)**: Quản lý giao nhận hàng
- **Theo dõi giao nhận (F-WH-03-02)**: Báo cáo giao nhận hàng ngày
- **Xuất gia công ngoài (F-WH-05-01)**: Quản lý gia công bên ngoài
- **Nhập xuất phụ liệu (F-WH-02-01/10-01)**: Quản lý vật tư phụ

### 🔄 Bàn giao Ca & Setup
- **Bàn giao ca Leader**: Chuyển giao thông tin giữa các ca
- **Bàn giao ca Công nhân**: Báo cáo tình hình sản xuất
- **Setup Sheet Report**: Thiết lập máy móc và công cụ

### 📈 Thống kê & Phân tích
- **Thống kê Sản xuất**: Báo cáo hiệu suất và sản lượng
- **Phân tích Chất lượng**: Xu hướng chất lượng và defect
- **Phân tích Kho**: Tồn kho, xuất nhập, turnover

## 🛠️ Công nghệ sử dụng

- **Frontend**: React 19 + TypeScript
- **UI Framework**: Ant Design 5.27
- **Charts**: Ant Design Charts
- **Styling**: Tailwind CSS 4.1
- **Build Tool**: Vite 7.1
- **Routing**: React Router DOM 7.8
- **Date Handling**: Day.js
- **Grid Layout**: React Grid Layout (cho Factory Layout)

## 📋 Yêu cầu hệ thống

- Node.js 18+ 
- Yarn hoặc npm
- Trình duyệt hiện đại (Chrome, Firefox, Safari, Edge)

## 🚀 Cài đặt và Chạy

### 1. Clone repository
```bash
git clone [repository-url]
cd vietnguyen-fe
```

### 2. Cài đặt dependencies
```bash
yarn install
# hoặc
npm install
```

### 3. Chạy ứng dụng
```bash
yarn dev
# hoặc
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:5173`

### 4. Build cho production
```bash
yarn build
# hoặc
npm run build
```

## 🏗️ Cấu trúc dự án

```
src/
├── components/          # Shared components
│   ├── FormCard.tsx
│   ├── DataTable.tsx
│   ├── StatusTag.tsx
│   └── ...
├── pages/              # Các trang chính
│   ├── Dashboard.tsx
│   ├── production/     # Module sản xuất
│   ├── quality/        # Module chất lượng
│   ├── warehouse/      # Module kho bãi
│   ├── shift/          # Module bàn giao ca
│   └── statistics/     # Module thống kê
├── layout/
│   └── MainLayout.tsx  # Layout chính
├── types/
│   └── index.ts        # Type definitions
└── shared/
    └── components/     # Shared components
```

## 👥 Phân quyền người dùng

### Operator (Công nhân)
- Nhập báo cáo máy
- Bàn giao ca
- Xem thông tin sản xuất

### QC Inspector (Nhân viên QC)
- Nhập kết quả kiểm tra
- Phê duyệt chất lượng
- Xem báo cáo chất lượng

### Warehouse Staff (Nhân viên kho)
- Quản lý nhập xuất kho
- Theo dõi tồn kho
- Xử lý giao nhận

### Leader (Trưởng ca)
- Phê duyệt các biểu mẫu
- Xem báo cáo tổng hợp
- Quản lý ca làm việc

### Manager (Quản lý)
- Truy cập tất cả chức năng
- Xem dashboard tổng quan
- Phân tích KPI và báo cáo

## 📊 Luồng dữ liệu

1. **Warehouse → Production**: Nguyên vật liệu từ kho chuyển đến sản xuất
2. **Production → QC**: Sản phẩm từ sản xuất đến kiểm tra chất lượng  
3. **QC → Warehouse**: Thành phẩm đạt chất lượng vào kho thành phẩm
4. **Warehouse → Customer**: Xuất hàng cho khách hàng

## 🔄 Quy trình làm việc

### Quy trình Sản xuất
1. Tạo Production Order từ đơn hàng khách hàng
2. Kiểm tra BOM và nguyên vật liệu
3. Setup máy móc và công cụ
4. Thực hiện sản xuất và ghi nhận báo cáo máy
5. Kiểm tra chất lượng trong quá trình
6. Kiểm tra cuối cùng
7. Nhập kho thành phẩm
8. Giao hàng cho khách hàng

### Quy trình Chất lượng
1. Kiểm tra nguyên vật liệu đầu vào
2. Kiểm tra trong quá trình sản xuất
3. Kiểm tra thành phẩm cuối cùng
4. Ghi nhận và phân tích defect
5. Hành động khắc phục nếu cần

## 🔧 Tùy chỉnh và Mở rộng

### Thêm Module mới
1. Tạo folder trong `src/pages/`
2. Tạo components và types cần thiết
3. Thêm routes vào `App.tsx`
4. Cập nhật menu trong `MainLayout.tsx`

### Thêm Shared Component
1. Tạo component trong `src/shared/components/`
2. Export trong `index.ts`
3. Import và sử dụng trong các trang

### Tùy chỉnh Theme
- Cập nhật Ant Design theme trong `main.tsx`
- Thêm custom CSS trong `App.css`
- Sử dụng Tailwind classes cho styling

## 🐛 Troubleshooting

### Lỗi thường gặp

1. **Module not found**
   - Kiểm tra đường dẫn import
   - Chạy lại `yarn install`

2. **Build errors**
   - Kiểm tra TypeScript errors
   - Chạy `yarn lint` để kiểm tra lỗi

3. **Performance issues**
   - Sử dụng React.memo cho components
   - Implement virtual scrolling cho bảng lớn

## 📞 Hỗ trợ

- Email: support@vietnguyen.com
- Phone: +84 xxx xxx xxx
- Documentation: [Link to docs]

## 📄 License

Copyright © 2024 Viet Nguyen Precision. All rights reserved.

---

Được phát triển với ❤️ cho Viet Nguyen Precision Manufacturing