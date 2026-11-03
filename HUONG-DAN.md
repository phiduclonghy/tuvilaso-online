# Tử Vi Đẩu Số — Bản Việt Hóa (Từ repo Renhuai123/ziwei-doushu)

Đây là bản **Việt hóa hoàn chỉnh** của dự án mã nguồn mở **Tử Vi Đẩu Số (紫微斗数)** của tác giả **Renhuai123** (14.000+ ⭐ trên GitHub), dựa trên hệ thống **Nghê Hải Hạ (倪海厦) — "Thiên Kỷ" (天纪)**.

## Đã Việt hóa những gì

- ✅ **Toàn bộ tên sao, 12 cung, thiên can, địa chi, Tứ Hóa, ngũ hành** — dùng thuật ngữ Hán-Việt chuẩn (Tử Vi, Thiên Cơ, Thái Dương, Mệnh, Phu Thê...)
- ✅ **Giao diện** (nút bấm, nhãn, trang chủ, biểu mẫu nhập)
- ✅ **Cách cục** (14 chính tinh × cách cục), **tri thức từng sao**
- ✅ **Cổ thư** (Cốt Tủy Phú, Tử Vi Đẩu Số Toàn Tập/Toàn Thư)
- ✅ **Hệ thống Thiên Kỷ / Nhân Kỷ / Địa Kỷ** của Nghê Hải Hạ (mô tả module, 64 quẻ Kinh Dịch, 24 tập, danh ngôn)
- ⏳ **Chưa dịch**: thư mục `docs/tianji-ziwei/` (14 bài giảng đầy đủ, ~232.000 ký tự) + trang Điều khoản/Quyền riêng tư — để đợt sau.

## Chức năng

- **Lập lá số Tử Vi** — nhập ngày/giờ sinh + giới tính → ra đầy đủ 12 cung, sao, Tứ Hóa, Cục, Mệnh/Thân chủ.
- **Cách cục** tự động nhận diện (Quân Thần Khánh Hội, Tử Phủ Đồng Cung...)
- **Tri thức từng sao** (14 chính tinh × 13 cung vị)
- **Cổ thư** + **Thiên Kỷ** (module Nghê Hải Hạ)
- ⚠️ **AI luận giải** không có trong bản mã nguồn mở (chỉ bản online có) — cần tự triển khai backend nếu muốn.

## Cách chạy

### Yêu cầu
- **Node.js 20+** (khuyến nghị 22), npm.

### Lần đầu
```bash
npm install
```

### Chạy (chế độ dev)
```bash
npm run dev
```
Mở trình duyệt: **http://localhost:3000**

### Chạy (production)
```bash
npm run build
npm start
```

## Trên Windows (chạy 1 click)
Nhấp đúp file **`Chay.bat`** (tự `npm install` lần đầu rồi chạy dev server).

## Giấy phép
- Code: **MIT**
- Dữ liệu: **CC BY 4.0** (ghi nguồn khi dùng lại)
- Cổ thư: **public domain**
- Nguyên văn Nghê Hải Hạ: **chỉ dùng phi thương mại**
- Nguồn gốc: https://github.com/Renhuai123/ziwei-doushu

## Deploy lên GitHub Pages (chạy online, URL miễn phí)

Repo đã được chỉnh sẵn để chạy trên GitHub Pages:

1. Push repo lên GitHub (nhánh `main`).
2. Vào repo → **Settings → Pages → Source = GitHub Actions** (chọn "Deploy from a branch" → "GitHub Actions").
3. File `.github/workflows/deploy.yml` sẽ tự build + deploy mỗi lần push.
4. Xong, web chạy tại: `https://TEN-TAI-KHOAN.github.io/TEN-REPO/`

*(Đã bỏ `import 'server-only'`, set `output: 'export'`, thêm basePath tự động.)*

## Lưu ý kỹ thuật

### Bật luận giải AI với Vercel và DeepSeek

1. Kết nối repo này với dự án Vercel (Root Directory là thư mục gốc của repo).
2. Trong **Vercel → Project Settings → Environment Variables**, thêm `DEEPSEEK_API_KEY` cho môi trường Production. Không đưa khóa vào mã nguồn hoặc GitHub.
3. Triển khai lại dự án trên Vercel sau khi thêm biến môi trường. API sẽ chạy tại `/api/interpret`.
4. Trang GitHub Pages đã được cấu hình gọi API Vercel bằng `NEXT_PUBLIC_AI_API_URL` trong workflow deploy. Biến này là URL công khai, không phải khóa bí mật.

Khi dùng luận giải AI, nội dung câu hỏi và dữ liệu các cung sao được gửi đến DeepSeek. Tên và ngày sinh trong lá số được loại khỏi phần dữ liệu gửi đến mô hình. API công khai có thể phát sinh phí sử dụng DeepSeek; hãy đặt giới hạn chi tiêu trong tài khoản dịch vụ.
- GitHub Pages không tự chạy API. Luận giải AI chỉ hoạt động khi API trên Vercel đã được triển khai, có `DEEPSEEK_API_KEY` và trang tĩnh đã kết nối đúng URL API.
- Chưa dịch: `docs/tianji-ziwei/` (bài giảng đầy đủ) + trang Điều khoản/Quyền riêng tư → đợt 2.
