import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GRADUATION_CONFIG } from '../config';
import { sound } from '../utils/audioFx';
import { Sparkles, ArrowRight, Volume2, VolumeX, FastForward, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';

interface YearbookIntroProps {
  onEnter: () => void;
}

export const YearbookIntro: React.FC<YearbookIntroProps> = ({ onEnter }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState<number>(0); // 0: Closed, 1: Spread 1 (2022 Journey), 2: Spread 2 (Graduation Degree)
  const [isMuted, setIsMuted] = useState(sound.getMuted());

  // Animation Refs
  const animFrameRef = useRef<number | null>(null);
  const targetCoverAngleRef = useRef(0);
  const targetPage1AngleRef = useRef(0);
  const currentCoverAngleRef = useRef(0);
  const currentPage1AngleRef = useRef(0);

  // Auto page-turning sequence
  useEffect(() => {
    // 0.8s: Open cover
    const t1 = setTimeout(() => {
      setCurrentPage(1);
      targetCoverAngleRef.current = -Math.PI + 0.12;
      try {
        sound.playBookPageTurn();
      } catch {
        // Audio
      }
    }, 900);

    // 3.8s: Turn to graduation page
    const t2 = setTimeout(() => {
      setCurrentPage(2);
      targetPage1AngleRef.current = -Math.PI + 0.18;
      try {
        sound.playBookPageTurn();
        setTimeout(() => sound.playRoyalFanfare(), 250);
      } catch {
        // Audio
      }
    }, 3800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060913, 0.015);

    const width = window.innerWidth;
    const height = window.innerHeight;
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 7.5, 17);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x060913, 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Mouse Tracking
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 2. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xfffdfa, 1.4);
    scene.add(ambientLight);

    const keySpotlight = new THREE.SpotLight(0xfef08a, 4.5, 45, Math.PI / 4, 0.4);
    keySpotlight.position.set(0, 18, 12);
    keySpotlight.castShadow = true;
    scene.add(keySpotlight);

    const rimLight = new THREE.DirectionalLight(0xd4af37, 2.0);
    rimLight.position.set(-10, 8, -8);
    scene.add(rimLight);

    // 3. Materials
    const leatherMat = new THREE.MeshStandardMaterial({
      color: 0x091124, // Royal midnight navy leather
      roughness: 0.55,
      metalness: 0.15,
    });

    const goldTrimMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.2,
      metalness: 0.95,
      emissive: 0x9a7b38,
      emissiveIntensity: 0.2,
    });

    const paperSideMat = new THREE.MeshStandardMaterial({
      color: 0xf3ede2,
      roughness: 0.8,
    });

    // 4. Ground Desk Velvet Surface
    const deskGeo = new THREE.PlaneGeometry(50, 50);
    const deskMat = new THREE.MeshStandardMaterial({
      color: 0x070d1a,
      roughness: 0.7,
      metalness: 0.1,
    });
    const desk = new THREE.Mesh(deskGeo, deskMat);
    desk.rotation.x = -Math.PI / 2;
    desk.position.y = -2.2;
    desk.receiveShadow = true;
    scene.add(desk);

    // 5. Main Book Container Group
    const bookGroup = new THREE.Group();
    bookGroup.position.set(0, 0, 0);
    bookGroup.rotation.x = 0.38; // Tilted towards camera for comfortable reading
    scene.add(bookGroup);

    const bWidth = 6.2;
    const bHeight = 8.8;

    // Back Cover (Đáy sách)
    const backCoverGeo = new THREE.BoxGeometry(bWidth, bHeight, 0.22);
    backCoverGeo.translate(bWidth / 2, 0, -0.15);
    const backCover = new THREE.Mesh(backCoverGeo, leatherMat);
    backCover.castShadow = true;
    backCover.receiveShadow = true;
    bookGroup.add(backCover);

    // Right Page Block Base (Khối giấy dày bên dưới trang phải)
    const pageBlockGeo = new THREE.BoxGeometry(bWidth - 0.2, bHeight - 0.3, 0.7);
    pageBlockGeo.translate(bWidth / 2, 0, 0.32);
    const pageBlock = new THREE.Mesh(pageBlockGeo, paperSideMat);
    pageBlock.castShadow = true;
    bookGroup.add(pageBlock);

    // Spine (Gáy sách tròn ở giữa)
    const spineGeo = new THREE.CylinderGeometry(0.55, 0.55, bHeight, 16);
    const spineMesh = new THREE.Mesh(spineGeo, leatherMat);
    spineMesh.position.set(0, 0, 0.15);
    bookGroup.add(spineMesh);

    // Gold Ribbons on Spine
    for (let i = -3; i <= 3; i += 1.5) {
      const ribGeo = new THREE.CylinderGeometry(0.57, 0.57, 0.2, 16);
      const ribMesh = new THREE.Mesh(ribGeo, goldTrimMat);
      ribMesh.position.set(0, i, 0.15);
      bookGroup.add(ribMesh);
    }

    // 6. Canvas Textures for Pages
    // FRONT COVER CANVAS TEXTURE
    const coverCanvas = document.createElement('canvas');
    coverCanvas.width = 720;
    coverCanvas.height = 1024;
    const cCtx = coverCanvas.getContext('2d');
    if (cCtx) {
      cCtx.fillStyle = '#0F172A';
      cCtx.fillRect(0, 0, 720, 1024);

      // Gold Double Border
      cCtx.strokeStyle = '#D4AF37';
      cCtx.lineWidth = 12;
      cCtx.strokeRect(32, 32, 656, 960);
      cCtx.lineWidth = 3;
      cCtx.strokeRect(48, 48, 624, 928);

      // Gold Corner ⚜
      cCtx.fillStyle = '#C5A059';
      cCtx.font = '36px serif';
      cCtx.fillText('⚜', 64, 96);
      cCtx.fillText('⚜', 624, 96);
      cCtx.fillText('⚜', 64, 940);
      cCtx.fillText('⚜', 624, 940);

      // Central Embossed Emblem
      cCtx.fillStyle = '#FDE68A';
      cCtx.textAlign = 'center';
      cCtx.font = 'bold 24px sans-serif';
      cCtx.fillText('TRƯỜNG ĐẠI HỌC KINH DOANH & CÔNG NGHỆ HÀ NỘI', 360, 220);

      cCtx.font = 'bold 22px sans-serif';
      cCtx.fillStyle = '#94A3B8';
      cCtx.fillText('KHOA CÔNG NGHỆ THÔNG TIN', 360, 260);

      cCtx.font = '72px serif';
      cCtx.fillText('🎓', 360, 420);

      cCtx.fillStyle = '#D4AF37';
      cCtx.font = 'bold 44px serif';
      cCtx.fillText('KỶ YẾU TỐT NGHIỆP', 360, 540);

      cCtx.font = 'bold 28px sans-serif';
      cCtx.fillStyle = '#F3E5AB';
      cCtx.fillText('KHÓA 27 (2022 - 2026)', 360, 600);

      cCtx.font = '22px sans-serif';
      cCtx.fillStyle = '#CBD5E1';
      cCtx.fillText('KỸ SƯ KỸ THUẬT PHẦN MỀM', 360, 720);

      cCtx.fillStyle = '#C5A059';
      cCtx.font = 'bold 36px serif';
      cCtx.fillText(GRADUATION_CONFIG.graduate.fullName, 360, 790);

      cCtx.font = 'italic 20px serif';
      cCtx.fillStyle = '#94A3B8';
      cCtx.fillText('Thanh xuân lưu dấu • Tương lai rộng mở', 360, 880);
    }
    const coverTex = new THREE.CanvasTexture(coverCanvas);

    // SPREAD 1 TEXTURE (Journey 2022 - 2026)
    const spread1Canvas = document.createElement('canvas');
    spread1Canvas.width = 720;
    spread1Canvas.height = 1024;
    const s1Ctx = spread1Canvas.getContext('2d');
    if (s1Ctx) {
      s1Ctx.fillStyle = '#FCFAF5';
      s1Ctx.fillRect(0, 0, 720, 1024);

      s1Ctx.strokeStyle = '#D4AF37';
      s1Ctx.lineWidth = 4;
      s1Ctx.strokeRect(30, 30, 660, 964);

      s1Ctx.fillStyle = '#8A6D3B';
      s1Ctx.textAlign = 'center';
      s1Ctx.font = 'bold 24px sans-serif';
      s1Ctx.fillText('CHƯƠNG I: BƯỚC CHÂN ĐẦU TIÊN (2022)', 360, 120);

      s1Ctx.fillStyle = '#0F172A';
      s1Ctx.font = 'bold 36px serif';
      s1Ctx.fillText('HÀNH TRÌNH TÂN SINH VIÊN K27', 360, 180);

      s1Ctx.fillStyle = '#334155';
      s1Ctx.font = '22px sans-serif';
      s1Ctx.fillText('Lớp: PM27.07 • Chuyên ngành Kỹ thuật Phần mềm', 360, 240);

      // Quote
      s1Ctx.font = 'italic 21px serif';
      s1Ctx.fillStyle = '#475569';
      s1Ctx.fillText('"Bắt đầu từ những dòng code Hello World đầu tiên,', 360, 380);
      s1Ctx.fillText('những đêm thức trắng cùng đồ án và thuật toán,', 360, 420);
      s1Ctx.fillText('đến hành trình chạm tay vào danh vị Kỹ Sư."', 360, 460);

      // Milestones box
      s1Ctx.fillStyle = '#F5EFE4';
      s1Ctx.fillRect(80, 530, 560, 360);
      s1Ctx.strokeStyle = '#C5A059';
      s1Ctx.lineWidth = 2;
      s1Ctx.strokeRect(80, 530, 560, 360);

      s1Ctx.fillStyle = '#8A6D3B';
      s1Ctx.font = 'bold 22px sans-serif';
      s1Ctx.fillText('CÁC CỘT MỐC ĐÁNG NHỚ', 360, 580);

      s1Ctx.font = '19px sans-serif';
      s1Ctx.fillStyle = '#1E293B';
      s1Ctx.fillText('• 2022: Nhập học Khoa CNTT - HUBT', 360, 640);
      s1Ctx.fillText('• 2023 - 2025: Đồ án chuyên ngành & Thực tập', 360, 710);
      s1Ctx.fillText('• 2026: Bảo vệ Đồ án Tốt nghiệp Xuất Sắc', 360, 780);
      s1Ctx.fillText('• 16/10/2026: Vinh quy bái tổ & Nhận bằng Kỹ sư', 360, 840);
    }
    const spread1Tex = new THREE.CanvasTexture(spread1Canvas);

    // SPREAD 2 TEXTURE (Grand Graduation Certificate Page)
    const spread2Canvas = document.createElement('canvas');
    spread2Canvas.width = 720;
    spread2Canvas.height = 1024;
    const s2Ctx = spread2Canvas.getContext('2d');
    if (s2Ctx) {
      s2Ctx.fillStyle = '#FCFAF5';
      s2Ctx.fillRect(0, 0, 720, 1024);

      // Rich gold border
      s2Ctx.strokeStyle = '#B8860B';
      s2Ctx.lineWidth = 12;
      s2Ctx.strokeRect(28, 28, 664, 968);
      s2Ctx.strokeStyle = '#D4AF37';
      s2Ctx.lineWidth = 3;
      s2Ctx.strokeRect(44, 44, 632, 936);

      s2Ctx.fillStyle = '#8A6D3B';
      s2Ctx.font = '28px serif';
      s2Ctx.fillText('⚜', 58, 85);
      s2Ctx.fillText('⚜', 635, 85);
      s2Ctx.fillText('⚜', 58, 955);
      s2Ctx.fillText('⚜', 635, 955);

      s2Ctx.textAlign = 'center';
      s2Ctx.fillStyle = '#0F172A';
      s2Ctx.font = 'bold 24px "Times New Roman", serif';
      s2Ctx.fillText('CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM', 360, 110);
      s2Ctx.font = 'italic 18px "Times New Roman", serif';
      s2Ctx.fillText('Độc lập - Tự do - Hạnh phúc', 360, 140);

      s2Ctx.fillStyle = '#8A6D3B';
      s2Ctx.font = 'bold 22px sans-serif';
      s2Ctx.fillText('TRƯỜNG ĐH KINH DOANH VÀ CÔNG NGHỆ HÀ NỘI', 360, 205);

      s2Ctx.fillStyle = '#991B1B';
      s2Ctx.font = 'bold 36px serif';
      s2Ctx.fillText('BẰNG TỐT NGHIỆP KỸ SƯ', 360, 280);

      s2Ctx.fillStyle = '#475569';
      s2Ctx.font = 'bold 18px sans-serif';
      s2Ctx.fillText('CÔNG NHẬN TÂN KHOA', 360, 330);

      s2Ctx.fillStyle = '#8A6D3B';
      s2Ctx.font = 'bold 44px serif';
      s2Ctx.fillText(GRADUATION_CONFIG.graduate.fullName, 360, 400);

      s2Ctx.fillStyle = '#1E293B';
      s2Ctx.font = '20px sans-serif';
      s2Ctx.fillText(`Ngành: ${GRADUATION_CONFIG.graduate.major.toUpperCase()}`, 360, 460);
      s2Ctx.fillText(`Lớp: ${GRADUATION_CONFIG.graduate.classCode} • Niên khóa: K27`, 360, 500);

      s2Ctx.font = 'bold 20px sans-serif';
      s2Ctx.fillStyle = '#0F172A';
      s2Ctx.fillText('XẾP LOẠI TỐT NGHIỆP: XUẤT SẮC', 360, 550);

      // Invitation Highlight Box
      s2Ctx.fillStyle = '#F5EFE4';
      s2Ctx.fillRect(70, 620, 580, 190);
      s2Ctx.strokeStyle = '#C5A059';
      s2Ctx.lineWidth = 1.5;
      s2Ctx.strokeRect(70, 620, 580, 190);

      s2Ctx.fillStyle = '#8A6D3B';
      s2Ctx.font = 'bold 20px sans-serif';
      s2Ctx.fillText('THƯ MỜI THAM DỰ LỄ TRAO BẰNG', 360, 665);

      s2Ctx.fillStyle = '#1E293B';
      s2Ctx.font = '19px sans-serif';
      s2Ctx.fillText('Thời gian: 13h00 • Thứ Sáu, ngày 16/10/2026', 360, 715);
      s2Ctx.fillText('Địa điểm: Hội trường lớn - ĐH Kinh doanh & Công nghệ HN', 360, 760);

      // Red Seal
      s2Ctx.fillStyle = '#DC2626';
      s2Ctx.beginPath();
      s2Ctx.arc(540, 880, 50, 0, Math.PI * 2);
      s2Ctx.stroke();
      s2Ctx.font = 'bold 13px sans-serif';
      s2Ctx.fillText('HUBT • KHOA CNTT', 540, 885);
    }
    const spread2Tex = new THREE.CanvasTexture(spread2Canvas);

    // 7. 3D Front Cover Group with Hinge at x = 0
    const frontCoverPivot = new THREE.Group();
    frontCoverPivot.position.set(0, 0, 0.7);
    bookGroup.add(frontCoverPivot);

    const fCoverMatFront = new THREE.MeshStandardMaterial({
      map: coverTex,
      roughness: 0.45,
    });
    const fCoverMatBack = new THREE.MeshStandardMaterial({
      map: spread1Tex,
      roughness: 0.65,
    });
    const fCoverMats = [
      leatherMat,
      leatherMat,
      leatherMat,
      leatherMat,
      fCoverMatFront, // Front face (facing up when closed)
      fCoverMatBack,  // Back face (revealed when flipped open)
    ];

    const fCoverGeo = new THREE.BoxGeometry(bWidth, bHeight, 0.18);
    fCoverGeo.translate(bWidth / 2, 0, 0); // Translate so rotation is around spine
    const frontCoverMesh = new THREE.Mesh(fCoverGeo, fCoverMats);
    frontCoverMesh.castShadow = true;
    frontCoverPivot.add(frontCoverMesh);

    // 8. Flipping Page 1 Group (Hinge at x = 0)
    const page1Pivot = new THREE.Group();
    page1Pivot.position.set(0, 0, 0.72);
    bookGroup.add(page1Pivot);

    const page1MatFront = new THREE.MeshStandardMaterial({
      map: spread1Tex,
      roughness: 0.7,
    });
    const page1MatBack = new THREE.MeshStandardMaterial({
      map: spread2Tex,
      roughness: 0.5,
    });
    const page1Mats = [
      paperSideMat,
      paperSideMat,
      paperSideMat,
      paperSideMat,
      page1MatFront,
      page1MatBack,
    ];

    const page1Geo = new THREE.BoxGeometry(bWidth - 0.2, bHeight - 0.3, 0.05);
    page1Geo.translate(bWidth / 2, 0, 0);
    const page1Mesh = new THREE.Mesh(page1Geo, page1Mats);
    page1Pivot.add(page1Mesh);

    // Destination Stationary Page underneath page 1
    const finalPageGeo = new THREE.PlaneGeometry(bWidth - 0.2, bHeight - 0.3);
    const finalPageMat = new THREE.MeshStandardMaterial({
      map: spread2Tex,
      roughness: 0.5,
    });
    const finalPageMesh = new THREE.Mesh(finalPageGeo, finalPageMat);
    finalPageMesh.position.set(bWidth / 2, 0, 0.68);
    bookGroup.add(finalPageMesh);

    // 9. Floating Golden Dust Motes
    const dustCount = 800;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount * 3; i += 3) {
      dustPos[i] = (Math.random() - 0.5) * 32;
      dustPos[i + 1] = Math.random() * 16 - 2;
      dustPos[i + 2] = (Math.random() - 0.5) * 25;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xfde047,
      size: 0.16,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const dustPoints = new THREE.Points(dustGeo, dustMat);
    scene.add(dustPoints);

    // 10. Animation Render Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Smooth Mouse Parallax
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;
      camera.position.x = mouse.x * 2.2;
      camera.position.y = 7.5 + mouse.y * 1.5;
      camera.lookAt(0, 0.5, 0);

      // Smooth Hinge Interpolation
      currentCoverAngleRef.current += (targetCoverAngleRef.current - currentCoverAngleRef.current) * 0.06;
      frontCoverPivot.rotation.y = currentCoverAngleRef.current;

      currentPage1AngleRef.current += (targetPage1AngleRef.current - currentPage1AngleRef.current) * 0.06;
      page1Pivot.rotation.y = currentPage1AngleRef.current;

      // Gentle floating of book group
      bookGroup.position.y = Math.sin(elapsed * 1.5) * 0.12;

      // Dust motes bobbing
      const dArr = dustGeo.attributes.position.array as Float32Array;
      for (let i = 1; i < dustCount * 3; i += 3) {
        dArr[i] -= 0.012;
        if (dArr[i] < -2) dArr[i] = 14;
      }
      dustGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      coverTex.dispose();
      spread1Tex.dispose();
      spread2Tex.dispose();
      renderer.dispose();
    };
  }, []);

  const handleNextPage = () => {
    try {
      sound.playBookPageTurn();
    } catch {
      // Audio
    }
    if (currentPage === 0) {
      targetCoverAngleRef.current = -Math.PI + 0.12;
      setCurrentPage(1);
    } else if (currentPage === 1) {
      targetPage1AngleRef.current = -Math.PI + 0.18;
      setCurrentPage(2);
      setTimeout(() => sound.playRoyalFanfare(), 250);
    }
  };

  const handlePrevPage = () => {
    try {
      sound.playBookPageTurn();
    } catch {
      // Audio
    }
    if (currentPage === 2) {
      targetPage1AngleRef.current = 0;
      setCurrentPage(1);
    } else if (currentPage === 1) {
      targetCoverAngleRef.current = 0;
      setCurrentPage(0);
    }
  };

  const handleEnterCeremony = () => {
    sound.playSupernova();
    onEnter();
  };

  const handleSkip = () => {
    sound.playClick();
    onEnter();
  };

  const toggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#060913] text-white select-none">
      {/* 3D WebGL Canvas */}
      <div ref={containerRef} className="absolute inset-0 z-0" />

      {/* Top Controls Overlay */}
      <div className="absolute top-4 sm:top-6 inset-x-4 sm:inset-x-8 z-30 flex items-center justify-between pointer-events-auto">
        {/* Left: Audio Toggle */}
        <button
          onClick={toggleSound}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/70 hover:bg-slate-800/80 border border-[#D4AF37]/40 backdrop-blur-md text-xs text-[#F3E5AB] transition-all hover:scale-105 shadow-lg"
          title="Bật/Tắt âm thanh"
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-400" /> : <Volume2 className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />}
          <span className="font-sans font-medium">{isMuted ? 'Bật Âm Thanh' : 'Âm Thanh Bật'}</span>
        </button>

        {/* Right: Skip Intro Button */}
        <button
          onClick={handleSkip}
          className="group flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-900/70 hover:bg-slate-800/80 border border-[#D4AF37]/50 backdrop-blur-md text-xs text-[#F3E5AB] transition-all hover:scale-105 shadow-lg"
        >
          <span>Bỏ qua Intro</span>
          <FastForward className="w-3.5 h-3.5 text-[#D4AF37] group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Bottom Center Book Navigation & CTA Controls */}
      <div className="absolute inset-x-4 bottom-8 sm:bottom-12 z-20 flex flex-col items-center justify-center text-center pointer-events-auto">
        {/* Current Chapter Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-[#D4AF37]/60 backdrop-blur-md text-xs text-[#FDE68A] shadow-xl mb-3">
          <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span className="tracking-[0.2em] font-sans font-bold uppercase">
            {currentPage === 0
              ? 'BÌA KỶ YẾU // KHÓA 27'
              : currentPage === 1
              ? 'TRANG 1: HÀNH TRÌNH 2022 - 2026'
              : 'TRANG 2: BẰNG KỸ SƯ VINH DANH'}
          </span>
        </div>

        {/* Action Controls Row */}
        <div className="flex items-center gap-3 pt-1">
          {/* Previous Page Button */}
          {currentPage > 0 && (
            <button
              onClick={handlePrevPage}
              className="p-3 sm:px-4 sm:py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-[#F3E5AB] text-xs font-semibold flex items-center gap-1 transition-all shadow-lg active:scale-95"
              title="Lật trang trước"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Trang trước</span>
            </button>
          )}

          {/* Primary Action Button */}
          {currentPage < 2 ? (
            <button
              onClick={handleNextPage}
              className="group inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-[#C5A059] via-[#F3E5AB] to-[#D4AF37] text-slate-950 font-bold text-xs sm:text-sm tracking-wider uppercase shadow-xl shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/60"
            >
              <span>LẬT TRANG TIẾP</span>
              <ChevronRight className="w-4 h-4 text-slate-900 group-hover:translate-x-0.5 transition-transform" />
            </button>
          ) : (
            <button
              onClick={handleEnterCeremony}
              className="group inline-flex items-center gap-2.5 px-8 sm:px-10 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-[#C5A059] via-[#F3E5AB] to-[#D4AF37] text-slate-950 font-bold text-sm sm:text-base tracking-widest uppercase shadow-2xl shadow-amber-500/50 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/70 animate-bounce"
            >
              <Sparkles className="w-4 h-4 text-slate-900" />
              <span>BƯỚC VÀO BUỔI LỄ</span>
              <ArrowRight className="w-4 h-4 text-slate-900 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>

        <p className="text-[11px] text-amber-200/60 italic pt-3">
          {currentPage === 2
            ? 'Quyển kỷ yếu đã mở ra trang trọng thể vinh danh Tân Kỹ sư Nguyễn Đức Long'
            : 'Sách đang tự động lật mở từng trang kỷ yếu...'}
        </p>
      </div>
    </div>
  );
};
