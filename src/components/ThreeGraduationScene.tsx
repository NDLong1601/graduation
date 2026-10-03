import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audioFx';
import { GRADUATION_CONFIG } from '../config';
import { Sparkles, RotateCcw, Scroll } from 'lucide-react';

interface ThreeGraduationSceneProps {
  onTossComplete?: () => void;
}

export const ThreeGraduationScene: React.FC<ThreeGraduationSceneProps> = ({ onTossComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isTossing, setIsTossing] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [isDiplomaOpen, setIsDiplomaOpen] = useState(false);

  // References for animation
  const sceneRef = useRef<THREE.Scene | null>(null);
  const capGroupRef = useRef<THREE.Group | null>(null);
  const starsGroupRef = useRef<THREE.Group | null>(null);
  const rolledDiplomaGroupRef = useRef<THREE.Group | null>(null);
  const unrolledDiplomaMeshRef = useRef<THREE.Mesh | null>(null);
  const diplomaProgressRef = useRef(0);
  const isDiplomaOpenRef = useRef(false);

  const tossAnimationRef = useRef<{
    active: boolean;
    progress: number;
    initialY: number;
  }>({ active: false, progress: 0, initialY: 0 });

  // Mouse tracking
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, isDragging: false, prevX: 0, prevY: 0 });

  useEffect(() => {
    isDiplomaOpenRef.current = isDiplomaOpen;
  }, [isDiplomaOpen]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const isMobile = width < 500;
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.35, isMobile ? 7.2 : 6.0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // 2. Realistic Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xfffdfa, 1.4);
    scene.add(ambientLight);

    // Key Studio Light (Warm White)
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.6);
    keyLight.position.set(-3, 5, 4);
    keyLight.castShadow = true;
    scene.add(keyLight);

    // Fill Light (Soft Champagne Gold)
    const fillLight = new THREE.DirectionalLight(0xfef3c7, 1.3);
    fillLight.position.set(4, -2, 3);
    scene.add(fillLight);

    // Rim Light (Rich Polished Gold)
    const rimLight = new THREE.DirectionalLight(0xd4af37, 2.4);
    rimLight.position.set(0, 4, -4);
    scene.add(rimLight);

    // Interactive Point Light that tracks cursor
    const cursorLight = new THREE.PointLight(0xfcd34d, 3.8, 8);
    cursorLight.position.set(0, 0, 3);
    scene.add(cursorLight);

    // 3. Main Cap Group
    const capGroup = new THREE.Group();
    capGroupRef.current = capGroup;
    scene.add(capGroup);

    // Luxury Materials
    const capFabricMaterial = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.45,
      metalness: 0.15,
    });

    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.15,
      metalness: 0.95,
      emissive: 0x9a7b38,
      emissiveIntensity: 0.12,
    });

    const diplomaPaperMat = new THREE.MeshStandardMaterial({
      color: 0xfaf8f5,
      roughness: 0.4,
      metalness: 0.05,
    });

    const diplomaRibbonMat = new THREE.MeshStandardMaterial({
      color: 0x1e3a8a,
      roughness: 0.25,
      metalness: 0.7,
      emissive: 0x1e293b,
      emissiveIntensity: 0.2,
    });

    // 3.1 Mortarboard Upper Square Plaque
    const boardGeo = new THREE.BoxGeometry(2.65, 0.07, 2.65);
    const boardMesh = new THREE.Mesh(boardGeo, capFabricMaterial);
    boardMesh.position.y = 0.55;
    boardMesh.castShadow = true;
    boardMesh.receiveShadow = true;
    capGroup.add(boardMesh);

    // Delicate Gold Beveled Edge
    const edges = new THREE.EdgesGeometry(boardGeo);
    const lineMat = new THREE.LineBasicMaterial({ color: 0xc5a059, transparent: true, opacity: 0.75 });
    const boardWireframe = new THREE.LineSegments(edges, lineMat);
    boardMesh.add(boardWireframe);

    // 3.2 Skull Cap
    const skullCapGeo = new THREE.CylinderGeometry(0.86, 0.72, 0.72, 36);
    const skullCap = new THREE.Mesh(skullCapGeo, capFabricMaterial);
    skullCap.position.y = 0.18;
    skullCap.castShadow = true;
    capGroup.add(skullCap);

    // 3.3 Golden Center Button
    const buttonGeo = new THREE.CylinderGeometry(0.12, 0.14, 0.08, 24);
    const button = new THREE.Mesh(buttonGeo, goldMaterial);
    button.position.y = 0.61;
    capGroup.add(button);

    // 3.4 Golden Tassel Cord & Pendant
    const tasselGroup = new THREE.Group();
    const cordCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.61, 0),
      new THREE.Vector3(0.65, 0.60, 0.65),
      new THREE.Vector3(1.38, 0.50, 1.38),
      new THREE.Vector3(1.45, 0.1, 1.45),
    ]);
    const cordGeo = new THREE.TubeGeometry(cordCurve, 20, 0.026, 8, false);
    const cordMesh = new THREE.Mesh(cordGeo, goldMaterial);
    tasselGroup.add(cordMesh);

    // Tassel Fringe / Hang
    const tasselHangGeo = new THREE.CylinderGeometry(0.06, 0.15, 0.48, 20);
    const tasselHang = new THREE.Mesh(tasselHangGeo, goldMaterial);
    tasselHang.position.set(1.45, -0.1, 1.45);
    tasselGroup.add(tasselHang);
    capGroup.add(tasselGroup);

    // 3.5 ROLLED DIPLOMA SCROLL
    const rolledDiplomaGroup = new THREE.Group();
    rolledDiplomaGroupRef.current = rolledDiplomaGroup;
    rolledDiplomaGroup.position.set(0, -0.68, 0.35);
    rolledDiplomaGroup.rotation.z = Math.PI / 10;
    rolledDiplomaGroup.rotation.y = -Math.PI / 8;

    // Scroll Roll
    const scrollGeo = new THREE.CylinderGeometry(0.25, 0.25, 2.3, 32);
    const scrollMesh = new THREE.Mesh(scrollGeo, diplomaPaperMat);
    scrollMesh.rotation.z = Math.PI / 2;
    scrollMesh.castShadow = true;
    rolledDiplomaGroup.add(scrollMesh);

    // Royal Ribbon Ring
    const ribbonGeo = new THREE.CylinderGeometry(0.27, 0.27, 0.28, 32);
    const ribbonMesh = new THREE.Mesh(ribbonGeo, diplomaRibbonMat);
    ribbonMesh.rotation.z = Math.PI / 2;
    rolledDiplomaGroup.add(ribbonMesh);

    // Gold Medallion Seal on ribbon
    const sealGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.04, 24);
    const sealMesh = new THREE.Mesh(sealGeo, goldMaterial);
    sealMesh.position.set(0, 0.27, 0);
    rolledDiplomaGroup.add(sealMesh);

    capGroup.add(rolledDiplomaGroup);

    // 3.6 UNROLLED DIPLOMA PARCHMENT (Bằng Khen 3D Khi Mở Bung)
    const diplomaCanvas = document.createElement('canvas');
    diplomaCanvas.width = 1024;
    diplomaCanvas.height = 720;
    const dCtx = diplomaCanvas.getContext('2d');
    if (dCtx) {
      // Cream Parchment Background
      dCtx.fillStyle = '#FCFBF8';
      dCtx.fillRect(0, 0, 1024, 720);

      // Gold Double Border
      dCtx.strokeStyle = '#C5A059';
      dCtx.lineWidth = 14;
      dCtx.strokeRect(28, 28, 968, 664);

      dCtx.strokeStyle = '#D4AF37';
      dCtx.lineWidth = 4;
      dCtx.strokeRect(46, 46, 932, 628);

      // Corner flourishes
      dCtx.fillStyle = '#8A6D3B';
      dCtx.font = '24px serif';
      dCtx.fillText('⚜', 58, 80);
      dCtx.fillText('⚜', 940, 80);
      dCtx.fillText('⚜', 58, 650);
      dCtx.fillText('⚜', 940, 650);

      // Institution Header
      dCtx.fillStyle = '#0F172A';
      dCtx.font = 'bold 26px sans-serif';
      dCtx.textAlign = 'center';
      dCtx.fillText('CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM', 512, 100);

      dCtx.font = 'italic 20px serif';
      dCtx.fillText('Độc lập - Tự do - Hạnh phúc', 512, 130);

      dCtx.strokeStyle = '#8A6D3B';
      dCtx.lineWidth = 2;
      dCtx.beginPath();
      dCtx.moveTo(420, 142);
      dCtx.lineTo(604, 142);
      dCtx.stroke();

      // University & Faculty
      dCtx.font = 'bold 22px sans-serif';
      dCtx.fillStyle = '#8A6D3B';
      dCtx.fillText('TRƯỜNG ĐẠI HỌC KINH DOANH VÀ CÔNG NGHỆ HÀ NỘI', 512, 195);
      dCtx.font = 'bold 20px sans-serif';
      dCtx.fillText('KHOA CÔNG NGHỆ THÔNG TIN', 512, 225);

      // Certificate Title
      dCtx.fillStyle = '#991B1B';
      dCtx.font = 'bold 44px serif';
      dCtx.fillText('BẰNG TỐT NGHIỆP KỸ SƯ', 512, 310);

      dCtx.font = 'bold 22px sans-serif';
      dCtx.fillStyle = '#0F172A';
      dCtx.fillText('CÔNG NHẬN TÂN KHOA', 512, 360);

      // Name & Details
      dCtx.font = 'bold 48px serif';
      dCtx.fillStyle = '#8A6D3B';
      dCtx.fillText(GRADUATION_CONFIG.graduate.fullName, 512, 425);

      dCtx.font = '22px sans-serif';
      dCtx.fillStyle = '#334155';
      dCtx.fillText(`Ngành: ${GRADUATION_CONFIG.graduate.major} • Lớp: ${GRADUATION_CONFIG.graduate.classCode}`, 512, 475);
      dCtx.fillText('Xếp loại tốt nghiệp: XUẤT SẮC • Niên khóa: K27 (2022 - 2026)', 512, 510);

      // Red Wax Seal Stamp
      dCtx.fillStyle = '#991B1B';
      dCtx.beginPath();
      dCtx.arc(810, 575, 52, 0, Math.PI * 2);
      dCtx.fill();
      dCtx.strokeStyle = '#D4AF37';
      dCtx.lineWidth = 4;
      dCtx.stroke();

      dCtx.fillStyle = '#FDE68A';
      dCtx.font = 'bold 16px sans-serif';
      dCtx.fillText('HUBT', 810, 565);
      dCtx.fillText('KHOA CNTT', 810, 588);

      // Date of Ceremony
      dCtx.fillStyle = '#475569';
      dCtx.font = 'italic 18px serif';
      dCtx.fillText('Hà Nội, ngày 16 tháng 10 năm 2026', 810, 650);
    }

    const unrolledTexture = new THREE.CanvasTexture(diplomaCanvas);
    const unrolledGeo = new THREE.PlaneGeometry(3.3, 2.3, 16, 16);
    // Subtle curl on edges
    const unrolledPos = unrolledGeo.attributes.position;
    for (let i = 0; i < unrolledPos.count; i++) {
      const x = unrolledPos.getX(i);
      const z = -Math.sin((x / 1.65) * Math.PI) * 0.12;
      unrolledPos.setZ(i, z);
    }
    unrolledGeo.computeVertexNormals();

    const unrolledMat = new THREE.MeshStandardMaterial({
      map: unrolledTexture,
      roughness: 0.35,
      metalness: 0.1,
      side: THREE.DoubleSide,
    });

    const unrolledMesh = new THREE.Mesh(unrolledGeo, unrolledMat);
    unrolledDiplomaMeshRef.current = unrolledMesh;
    unrolledMesh.position.set(0, -0.4, 0.4);
    unrolledMesh.scale.set(0, 0, 0); // initially hidden
    capGroup.add(unrolledMesh);

    // 3.7 Orbiting 3D Golden Octahedron Stars
    const starsGroup = new THREE.Group();
    starsGroupRef.current = starsGroup;
    const starGeo = new THREE.OctahedronGeometry(0.11, 0);
    for (let i = 0; i < 5; i++) {
      const starMesh = new THREE.Mesh(starGeo, goldMaterial);
      const angle = (i / 5) * Math.PI * 2;
      const radius = 2.2;
      starMesh.position.set(Math.cos(angle) * radius, ((i % 3) - 1) * 0.4, Math.sin(angle) * radius);
      starsGroup.add(starMesh);
    }
    capGroup.add(starsGroup);

    // 4. Subtle Marble / Gold Pedestal Ring
    const floorGeo = new THREE.RingGeometry(1.6, 2.4, 48);
    const floorMat = new THREE.MeshBasicMaterial({
      color: 0xc5a059,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = Math.PI / 2;
    floorMesh.position.y = -1.25;
    scene.add(floorMesh);

    // 5. Handle Mouse and Dragging
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      mouseRef.current.targetX = x;
      mouseRef.current.targetY = y;

      if (mouseRef.current.isDragging) {
        const deltaX = e.clientX - mouseRef.current.prevX;
        const deltaY = e.clientY - mouseRef.current.prevY;
        if (capGroupRef.current) {
          capGroupRef.current.rotation.y += deltaX * 0.008;
          capGroupRef.current.rotation.x += deltaY * 0.008;
        }
        mouseRef.current.prevX = e.clientX;
        mouseRef.current.prevY = e.clientY;
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      mouseRef.current.isDragging = true;
      mouseRef.current.prevX = e.clientX;
      mouseRef.current.prevY = e.clientY;
      setIsInteracting(true);
    };

    const handleMouseUp = () => {
      mouseRef.current.isDragging = false;
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        mouseRef.current.isDragging = true;
        mouseRef.current.prevX = e.touches[0].clientX;
        mouseRef.current.prevY = e.touches[0].clientY;
        setIsInteracting(true);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (mouseRef.current.isDragging && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - mouseRef.current.prevX;
        const deltaY = e.touches[0].clientY - mouseRef.current.prevY;
        if (capGroupRef.current) {
          capGroupRef.current.rotation.y += deltaX * 0.009;
          capGroupRef.current.rotation.x += deltaY * 0.009;
        }
        mouseRef.current.prevX = e.touches[0].clientX;
        mouseRef.current.prevY = e.touches[0].clientY;
      }
    };

    const handleTouchEnd = () => {
      mouseRef.current.isDragging = false;
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    // 6. Animation Loop
    let clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // Smooth Diploma Open/Close Interpolation
      const targetDiploma = isDiplomaOpenRef.current ? 1.0 : 0.0;
      diplomaProgressRef.current += (targetDiploma - diplomaProgressRef.current) * 0.09;
      const dp = diplomaProgressRef.current;

      if (rolledDiplomaGroupRef.current && unrolledDiplomaMeshRef.current) {
        // Rolled scroll shrinks and drops slightly
        rolledDiplomaGroupRef.current.scale.set(1 - dp, 1 - dp, 1 - dp);
        rolledDiplomaGroupRef.current.visible = dp < 0.98;

        // Unrolled parchment scales in, steps forward facing camera
        unrolledDiplomaMeshRef.current.scale.set(dp, dp, dp);
        unrolledDiplomaMeshRef.current.position.set(0, -0.3 + dp * 0.1, 0.4 + dp * 0.4);
        unrolledDiplomaMeshRef.current.visible = dp > 0.02;
      }

      // Handle Toss Animation
      if (tossAnimationRef.current.active && capGroupRef.current) {
        tossAnimationRef.current.progress += 0.016;
        const p = tossAnimationRef.current.progress;

        if (p < 0.5) {
          const upFactor = Math.sin(p * Math.PI);
          capGroupRef.current.position.y = tossAnimationRef.current.initialY + upFactor * 2.8;
          capGroupRef.current.rotation.y += 0.18;
          capGroupRef.current.rotation.z = Math.sin(p * 10) * 0.35;
        } else if (p < 1.0) {
          const downFactor = Math.sin(p * Math.PI);
          capGroupRef.current.position.y = tossAnimationRef.current.initialY + downFactor * 2.8;
          capGroupRef.current.rotation.y += 0.08;
          capGroupRef.current.rotation.z = Math.sin(p * 8) * 0.15;
        } else {
          tossAnimationRef.current.active = false;
          capGroupRef.current.position.y = tossAnimationRef.current.initialY;
          setIsTossing(false);
          if (onTossComplete) onTossComplete();
        }
      } else if (capGroupRef.current && !mouseRef.current.isDragging) {
        // Natural subtle floating idle animation
        capGroupRef.current.position.y = Math.sin(elapsedTime * 1.5) * 0.08;
        if (!isDiplomaOpenRef.current) {
          capGroupRef.current.rotation.y += 0.005;
          capGroupRef.current.rotation.x = 0.2 + mouseRef.current.y * 0.22;
          capGroupRef.current.rotation.z = -mouseRef.current.x * 0.16;
        } else {
          // When diploma is open, align smoothly to face camera
          capGroupRef.current.rotation.x += (0.05 - capGroupRef.current.rotation.x) * 0.05;
          capGroupRef.current.rotation.y += (0.0 - capGroupRef.current.rotation.y) * 0.05;
          capGroupRef.current.rotation.z += (0.0 - capGroupRef.current.rotation.z) * 0.05;
        }
      }

      // Cursor light tracking
      cursorLight.position.x = mouseRef.current.x * 3.5;
      cursorLight.position.y = mouseRef.current.y * 2.5 + 0.5;

      // Rotate 3D Stars Group
      if (starsGroupRef.current) {
        starsGroupRef.current.rotation.y = elapsedTime * 0.35;
        starsGroupRef.current.children.forEach((star) => {
          star.rotation.x += 0.02;
          star.rotation.y += 0.03;
        });
      }

      // Rotate Floor Disc gently
      floorMesh.rotation.z = -elapsedTime * 0.1;

      renderer.render(scene, camera);
    };

    animate();

    // 7. Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.position.z = newW < 500 ? 7.2 : 6.0;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      unrolledTexture.dispose();
      unrolledGeo.dispose();
      renderer.dispose();
    };
  }, [onTossComplete]);

  const toggleDiploma = () => {
    sound.playDiplomaUnroll();
    setIsDiplomaOpen((prev) => !prev);
  };

  const triggerCapToss = () => {
    if (isTossing || !capGroupRef.current) return;

    sound.playCapToss();
    setIsTossing(true);
    tossAnimationRef.current = {
      active: true,
      progress: 0,
      initialY: capGroupRef.current.position.y,
    };

    // Elegant Gold & Champagne Confetti
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#C5A059', '#F3E5AB', '#FFFFFF', '#1E3A8A'],
    });

    setTimeout(() => {
      confetti({
        particleCount: 75,
        angle: 60,
        spread: 60,
        origin: { x: 0 },
        colors: ['#D4AF37', '#C5A059', '#FFFFFF'],
      });
      confetti({
        particleCount: 75,
        angle: 120,
        spread: 60,
        origin: { x: 1 },
        colors: ['#1E3A8A', '#D4AF37', '#FFFFFF'],
      });
    }, 250);
  };

  const resetRotation = () => {
    if (capGroupRef.current) {
      capGroupRef.current.rotation.set(0.2, 0, 0);
      sound.playClick();
    }
  };

  return (
    <div className="relative w-full h-[360px] sm:h-[450px] md:h-[520px] select-none flex items-center justify-center">
      {/* 3D WebGL Canvas Container */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing outline-none touch-none"
        title="Kéo chuột hoặc vuốt để xoay mô hình 3D"
      />

      {/* Luxury Gold Badge Overlay */}
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 pointer-events-none">
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full bg-white/90 border border-[#C5A059]/40 backdrop-blur-md text-[11px] font-medium text-[#8A6D3B] shadow-md shadow-slate-900/5">
          <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-ping" />
          <span className="tracking-wide">TƯƠNG TÁC 3D // 360°</span>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="absolute bottom-3 sm:bottom-4 inset-x-3 sm:inset-x-4 flex items-center justify-between gap-2 pointer-events-auto">
        {/* Reset View Button */}
        {isInteracting && (
          <button
            onClick={resetRotation}
            className="p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 transition-all text-xs shadow-sm"
            title="Đặt lại góc xoay"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}

        <div className="flex items-center gap-2 ml-auto">
          {/* Interactive 3D Diploma Toggle Button */}
          <button
            onClick={toggleDiploma}
            className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2.5 rounded-xl font-semibold text-xs transition-all shadow-sm ${
              isDiplomaOpen
                ? 'bg-amber-100 border border-amber-400 text-amber-900'
                : 'bg-white hover:bg-amber-50 border border-[#C5A059]/40 text-[#8A6D3B]'
            }`}
          >
            <Scroll className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{isDiplomaOpen ? 'Cuộn Bằng Lại' : '📜 Mở Bằng Kỹ Sư'}</span>
          </button>

          {/* Toss Cap Button */}
          <button
            onClick={triggerCapToss}
            disabled={isTossing}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm tracking-wide transition-all shadow-md ${
              isTossing
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#1E293B] via-[#334155] to-[#1E293B] hover:from-[#0F172A] hover:to-[#0F172A] text-[#F3E5AB] border border-[#C5A059]/50 shadow-slate-900/10 hover:scale-105 active:scale-95'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 text-[#D4AF37] ${isTossing ? 'animate-spin' : 'animate-bounce'}`} />
            <span>{isTossing ? 'Đang Tung Mũ...' : '🎓 Tung Mũ!'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
