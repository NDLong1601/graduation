import type { EventConfig, WishMessage } from './types/graduation';

// =====================================================================
// BẠN CÓ THỂ CHỈNH SỬA TOÀN BỘ THÔNG TIN CÁ NHÂN VÀ BUỔI LỄ TẠI FILE NÀY!
// =====================================================================
export const GRADUATION_CONFIG: EventConfig = {
  graduate: {
    fullName: "NGUYỄN VĂN AN",
    degree: "KỸ SƯ CÔNG NGHỆ THÔNG TIN",
    major: "Khoa Học Máy Tính & Trí Tuệ Nhân Tạo",
    university: "Đại Học Bách Khoa",
    faculty: "Khoa Khoa Học & Kỹ Thuật Máy Tính",
    classCode: "CS-K20",
    studentId: "2012026",
    // Nếu bạn có ảnh cá nhân, hãy đặt file vào thư mục public/ (ví dụ: /avatar.jpg)
    avatarUrl: "",
  },

  event: {
    title: "LỄ TỐT NGHIỆP CỬ NHÂN / KỸ SƯ 2026",
    date: "Chủ Nhật, Ngày 15 Tháng 11 Năm 2026",
    time: "07:30 - 12:00",
    isoDateTime: "2026-11-15T08:00:00", // Thời gian dùng cho đồng hồ đếm ngược (YYYY-MM-DDTHH:mm:ss)
    locationName: "Hội Trường Lớn A5 - Trường Đại Học Bách Khoa",
    hall: "Khu vực sảnh A5 & Khán phòng Tầng 2",
    address: "268 Lý Thường Kiệt, Phường 14, Quận 10, TP. Hồ Chí Minh",
    googleMapsUrl: "https://maps.google.com/?q=268+Ly+Thuong+Kiet+Quan+10+TPHCM",
    googleMapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.494799014167!2d106.6576629!3d10.772591!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752ec3c161a3fb%3A0x8ae7de4ac488f5d1!2zVHLGsOG7nW5nIMSQ4bqhaSBI4buNYyBCw6FjaCBLaG9hIC0gxJBRUUctSENN!5e0!3m2!1svi!2s!4v1700000000000!5m2!1svi!2s",
  },

  dresscode: {
    title: "DRESSCODE GỢI Ý & PALETTE MÀU",
    description: "Để những bức ảnh kỷ niệm lưu giữ khoảnh khắc này được lung linh và đồng điệu nhất, mình gợi ý một số tone màu trang phục ấm cúng, lịch sự:",
    colors: [
      { name: "Cyber Navy", hex: "#0F2042", desc: "Trang trọng, thanh lịch" },
      { name: "Champagne Gold", hex: "#F3C68F", desc: "Tươi sáng, nổi bật" },
      { name: "Pure White", hex: "#F8FAFC", desc: "Tươi trẻ, đồng điệu" },
      { name: "Deep Charcoal", hex: "#1E293B", desc: "Hiện đại, nam tính" },
    ],
  },

  timeline: [
    {
      time: "07:30 - 08:30",
      title: "Check-in & Chụp ảnh khuôn viên",
      description: "Đón tiếp người thân, bạn bè. Chụp ảnh lưu niệm tại backdrop khoa và khuôn viên trường khi ánh sáng đẹp nhất.",
      icon: "camera",
    },
    {
      time: "08:30 - 09:30",
      title: "Lễ Khai Mạc & Báo Cáo",
      description: "Nghi thức chào cờ, phát biểu của Ban Giám hiệu nhà trường và đại diện tân khoa.",
      icon: "mic",
    },
    {
      time: "09:30 - 11:00",
      title: "Nghi Thức Trao Bằng Chính Thức",
      description: "Khoảnh khắc xướng tên và trao tấm bằng kỹ sư trên sân khấu danh dự.",
      icon: "award",
    },
    {
      time: "11:00 - 11:30",
      title: "Tung Mũ Tốt Nghiệp Tập Thể",
      description: "Tung mũ cử nhân cùng toàn thể tân khoa tại sân trung tâm. Khoảnh khắc đánh dấu cột mốc trưởng thành!",
      icon: "sparkles",
    },
    {
      time: "11:30 - 13:00",
      title: "Gặp Gỡ & Tiệc Mừng Thân Mật",
      description: "Dùng bữa trưa/tiệc ngọt ấm cúng cùng gia đình và nhóm bạn thân.",
      icon: "coffee",
    },
  ],

  memories: [
    {
      phase: "LEVEL 01",
      year: "2022 - Tân Sinh Viên",
      title: "Bước Vào Thế Giới Thuật Toán",
      description: "Lần đầu bước chân vào giảng đường với bao điều bỡ ngỡ, làm quen với dòng code C/C++ đầu tiên 'Hello World' và những người bạn tri kỷ.",
      tags: ["Hello World", "K20", "Giải Tích"],
      imagePlaceholderBg: "from-blue-600/30 to-cyan-500/20",
    },
    {
      phase: "LEVEL 02",
      year: "2023 - Bứt Phá",
      title: "Đêm Trắng Phòng Lab & Hackathon",
      description: "Những dự án xuyên đêm, làm quen với cấu trúc dữ liệu, thuật toán, những buổi thảo luận nhóm căng thẳng nhưng đầy tiếng cười.",
      tags: ["Lab All-nighter", "Hackathon", "Teamwork"],
      imagePlaceholderBg: "from-purple-600/30 to-pink-500/20",
    },
    {
      phase: "LEVEL 03",
      year: "2024 - Thực Chiến",
      title: "Thực Tập Doanh Nghiệp",
      description: "Chập chững bước ra môi trường doanh nghiệp thực tế, học cách vận hành sản phẩm và áp dụng kiến thức vào bài toán thật.",
      tags: ["Software Engineer", "Internship", "Production"],
      imagePlaceholderBg: "from-cyan-600/30 to-emerald-500/20",
    },
    {
      phase: "LEVEL 04",
      year: "2025-2026 - Về Đích",
      title: "Bảo Vệ Khóa Luận Tốt Nghiệp",
      description: "Hoàn thiện đề tài tốt nghiệp, tự tin bảo vệ trước hội đồng giám khảo và chính thức hoàn thành chương trình đào tạo kỹ sư xuất sắc.",
      tags: ["Thesis Defense", "Grade A+", "Victory"],
      imagePlaceholderBg: "from-amber-600/30 to-rose-500/20",
    },
  ],

  contact: {
    phone: "0912 345 678",
    facebookUrl: "https://facebook.com",
    zaloUrl: "https://zalo.me",
  },
};

export const INITIAL_WISHES: WishMessage[] = [
  {
    id: "wish-1",
    name: "Mẹ & Bố",
    relation: "Gia đình",
    message: "Chúc mừng con trai yêu quý đã hoàn thành xuất sắc chặng đường đại học! Cả nhà luôn tự hào về con và chúc con vững bước trên chặng đường phía trước.",
    timestamp: "Vừa xong",
    avatarEmoji: "❤️",
  },
  {
    id: "wish-2",
    name: "Team Đồ Án K20",
    relation: "Bạn cùng lớp",
    message: "Chúc mừng bro đã chính thức giải phóng khỏi Deadline và nhận bằng Kỹ Sư! Hẹn gặp ở lễ trao bằng để cùng ném mũ nhé!",
    timestamp: "Hôm nay",
    avatarEmoji: "🚀",
  },
  {
    id: "wish-3",
    name: "Thầy Hướng Dẫn",
    relation: "Giảng viên",
    message: "Chúc mừng em đã bảo vệ thành công đề tài. Chúc em tiếp tục giữ vững đam mê học hỏi và gặt hái nhiều thành công trong sự nghiệp kỹ thuật.",
    timestamp: "Hôm qua",
    avatarEmoji: "⭐",
  },
];
