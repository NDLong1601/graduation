import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GRADUATION_CONFIG } from '../config';
import { sound } from '../utils/audioFx';
import { Sparkles, ArrowRight, Volume2, VolumeX, FastForward } from 'lucide-react';

interface GoldenWarpIntroProps {
  onEnter: () => void;
}

export const GoldenWarpIntro: React.FC<GoldenWarpIntroProps> = ({ onEnter }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<'warping' | 'arrival' | 'exit'>('warping');
  const [warpProgress, setWarpProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(sound.getMuted());

  // Refs for Three.js animation
  const animFrameRef = useRef<number | null>(null);
  const speedRef = useRef(1.2);
  const phaseRef = useRef<'warping' | 'arrival' | 'exit'>('warping');

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Trigger initial warp audio sound
    try {
      sound.playWarpSpeed();
    } catch {
      // Audio autoplay policy
    }

    // 1. Three.js Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060913, 0.0018);

    const width = window.innerWidth;
    const height = window.innerHeight;
    const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 2000);
    camera.position.set(0, 0, 950);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x060913, 1);
    container.appendChild(renderer.domElement);

    // Mouse tracking for subtle flight banking
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 2. Starfield & Tunnel Particles
    const starCount = 3800;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    const goldPalette = [
      new THREE.Color(0xd4af37), // Imperial Gold
      new THREE.Color(0xf3e5ab), // Champagne Gold
      new THREE.Color(0xffffff), // Radiant White
      new THREE.Color(0xc5a059), // Antique Gold
      new THREE.Color(0x38bdf8), // Soft Cyber Cyan hint
    ];

    for (let i = 0; i < starCount; i++) {
      // Cylindrical tunnel distribution
      const radius = 18 + Math.random() * 65;
      const angle = Math.random() * Math.PI * 2;
      const z = Math.random() * 1200 - 100;

      starPositions[i * 3] = Math.cos(angle) * radius;
      starPositions[i * 3 + 1] = Math.sin(angle) * radius;
      starPositions[i * 3 + 2] = z;

      const col = goldPalette[Math.floor(Math.random() * goldPalette.length)];
      starColors[i * 3] = col.r;
      starColors[i * 3 + 1] = col.g;
      starColors[i * 3 + 2] = col.b;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    // Particle texture
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(255,255,255,1)');
      grad.addColorStop(0.3, 'rgba(243,229,171,0.8)');
      grad.addColorStop(1, 'rgba(212,175,55,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 32, 32);
    }
    const particleTex = new THREE.CanvasTexture(canvas);

    const starMat = new THREE.PointsMaterial({
      size: 4.5,
      map: particleTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      depthWrite: false,
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // 3. Warp Streak Lines (Tốc độ ánh sáng kéo vệt)
    const lineCount = 280;
    const linePositions = new Float32Array(lineCount * 6);
    const lineColors = new Float32Array(lineCount * 6);

    for (let i = 0; i < lineCount; i++) {
      const radius = 16 + Math.random() * 55;
      const angle = Math.random() * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const z = Math.random() * 1100;

      // Start point
      linePositions[i * 6] = x;
      linePositions[i * 6 + 1] = y;
      linePositions[i * 6 + 2] = z;

      // End point (trailing tail)
      linePositions[i * 6 + 3] = x;
      linePositions[i * 6 + 4] = y;
      linePositions[i * 6 + 5] = z + 35;

      const col = Math.random() < 0.7 ? new THREE.Color(0xd4af37) : new THREE.Color(0xffffff);
      lineColors[i * 6] = col.r;
      lineColors[i * 6 + 1] = col.g;
      lineColors[i * 6 + 2] = col.b;
      lineColors[i * 6 + 3] = col.r * 0.2;
      lineColors[i * 6 + 4] = col.g * 0.2;
      lineColors[i * 6 + 5] = col.b * 0.2;
    }

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeo.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

    const lineMat = new THREE.LineBasicMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      opacity: 0.8,
    });
    const warpLines = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(warpLines);

    // 4. Central Golden Nebula Core (Đích đến ở cuối hầm)
    const coreGeo = new THREE.SphereGeometry(14, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xfde047,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.position.set(0, 0, -40);
    scene.add(coreMesh);

    // Outer Halo Rings
    const haloGeo = new THREE.RingGeometry(18, 45, 48);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xd4af37,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    haloMesh.position.set(0, 0, -42);
    scene.add(haloMesh);

    // 5. Binary IT Data Floating Glyphs (Software Engineering Flavor)
    const binaryGroup = new THREE.Group();
    const binaryCanvas = document.createElement('canvas');
    binaryCanvas.width = 128;
    binaryCanvas.height = 128;
    const bCtx = binaryCanvas.getContext('2d');
    if (bCtx) {
      bCtx.fillStyle = '#D4AF37';
      bCtx.font = 'bold 70px monospace';
      bCtx.textAlign = 'center';
      bCtx.textBaseline = 'middle';
      bCtx.fillText('01', 64, 64);
    }
    const binaryTex = new THREE.CanvasTexture(binaryCanvas);
    const binaryMat = new THREE.SpriteMaterial({
      map: binaryTex,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    });

    for (let i = 0; i < 40; i++) {
      const sprite = new THREE.Sprite(binaryMat);
      const rad = 25 + Math.random() * 40;
      const ang = Math.random() * Math.PI * 2;
      sprite.position.set(Math.cos(ang) * rad, Math.sin(ang) * rad, Math.random() * 900);
      sprite.scale.set(10, 10, 1);
      binaryGroup.add(sprite);
    }
    scene.add(binaryGroup);

    // 6. Animation Render Loop
    let clock = new THREE.Clock();
    let elapsedWarpTime = 0;

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      elapsedWarpTime += delta;

      // Smooth mouse banking
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;
      camera.rotation.z = -mouse.x * 0.25;
      camera.rotation.y = -mouse.x * 0.15;
      camera.rotation.x = mouse.y * 0.15;

      // Handle Acceleration & Progression
      if (phaseRef.current === 'warping') {
        // Accelerate speed from 1.5 up to 8.5
        speedRef.current = Math.min(speedRef.current + delta * 2.8, 8.5);
        const progress = Math.min((elapsedWarpTime / 3.2) * 100, 100);
        setWarpProgress(progress);

        if (elapsedWarpTime >= 3.2) {
          setPhase('arrival');
        }
      } else if (phaseRef.current === 'arrival') {
        // Gentle cruising towards core
        speedRef.current = Math.max(speedRef.current - delta * 4.0, 1.8);
      } else if (phaseRef.current === 'exit') {
        // Hyper jump through core
        speedRef.current += delta * 25.0;
      }

      const currentSpeed = speedRef.current;

      // Move camera forward towards origin
      camera.position.z -= currentSpeed * 4.2;
      if (camera.position.z < 25 && phaseRef.current !== 'exit') {
        camera.position.z = 25; // Hold at arrival position
      }

      // Animate Stars passing by
      const posAttr = starGeo.attributes.position as THREE.BufferAttribute;
      const positions = posAttr.array as Float32Array;
      for (let i = 0; i < starCount; i++) {
        // If star falls behind camera, wrap forward
        if (positions[i * 3 + 2] > camera.position.z + 50) {
          positions[i * 3 + 2] -= 1100;
        }
      }
      posAttr.needsUpdate = true;

      // Animate Streak Lines
      const linePosAttr = lineGeo.attributes.position as THREE.BufferAttribute;
      const lPos = linePosAttr.array as Float32Array;
      for (let i = 0; i < lineCount; i++) {
        lPos[i * 6 + 2] += currentSpeed * 2.0;
        lPos[i * 6 + 5] = lPos[i * 6 + 2] + currentSpeed * 6.5; // Elongate tail by speed
        if (lPos[i * 6 + 2] > camera.position.z + 80) {
          lPos[i * 6 + 2] -= 1100;
          lPos[i * 6 + 5] = lPos[i * 6 + 2] + currentSpeed * 6.5;
        }
      }
      linePosAttr.needsUpdate = true;

      // Animate Binary Glyphs
      binaryGroup.children.forEach((child) => {
        if (child.position.z > camera.position.z + 50) {
          child.position.z -= 1000;
        }
      });

      // Pulse Core & Halo
      haloMesh.rotation.z += 0.008;
      const coreScale = 1.0 + Math.sin(elapsedWarpTime * 3.5) * 0.12;
      coreMesh.scale.set(coreScale, coreScale, coreScale);

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
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
      starGeo.dispose();
      starMat.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      particleTex.dispose();
      renderer.dispose();
    };
  }, []);

  const handleEnterCeremony = () => {
    if (phase === 'exit') return;
    setPhase('exit');
    sound.playSupernova();

    // Hyperspace leap into white-gold flash, then call onEnter
    setTimeout(() => {
      onEnter();
    }, 850);
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

      {/* Supernova Flash Transition Layer */}
      <div
        className={`absolute inset-0 z-40 bg-gradient-to-tr from-amber-100 via-white to-amber-200 pointer-events-none transition-opacity duration-700 ease-out ${
          phase === 'exit' ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Top Controls Overlay */}
      <div className="absolute top-4 sm:top-6 inset-x-4 sm:inset-x-8 z-30 flex items-center justify-between pointer-events-auto">
        {/* Left: Audio Toggle */}
        <button
          onClick={toggleSound}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/60 hover:bg-slate-800/80 border border-[#D4AF37]/40 backdrop-blur-md text-xs text-[#F3E5AB] transition-all hover:scale-105 shadow-lg"
          title="Bật/Tắt âm thanh"
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-400" /> : <Volume2 className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />}
          <span className="font-sans font-medium">{isMuted ? 'Bật Âm Thanh' : 'Âm Thanh Bật'}</span>
        </button>

        {/* Right: Skip Intro Button */}
        <button
          onClick={handleSkip}
          className="group flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-900/60 hover:bg-slate-800/80 border border-[#D4AF37]/40 backdrop-blur-md text-xs text-[#F3E5AB] transition-all hover:scale-105 shadow-lg"
        >
          <span>Bỏ qua Intro</span>
          <FastForward className="w-3.5 h-3.5 text-[#D4AF37] group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Center Cinematic HUD Content */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4 text-center pointer-events-none">
        {phase === 'warping' && (
          <div className="space-y-4 max-w-lg mx-auto animate-fadeIn">
            {/* Tech Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/70 border border-[#D4AF37]/50 backdrop-blur-md text-xs text-[#F3E5AB]">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
              <span className="tracking-[0.25em] font-sans font-semibold uppercase">
                HYPERSPACE // K27 WARP
              </span>
            </div>

            {/* Main Warping Title */}
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-4xl font-serif-luxury font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-[#F3E5AB] to-[#D4AF37] drop-shadow-lg">
                KHỞI ĐỘNG HÀNH TRÌNH TÂN KỸ SƯ
              </h1>
              <p className="text-xs sm:text-sm text-amber-200/80 font-sans tracking-wide">
                Khoa Công nghệ Thông tin • Trường ĐH Kinh doanh & Công nghệ Hà Nội
              </p>
            </div>

            {/* Warp Speed Progress Bar */}
            <div className="w-64 sm:w-80 mx-auto space-y-1.5 pt-2">
              <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden border border-[#D4AF37]/30">
                <div
                  className="h-full bg-gradient-to-r from-[#8A6D3B] via-[#D4AF37] to-white rounded-full transition-all duration-100 ease-out"
                  style={{ width: `${warpProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-amber-300/70 font-mono">
                <span>WARP VELOCITY: {(speedRef.current * 1.15).toFixed(1)}c</span>
                <span>{Math.round(warpProgress)}%</span>
              </div>
            </div>
          </div>
        )}

        {phase === 'arrival' && (
          <div className="space-y-6 max-w-xl mx-auto animate-scaleUp pointer-events-auto">
            {/* Floating Golden Emblem */}
            <div className="relative inline-flex items-center justify-center p-5 rounded-full bg-gradient-to-br from-[#800F15] via-[#A81D24] to-[#60080D] border-4 border-[#D4AF37] shadow-2xl shadow-amber-500/30">
              <span className="text-4xl sm:text-5xl filter drop-shadow">🎓</span>
              <div className="absolute -inset-3 rounded-full border border-dashed border-[#F3E5AB]/60 animate-spin-slow pointer-events-none" />
            </div>

            {/* Ceremony Greeting */}
            <div className="space-y-2">
              <span className="text-xs font-sans font-bold tracking-[0.3em] text-[#D4AF37] uppercase">
                TRÂN TRỌNG KÍNH MỜI QUÝ KHÁCH
              </span>
              <h1 className="text-3xl sm:text-5xl font-serif-luxury font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-[#FDE68A] to-[#D4AF37] drop-shadow-xl">
                LỄ TỐT NGHIỆP TÂN KỸ SƯ
              </h1>
              <div className="py-1">
                <h2 className="text-3xl sm:text-4xl font-serif-luxury font-extrabold text-[#F3E5AB] tracking-wide filter drop-shadow">
                  {GRADUATION_CONFIG.graduate.fullName}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">
                  Chuyên ngành: <span className="text-[#D4AF37] font-semibold">{GRADUATION_CONFIG.graduate.major}</span> • Lớp{' '}
                  <span className="font-numeral font-bold text-[#FDE68A]">{GRADUATION_CONFIG.graduate.classCode}</span>
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {GRADUATION_CONFIG.graduate.faculty} • {GRADUATION_CONFIG.graduate.university}
                </p>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="pt-2">
              <button
                onClick={handleEnterCeremony}
                className="group relative inline-flex items-center gap-3 px-8 sm:px-10 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-[#C5A059] via-[#F3E5AB] to-[#D4AF37] text-slate-950 font-bold text-sm sm:text-base tracking-wider uppercase shadow-2xl shadow-amber-500/40 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/50"
              >
                <Sparkles className="w-4 h-4 text-slate-900 animate-bounce" />
                <span>BƯỚC VÀO BUỔI LỄ</span>
                <ArrowRight className="w-4 h-4 text-slate-900 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <p className="text-[11px] text-slate-400 italic">
              Nhấn nút hoặc chạm vào màn hình để bắt đầu trải nghiệm
            </p>
          </div>
        )}
      </div>

      {/* Bottom Hint */}
      <div className="absolute bottom-4 inset-x-4 z-20 flex justify-center text-center pointer-events-none">
        <span className="text-[11px] font-sans text-amber-200/50 tracking-wider">
          HUBT GRADUATION CEREMONY // PM27.07 • KHÓA 27 (2022 - 2026)
        </span>
      </div>
    </div>
  );
};
