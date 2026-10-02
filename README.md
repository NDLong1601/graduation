# 🎓 GRADUATION INVITATION 3D // THIỆP MỜI LỄ TỐT NGHIỆP CÔNG NGHỆ

Website thiệp mời lễ tốt nghiệp tương tác 3D phong cách Cyberpunk / High-Tech hiện đại, tối ưu 100% để triển khai miễn phí trên **GitHub Pages**.

---

## ✨ CÁC TÍNH NĂNG ĐẶC SẮC

1. **Mô hình 3D tương tác WebGL (Three.js):**
   - Mũ cử nhân & cuộn bằng tốt nghiệp 3D lơ lửng, phản chiếu ánh sáng Neon Cyan & Magenta.
   - Hỗ trợ xoay 360° bằng chuột hoặc cảm ứng trên điện thoại.
   - Nút **"Tung Mũ Chúc Mừng 🎓"** với quỹ đạo vật lý, âm thanh chúc mừng và hiệu ứng pháo hoa rực rỡ (`canvas-confetti`).
2. **Thư mời mã hóa 3D (Hologram Access Pass):**
   - Màn hình chào với giao diện giải mã bảo mật và âm thanh Sci-fi mở thiệp.
3. **Đồng hồ đếm ngược HUD:**
   - Đếm ngược chính xác đến giờ G.
   - Tích hợp 1 chạm **Thêm vào Google Calendar** và **Tải file Lịch (.ics)** cho iPhone/Mac/Windows.
4. **Lịch trình sự kiện (Timeline):**
   - Dòng thời gian chi tiết các mốc đón khách, trao bằng, chụp ảnh và tiệc mừng.
5. **Địa điểm & Bản đồ Google Maps:**
   - Tích hợp bản đồ trực tiếp kèm nút dẫn đường Google Maps và hướng dẫn bãi đỗ xe.
6. **Dresscode & Bảng màu:**
   - Hiển thị bảng màu kèm tính năng 1-click copy mã màu hex.
7. **Hành trình đại học 4 năm (Memory Matrix):**
   - Tóm lược các mốc Level 1 đến Level 4 từ tân sinh viên đến đồ án tốt nghiệp.
8. **Form xác nhận tham dự (RSVP):**
   - Ghi nhận thông tin khách mời, số lượng người đi cùng, lưu trữ tại trình duyệt và cấp thẻ điện tử.
9. **Sổ lưu bút ảo (Cyber Wish Wall):**
   - Khách mời có thể gửi lời chúc mừng kèm emoji avatar trực tiếp lên tường lưu bút.
10. **Bộ phát âm thanh Sci-Fi (Web Audio API):**
    - Hiệu ứng âm thanh chân thực được tổng hợp bằng code trực tiếp, không lo lỗi thiếu file audio hay tải chậm.

---

## 🚀 HƯỚNG DẪN CHẠY THỬ TRÊN MÁY (LOCAL)

Mở Terminal hoặc PowerShell tại thư mục này (`C:\Users\PC\Documents\tot-nghiẹp`):

```bash
# 1. Chạy môi trường phát triển
npm run dev
```

Truy cập đường link hiển thị trên màn hình (thường là `http://localhost:5173`) trên trình duyệt để trải nghiệm website!

---

## 🛠️ CÁCH TÙY CHỈNH THÔNG TIN CỦA BẠN

Toàn bộ thông tin cá nhân và buổi lễ được quy tụ tại **DUY NHẤT 1 FILE**:
👉 **`src/config.ts`**

Mở file `src/config.ts` và thay đổi các mục:
- `graduate.fullName`: Họ và tên của bạn (VD: *NGUYỄN VĂN AN*)
- `graduate.degree`: Bằng cấp (VD: *KỸ SƯ CÔNG NGHỆ THÔNG TIN* / *CỬ NHÂN KINH TẾ*)
- `graduate.major`: Chuyên ngành của bạn
- `graduate.university`: Tên trường đại học
- `event.date`: Ngày diễn ra buổi lễ
- `event.time`: Khung giờ
- `event.isoDateTime`: Thời gian chuẩn cho đồng hồ đếm ngược (VD: `2026-11-15T08:00:00`)
- `event.locationName` & `event.address`: Tên hội trường và địa chỉ
- `event.googleMapsUrl`: Link Google Maps dẫn đường

---

## 🌐 HƯỚNG DẪN DEPLOY LÊN GITHUB PAGES

### Cách 1: Tự động qua GitHub Actions (Khuyên dùng - Cực dễ)

1. Tạo một Repository mới trên GitHub (Ví dụ đặt tên là `tot-nghiep` hoặc `graduation`).
2. Mở terminal tại thư mục này và đẩy code lên:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Graduation 3D website"
   git branch -M main
   git remote add origin https://github.com/TÊN_GITHUB_CỦA_BẠN/TÊN_REPO.git
   git push -u origin main
   ```
3. Truy cập vào Repository trên GitHub:
   - Vào mục **Settings** -> **Pages** (ở cột bên trái).
   - Tại phần **Build and deployment** -> **Source**: chọn **GitHub Actions**.
4. Chờ khoảng 1-2 phút, GitHub Actions sẽ tự động build và cung cấp đường link website của bạn:
   👉 `https://TÊN_GITHUB_CỦA_BẠN.github.io/TÊN_REPO/`

### Cách 2: Deploy bằng lệnh `npm run deploy`
```bash
npm run deploy
```

---

Chúc bạn có một buổi Lễ Tốt Nghiệp thật rực rỡ và ý nghĩa! 🎓✨
