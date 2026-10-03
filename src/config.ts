import type { EventConfig, WishMessage } from './types/graduation';

// =====================================================================
// BẠN CÓ THỂ CHỈNH SỬA TOÀN BỘ THÔNG TIN CÁ NHÂN VÀ BUỔI LỄ TẠI FILE NÀY!
// =====================================================================
export const GRADUATION_CONFIG: EventConfig = {
  graduate: {
    fullName: "NGUYỄN ĐỨC LONG",
    degree: "TÂN KỸ SƯ KỸ THUẬT PHẦN MỀM",
    major: "KỸ THUẬT PHẦN MỀM",
    university: "Trường Đại học Kinh doanh và Công nghệ Hà Nội (HUBT)",
    faculty: "Khoa Công nghệ Thông tin",
    classCode: "PM27.07",
    studentId: "",
    // Nếu bạn có ảnh cá nhân, hãy đặt file vào thư mục public/ (ví dụ: /avatar.jpg)
    avatarUrl: "",
  },

  event: {
    title: "LỄ TỐT NGHIỆP SINH VIÊN KHÓA 27 NGÀNH CÔNG NGHỆ THÔNG TIN",
    date: "Thứ Sáu, Ngày 16 Tháng 10 Năm 2026",
    time: "13:00",
    isoDateTime: "2026-10-16T13:00:00", // Thời gian dùng cho đồng hồ đếm ngược (YYYY-MM-DDTHH:mm:ss)
    locationName: "Hội trường nhà B - Trường ĐH Kinh doanh và Công nghệ Hà Nội",
    hall: "Hội trường nhà B",
    address: "Số 29A, Ngõ 124, Phố Vĩnh Tuy, Phường Vĩnh Tuy, Quận Hai Bà Trưng, Hà Nội",
    googleMapsUrl: "https://maps.google.com/?q=Tr%C6%B0%E1%BB%9Dng+%C4%90%E1%BA%A1i+h%E1%BB%8Dc+Kinh+doanh+v%C3%A0+C%C3%B4ng+ngh%E1%BB%87+H%C3%A0+N%E1%BB%99i",
    googleMapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.8967520021334!2d105.87563507596918!3d20.99677338987154!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ac1b0b58e65f%3A0x6b2b63897b7cb27a!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBLaW5oIGRvYW5oIHbDoCBDw7RuZyBuZ2jhu4cgSMOgIE7hu5lp!5e0!3m2!1svi!2s!4v1700000000000!5m2!1svi!2s",
  },

  dresscode: {
    title: "TRANG PHỤC THAM DỰ",
    description: "Trang phục lịch sự, trang nhã để cùng lưu giữ những khoảnh khắc đẹp nhất của tuổi thanh xuân.",
    colors: [],
  },

  timeline: [
    {
      time: "12:30 - 13:00",
      title: "Đón tiếp & Chụp ảnh kỷ niệm",
      description: "Đón tiếp người thân, bạn bè tại sảnh Hội trường nhà B. Chụp những bức ảnh lưu niệm thanh xuân cùng thầy cô và bạn bè.",
      icon: "camera",
    },
    {
      time: "13:00 - 13:30",
      title: "Khai mạc Lễ Tốt Nghiệp",
      description: "Nghi thức chào cờ, phát biểu chúc mừng của Ban Chủ nhiệm Khoa Công nghệ Thông tin và Đại diện Nhà trường.",
      icon: "mic",
    },
    {
      time: "13:30 - 14:45",
      title: "Nghi Thức Trao Bằng Tân Kỹ Sư",
      description: "Xướng tên và trao bằng tốt nghiệp kỹ sư cho các bạn sinh viên Khóa 27 ngành Công nghệ Thông tin.",
      icon: "award",
    },
    {
      time: "14:45 - 15:30",
      title: "Tung Mũ & Lưu Giữ Kỷ Niệm",
      description: "Nghi thức tung mũ cử nhân, chụp ảnh tập thể và gửi lời tri ân. Khép lại một hành trình – Mở ra một tương lai!",
      icon: "sparkles",
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
    phone: "0942 447 120",
    facebookUrl: "https://facebook.com",
    zaloUrl: "https://zalo.me/0942447120",
  },
};

export const INITIAL_WISHES: WishMessage[] = [];
