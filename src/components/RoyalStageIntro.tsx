import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GRADUATION_CONFIG } from '../config';
import { sound } from '../utils/audioFx';
import { Sparkles, ArrowRight, Volume2, VolumeX, FastForward } from 'lucide-react';

interface RoyalStageIntroProps {
  onEnter: () => void;
}

export const RoyalStageIntro: React.FC<RoyalStageIntroProps> = ({ onEnter }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpening, setIsOpening] = useState(false);
  const [isMuted, setIsMuted] = useState(sound.getMuted());

  const animFrameRef = useRef<number | null>(null);
  const isOpeningRef = useRef(false);
  const openProgressRef = useRef(0);

  useEffect(() => {
    isOpeningRef.current = isOpening;
  }, [isOpening]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060810, 0.022);

    const width = window.innerWidth;
    const height = window.innerHeight;
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 1.8, 14.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x060810, 1);
    container.appendChild(renderer.domElement);

    // Mouse Tracking for Interactive 3D Camera Pan
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 2. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0x0a0f1d, 2.2);
    scene.add(ambientLight);

    const stagePoint = new THREE.PointLight(0xfff5db, 3.5, 30);
    stagePoint.position.set(0, 7, 2);
    scene.add(stagePoint);

    // Materials
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.22,
      metalness: 0.9,
      emissive: 0x8a6d3b,
      emissiveIntensity: 0.2,
    });

    const velvetMat = new THREE.MeshStandardMaterial({
      color: 0x880e26, // Royal Deep Burgundy
      roughness: 0.75,
      metalness: 0.15,
      side: THREE.DoubleSide,
    });

    const darkMarbleMat = new THREE.MeshStandardMaterial({
      color: 0x090d16,
      roughness: 0.2,
      metalness: 0.6,
    });

    // 3. Stage Floor (Sàn sân khấu cẩm thạch đen bóng)
    const floorGeo = new THREE.PlaneGeometry(35, 30, 20, 20);
    const floor = new THREE.Mesh(floorGeo, darkMarbleMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2.8;
    scene.add(floor);

    // Stage Front Lip & Golden Trim
    const lipGeo = new THREE.BoxGeometry(32, 0.4, 0.6);
    const lip = new THREE.Mesh(lipGeo, goldMat);
    lip.position.set(0, -2.8, 8.5);
    scene.add(lip);

    // 4. Center Honor Pedestal (Bục vinh danh danh dự)
    const pedestalGroup = new THREE.Group();
    pedestalGroup.position.set(0, -2.8, -1.5);
    scene.add(pedestalGroup);

    // Tier 1 Base
    const pBaseGeo = new THREE.CylinderGeometry(2.4, 2.7, 0.5, 32);
    const pBase = new THREE.Mesh(pBaseGeo, darkMarbleMat);
    pBase.position.y = 0.25;
    pedestalGroup.add(pBase);

    const pBaseTrim = new THREE.Mesh(new THREE.TorusGeometry(2.55, 0.08, 16, 48), goldMat);
    pBaseTrim.rotation.x = Math.PI / 2;
    pBaseTrim.position.y = 0.5;
    pedestalGroup.add(pBaseTrim);

    // Tier 2 Column
    const pColGeo = new THREE.CylinderGeometry(1.6, 1.8, 1.4, 32);
    const pCol = new THREE.Mesh(pColGeo, darkMarbleMat);
    pCol.position.y = 1.2;
    pedestalGroup.add(pCol);

    // Tier 3 Plinth Gold Plate
    const pTopGeo = new THREE.CylinderGeometry(1.9, 1.6, 0.2, 32);
    const pTop = new THREE.Mesh(pTopGeo, goldMat);
    pTop.position.y = 2.0;
    pedestalGroup.add(pTop);

    // Floating 3D Graduation Cap on Pedestal
    const capGroup = new THREE.Group();
    capGroup.position.set(0, 3.4, 0);
    pedestalGroup.add(capGroup);

    const capMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4, metalness: 0.2 });
    const capTop = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.08, 2.2), capMat);
    capTop.rotation.y = Math.PI / 4;
    capGroup.add(capTop);

    const capTrim = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(2.2, 0.08, 2.2)), new THREE.LineBasicMaterial({ color: 0xd4af37 }));
    capTop.add(capTrim);

    const skull = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.6, 0.6, 24), capMat);
    skull.position.y = -0.32;
    capGroup.add(skull);

    const tassel = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.1, 0.75, 12), goldMat);
    tassel.position.set(1.1, -0.4, 1.1);
    capGroup.add(tassel);

    // Golden Halo Ring hovering above Cap
    const halo = new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.03, 16, 48), goldMat);
    halo.rotation.x = Math.PI / 2;
    halo.position.y = 0.6;
    capGroup.add(halo);

    // 5. 3D Royal Velvet Curtains (Rèm nhung lượn sóng vật lý)
    const createCurtainGeometry = (w: number, h: number, segmentsX: number, segmentsY: number, side: 'left' | 'right') => {
      const geo = new THREE.PlaneGeometry(w, h, segmentsX, segmentsY);
      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        // Sinusoidal vertical velvet folds
        const fold = Math.sin(x * 3.8 + (side === 'left' ? 0 : Math.PI)) * 0.45;
        pos.setZ(i, fold);
      }
      geo.computeVertexNormals();
      return geo;
    };

    const curtainWidth = 8.5;
    const curtainHeight = 12.0;

    // Left Curtain Mesh
    const leftCurtainGeo = createCurtainGeometry(curtainWidth, curtainHeight, 48, 12, 'left');
    const leftCurtain = new THREE.Mesh(leftCurtainGeo, velvetMat);
    leftCurtain.position.set(-4.1, 2.5, 4.8);
    scene.add(leftCurtain);

    // Right Curtain Mesh
    const rightCurtainGeo = createCurtainGeometry(curtainWidth, curtainHeight, 48, 12, 'right');
    const rightCurtain = new THREE.Mesh(rightCurtainGeo, velvetMat);
    rightCurtain.position.set(4.1, 2.5, 4.8);
    scene.add(rightCurtain);

    // Top Curtain Pelmet / Valance (Yếm rèm vòm phía trên)
    const valanceGeo = new THREE.BoxGeometry(20, 1.8, 0.5);
    const valance = new THREE.Mesh(valanceGeo, velvetMat);
    valance.position.set(0, 8.2, 5.0);
    scene.add(valance);

    const valanceFringe = new THREE.Mesh(new THREE.BoxGeometry(20.2, 0.25, 0.6), goldMat);
    valanceFringe.position.set(0, 7.25, 5.0);
    scene.add(valanceFringe);

    // 6. Volumetric Spotlights (Luồng nón ánh sáng sân khấu)
    const spotGeo = new THREE.ConeGeometry(3.5, 15, 32, 1, true);
    spotGeo.translate(0, -7.5, 0);

    const createSpotCone = (colorHex: number, opacity: number) => {
      const mat = new THREE.MeshBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity: opacity,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      return new THREE.Mesh(spotGeo, mat);
    };

    // Center Gold Spotlight
    const centerSpot = createSpotCone(0xfde047, 0.18);
    centerSpot.position.set(0, 12, 1.5);
    centerSpot.rotation.x = Math.PI / 1.12;
    scene.add(centerSpot);

    // Left Blue-Gold Spotlight
    const leftSpot = createSpotCone(0x38bdf8, 0.14);
    leftSpot.position.set(-7, 12, 2.5);
    leftSpot.rotation.x = Math.PI / 1.15;
    leftSpot.rotation.z = -0.35;
    scene.add(leftSpot);

    // Right Amber Spotlight
    const rightSpot = createSpotCone(0xf59e0b, 0.14);
    rightSpot.position.set(7, 12, 2.5);
    rightSpot.rotation.x = Math.PI / 1.15;
    rightSpot.rotation.z = 0.35;
    scene.add(rightSpot);

    // 7. Ambient Floating Dust Motes (Bụi vàng kim tuyến lơ lửng)
    const dustCount = 280;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount * 3; i += 3) {
      dustPos[i] = (Math.random() - 0.5) * 20;
      dustPos[i + 1] = Math.random() * 10 - 2;
      dustPos[i + 2] = (Math.random() - 0.5) * 14;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xfef08a,
      size: 0.12,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);

    // 8. Animation Render Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Mouse Parallax Look
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Gentle floating animation of Cap & Halo
      capGroup.rotation.y = elapsed * 0.5;
      capGroup.position.y = 3.4 + Math.sin(elapsed * 2.0) * 0.15;
      halo.rotation.z = elapsed * 0.8;

      // Spotlight sweeping movements
      if (!isOpeningRef.current) {
        centerSpot.rotation.z = Math.sin(elapsed * 1.2) * 0.12;
        leftSpot.rotation.z = -0.35 + Math.sin(elapsed * 1.5) * 0.15;
        rightSpot.rotation.z = 0.35 + Math.cos(elapsed * 1.4) * 0.15;

        camera.position.x = mouse.x * 1.2;
        camera.position.y = 1.8 + mouse.y * 0.6;
        camera.lookAt(0, 2.0, 0);
      } else {
        // Curtain Open & Camera Dolly Transition
        openProgressRef.current = Math.min(openProgressRef.current + delta * 0.55, 1.0);
        const p = openProgressRef.current;
        // Cubic ease out
        const ease = 1 - Math.pow(1 - p, 3);

        // Curtains slide aside & bunch up
        leftCurtain.position.x = -4.1 - ease * 7.5;
        leftCurtain.scale.x = 1.0 - ease * 0.65;

        rightCurtain.position.x = 4.1 + ease * 7.5;
        rightCurtain.scale.x = 1.0 - ease * 0.65;

        // Spotlights converge on center honor pedestal
        centerSpot.rotation.z = 0;
        leftSpot.rotation.z = -0.35 * (1 - ease);
        rightSpot.rotation.z = 0.35 * (1 - ease);
        centerSpot.scale.set(1 + ease * 0.5, 1, 1 + ease * 0.5);

        // Camera dollies forward into the stage
        camera.position.z = 14.5 - ease * 7.2;
        camera.position.y = 1.8 - ease * 0.4;
        camera.position.x = mouse.x * 0.4 * (1 - ease);
        camera.lookAt(0, 1.4, 0);

        if (p >= 0.98) {
          onEnter();
          return;
        }
      }

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
      leftCurtainGeo.dispose();
      rightCurtainGeo.dispose();
      velvetMat.dispose();
      goldMat.dispose();
      renderer.dispose();
    };
  }, [onEnter]);

  // Curtain Open Handler
  const handleOpenCurtain = () => {
    if (isOpening) return;
    setIsOpening(true);
    sound.playCurtainOpen();
    sound.playStageFanfare();
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
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#060810] text-white select-none">
      {/* 3D WebGL Canvas */}
      <div
        ref={containerRef}
        onClick={handleOpenCurtain}
        className="absolute inset-0 z-0 cursor-pointer"
        title="Chạm vào rèm nhung hoặc bấm nút để mở màn đại lễ!"
      />

      {/* Royal Gold Spotlight Bloom Transition */}
      <div
        className={`absolute inset-0 z-40 bg-gradient-to-t from-[#FFE58F] via-white to-[#F3E5AB] pointer-events-none transition-opacity duration-1000 ease-out ${
          isOpening ? 'opacity-90' : 'opacity-0'
        }`}
      />

      {/* Top Controls Overlay */}
      <div className="absolute top-4 sm:top-6 inset-x-4 sm:inset-x-8 z-30 flex items-center justify-between pointer-events-auto">
        {/* Left: Audio Toggle */}
        <button
          onClick={toggleSound}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/75 hover:bg-slate-800/80 border border-[#D4AF37]/40 backdrop-blur-md text-xs text-[#F3E5AB] transition-all hover:scale-105 shadow-lg"
          title="Bật/Tắt âm thanh"
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-400" /> : <Volume2 className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />}
          <span className="font-sans font-medium">{isMuted ? 'Bật Âm Thanh' : 'Âm Thanh Bật'}</span>
        </button>

        {/* Right: Skip Intro Button */}
        <button
          onClick={handleSkip}
          className="group flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-900/75 hover:bg-slate-800/80 border border-[#D4AF37]/50 backdrop-blur-md text-xs text-[#F3E5AB] transition-all hover:scale-105 shadow-lg"
        >
          <span>Bỏ qua Intro</span>
          <FastForward className="w-3.5 h-3.5 text-[#D4AF37] group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Bottom Center Proclamation & Interactive CTA */}
      <div className="absolute inset-x-4 bottom-8 sm:bottom-12 z-20 flex flex-col items-center justify-center text-center pointer-events-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-[#D4AF37]/60 backdrop-blur-md text-xs text-[#FDE68A] shadow-xl mb-3">
          <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
          <span className="tracking-[0.25em] font-sans font-bold uppercase">
            SÂN KHẤU LỄ ĐƯỜNG // RÈM NHUNG HOÀNG GIA
          </span>
        </div>

        {/* Titles */}
        <div className="space-y-1 max-w-xl mx-auto drop-shadow-2xl">
          <h1 className="text-2xl sm:text-4xl font-serif-luxury font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FDE68A] to-[#D4AF37]">
            LỄ VINH DANH TÂN KỸ SƯ
          </h1>
          <p className="text-sm sm:text-base font-serif-luxury text-[#F3E5AB] font-bold">
            {GRADUATION_CONFIG.graduate.fullName} • Lớp <span className="text-white font-numeral font-bold">{GRADUATION_CONFIG.graduate.classCode}</span>
          </p>
          <p className="text-xs text-slate-300 font-sans">
            Khoa Công nghệ Thông tin • Trường Đại học Kinh doanh & Công nghệ Hà Nội (HUBT)
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-5">
          <button
            onClick={handleOpenCurtain}
            className="group relative inline-flex items-center gap-3 px-8 sm:px-12 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-[#C5A059] via-[#F3E5AB] to-[#D4AF37] text-slate-950 font-bold text-sm sm:text-base tracking-widest uppercase shadow-2xl shadow-amber-500/50 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/70"
          >
            <Sparkles className="w-4 h-4 text-slate-900 animate-bounce" />
            <span>🎭 MỞ MÀN ĐẠI LỄ</span>
            <ArrowRight className="w-4 h-4 text-slate-900 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <p className="text-[11px] text-amber-200/70 italic pt-2.5">
          Chạm trực tiếp vào rèm nhung hoặc bấm nút để mở màn sân khấu vinh danh
        </p>
      </div>
    </div>
  );
};
