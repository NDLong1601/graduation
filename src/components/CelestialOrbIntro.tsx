import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GRADUATION_CONFIG } from '../config';
import { sound } from '../utils/audioFx';
import { Sparkles, ArrowRight, Volume2, VolumeX, FastForward } from 'lucide-react';

interface CelestialOrbIntroProps {
  onEnter: () => void;
}

export const CelestialOrbIntro: React.FC<CelestialOrbIntroProps> = ({ onEnter }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isShattering, setIsShattering] = useState(false);
  const [isMuted, setIsMuted] = useState(sound.getMuted());

  // Animation Refs
  const animFrameRef = useRef<number | null>(null);
  const isShatteringRef = useRef(false);
  const shatterProgressRef = useRef(0);

  useEffect(() => {
    isShatteringRef.current = isShattering;
  }, [isShattering]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    try {
      sound.playCrystalResonance();
    } catch {
      // Audio
    }

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050914, 0.018);

    const width = window.innerWidth;
    const height = window.innerHeight;
    const camera = new THREE.PerspectiveCamera(52, width / height, 0.1, 1000);
    camera.position.set(0, 1.2, 13.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x050914, 1);
    container.appendChild(renderer.domElement);

    // Mouse Tracking for Interactive 3D Ball Rotation
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 2. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0x0f172a, 1.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(6, 12, 8);
    scene.add(keyLight);

    const innerLight = new THREE.PointLight(0xfde047, 4.0, 15);
    innerLight.position.set(0, 0, 0);
    scene.add(innerLight);

    const rimLight = new THREE.PointLight(0x38bdf8, 2.0, 20);
    rimLight.position.set(-6, -4, -4);
    scene.add(rimLight);

    // 3. Main Rotating Orb Group
    const orbGroup = new THREE.Group();
    scene.add(orbGroup);

    // Materials
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.18,
      metalness: 0.95,
      emissive: 0x9a7b38,
      emissiveIntensity: 0.25,
    });

    const capMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.45,
      metalness: 0.2,
    });

    // 4. Glass Sphere Shell (Quả Cầu Pha Lê)
    const glassGeo = new THREE.SphereGeometry(3.6, 64, 64);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.94,
      roughness: 0.06,
      ior: 1.48,
      thickness: 1.4,
      transparent: true,
      opacity: 0.85,
    });
    const glassSphere = new THREE.Mesh(glassGeo, glassMat);
    orbGroup.add(glassSphere);

    // Fresnel Rim Glow inside Glass
    const glowGeo = new THREE.SphereGeometry(3.55, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0xfde047,
      transparent: true,
      opacity: 0.18,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
    });
    const glowSphere = new THREE.Mesh(glowGeo, glowMat);
    orbGroup.add(glowSphere);

    // 5. Miniature Universe Inside the Orb
    const innerUniverse = new THREE.Group();
    orbGroup.add(innerUniverse);

    // Miniature Graduation Cap 3D
    const miniCap = new THREE.Group();
    const capPlate = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.08, 2.4), capMat);
    capPlate.rotation.y = Math.PI / 4;
    capPlate.position.y = 0.55;
    miniCap.add(capPlate);

    // Gold trim on plate edge
    const edges = new THREE.EdgesGeometry(new THREE.BoxGeometry(2.4, 0.08, 2.4));
    const wire = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xd4af37 }));
    capPlate.add(wire);

    const skull = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.65, 0.65, 24), capMat);
    skull.position.y = 0.22;
    miniCap.add(skull);

    const tassel = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.12, 0.8, 12), goldMat);
    tassel.position.set(1.2, 0.1, 1.2);
    miniCap.add(tassel);

    innerUniverse.add(miniCap);

    // Miniature Rolled Diploma with Blue Ribbon
    const scrollGeo = new THREE.CylinderGeometry(0.18, 0.18, 1.8, 24);
    const scrollMat = new THREE.MeshStandardMaterial({ color: 0xfcfbf8, roughness: 0.4 });
    const scrollMesh = new THREE.Mesh(scrollGeo, scrollMat);
    scrollMesh.rotation.z = Math.PI / 3;
    scrollMesh.position.set(0, -0.6, 0.4);
    innerUniverse.add(scrollMesh);

    const ribGeo = new THREE.CylinderGeometry(0.19, 0.19, 0.25, 24);
    const ribMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, metalness: 0.3 });
    const ribMesh = new THREE.Mesh(ribGeo, ribMat);
    ribMesh.rotation.z = Math.PI / 3;
    ribMesh.position.set(0, -0.6, 0.4);
    innerUniverse.add(ribMesh);

    // Gyroscope Celestial Orbital Rings (Hai vòng quỹ đạo thiên thể quay lồng)
    const ring1Geo = new THREE.TorusGeometry(2.5, 0.035, 16, 64);
    const ring1 = new THREE.Mesh(ring1Geo, goldMat);
    innerUniverse.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(2.7, 0.035, 16, 64);
    const ring2 = new THREE.Mesh(ring2Geo, goldMat);
    ring2.rotation.x = Math.PI / 2.5;
    innerUniverse.add(ring2);

    // Micro Stars Swarm trapped inside Orb
    const innerStarCount = 380;
    const innerStarGeo = new THREE.BufferGeometry();
    const innerStarPos = new Float32Array(innerStarCount * 3);
    for (let i = 0; i < innerStarCount * 3; i += 3) {
      const r = Math.random() * 3.0;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(Math.random() * 2 - 1);
      innerStarPos[i] = r * Math.sin(ph) * Math.cos(th);
      innerStarPos[i + 1] = r * Math.sin(ph) * Math.sin(th);
      innerStarPos[i + 2] = r * Math.cos(ph);
    }
    innerStarGeo.setAttribute('position', new THREE.BufferAttribute(innerStarPos, 3));
    const innerStarMat = new THREE.PointsMaterial({
      color: 0xfde047,
      size: 0.12,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });
    const innerStars = new THREE.Points(innerStarGeo, innerStarMat);
    innerUniverse.add(innerStars);

    // 6. Levitating Magnetic Gold Ring Pedestal under Orb
    const pedestalGeo = new THREE.TorusGeometry(4.0, 0.12, 16, 64);
    const pedestal = new THREE.Mesh(pedestalGeo, goldMat);
    pedestal.rotation.x = Math.PI / 2;
    pedestal.position.y = -3.2;
    scene.add(pedestal);

    // Outer Space Twinkling Stars
    const spaceStarCount = 800;
    const spaceStarGeo = new THREE.BufferGeometry();
    const spaceStarPos = new Float32Array(spaceStarCount * 3);
    for (let i = 0; i < spaceStarCount * 3; i += 3) {
      spaceStarPos[i] = (Math.random() - 0.5) * 45;
      spaceStarPos[i + 1] = (Math.random() - 0.5) * 35;
      spaceStarPos[i + 2] = (Math.random() - 0.5) * 35;
    }
    spaceStarGeo.setAttribute('position', new THREE.BufferAttribute(spaceStarPos, 3));
    const spaceStarMat = new THREE.PointsMaterial({
      color: 0xd4af37,
      size: 0.15,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const spaceStars = new THREE.Points(spaceStarGeo, spaceStarMat);
    scene.add(spaceStars);

    // 7. Animation Render Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Smooth Mouse Parallax Banking & Sphere Rotation
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      if (!isShatteringRef.current) {
        orbGroup.rotation.y = elapsed * 0.25 + mouse.x * 0.8;
        orbGroup.rotation.x = mouse.y * 0.6;
        orbGroup.position.y = Math.sin(elapsed * 1.8) * 0.15;

        // Inner celestial ring counter-rotations
        ring1.rotation.y = elapsed * 0.8;
        ring1.rotation.z = elapsed * 0.4;
        ring2.rotation.x = elapsed * 0.6;
        ring2.rotation.y = -elapsed * 0.5;

        // Mini cap gentle bob
        miniCap.rotation.y = elapsed * 0.4;

        // Inner stars rotation
        innerStars.rotation.y = elapsed * 0.15;
      } else {
        // Shatter sequence: Sphere expands and dissolves
        shatterProgressRef.current = Math.min(shatterProgressRef.current + delta * 1.4, 1.0);
        const p = shatterProgressRef.current;

        const expandScale = 1.0 + p * 3.5;
        orbGroup.scale.set(expandScale, expandScale, expandScale);
        glassMat.opacity = Math.max((1 - p) * 0.85, 0);
        innerLight.intensity = 4.0 + p * 20.0;

        if (p >= 0.98) {
          onEnter();
          return;
        }
      }

      pedestal.rotation.z = elapsed * 0.2;

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
      glassGeo.dispose();
      glassMat.dispose();
      renderer.dispose();
    };
  }, [onEnter]);

  const handleShatter = () => {
    if (isShattering) return;
    setIsShattering(true);
    sound.playCrystalShatter();
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
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#050914] text-white select-none">
      {/* 3D WebGL Canvas */}
      <div
        ref={containerRef}
        onClick={handleShatter}
        className="absolute inset-0 z-0 cursor-pointer"
        title="Chạm vào quả cầu pha lê để mở cánh cổng tương lai"
      />

      {/* Crystal Light Bloom Transition Layer */}
      <div
        className={`absolute inset-0 z-40 bg-gradient-to-tr from-amber-100 via-white to-amber-200 pointer-events-none transition-opacity duration-700 ease-out ${
          isShattering ? 'opacity-95' : 'opacity-0'
        }`}
      />

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

      {/* Bottom Center Proclamation & Interactive CTA */}
      <div className="absolute inset-x-4 bottom-10 sm:bottom-14 z-20 flex flex-col items-center justify-center text-center pointer-events-auto">
        {/* Phase Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-[#D4AF37]/60 backdrop-blur-md text-xs text-[#FDE68A] shadow-xl mb-3">
          <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
          <span className="tracking-[0.25em] font-sans font-bold uppercase">
            VŨ TRỤ THU NHỎ // QUẢ CẦU KHÚC XẠ 3D
          </span>
        </div>

        {/* Titles */}
        <div className="space-y-1 max-w-xl mx-auto drop-shadow-2xl">
          <h1 className="text-2xl sm:text-4xl font-serif-luxury font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FDE68A] to-[#D4AF37]">
            KHAI MỞ TƯƠNG LAI TÂN KỸ SƯ
          </h1>
          <p className="text-sm sm:text-base font-serif-luxury text-[#F3E5AB] font-bold">
            {GRADUATION_CONFIG.graduate.fullName} • Lớp <span className="text-white font-numeral font-bold">{GRADUATION_CONFIG.graduate.classCode}</span>
          </p>
          <p className="text-xs text-slate-300 font-sans">
            Khoa Công nghệ Thông tin • Trường Đại học Kinh doanh & Công nghệ Hà Nội (HUBT)
          </p>
        </div>

        {/* CTA Button */}
        <div className="pt-6">
          <button
            onClick={handleShatter}
            className="group relative inline-flex items-center gap-3 px-8 sm:px-12 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-[#C5A059] via-[#F3E5AB] to-[#D4AF37] text-slate-950 font-bold text-sm sm:text-base tracking-widest uppercase shadow-2xl shadow-amber-500/50 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/70"
          >
            <Sparkles className="w-4 h-4 text-slate-900 animate-bounce" />
            <span>CHẠM ĐỂ MỞ CÁNH CỔNG</span>
            <ArrowRight className="w-4 h-4 text-slate-900 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <p className="text-[11px] text-amber-200/60 italic pt-2.5">
          Chạm trực tiếp vào quả cầu hoặc bấm nút để khai mở ánh sáng tương lai
        </p>
      </div>
    </div>
  );
};
