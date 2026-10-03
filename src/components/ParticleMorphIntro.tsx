import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GRADUATION_CONFIG } from '../config';
import { sound } from '../utils/audioFx';
import { Sparkles, ArrowRight, Volume2, VolumeX, FastForward } from 'lucide-react';

interface ParticleMorphIntroProps {
  onEnter: () => void;
}

type MorphPhase = 'text' | 'cap' | 'exploding';

export const ParticleMorphIntro: React.FC<ParticleMorphIntroProps> = ({ onEnter }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<MorphPhase>('text');
  const [isMuted, setIsMuted] = useState(sound.getMuted());

  // Refs for animation
  const animFrameRef = useRef<number | null>(null);
  const phaseRef = useRef<MorphPhase>('text');
  const morphProgressRef = useRef(0);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    try {
      sound.playParticleMorph();
    } catch {
      // Audio autoplay policy
    }

    // 1. Three.js Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060913, 0.018);

    const width = window.innerWidth;
    const height = window.innerHeight;
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    camera.position.set(0, 0, 24);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x060913, 1);
    container.appendChild(renderer.domElement);

    // Mouse Parallax
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 2. Generate Target Formations
    const PARTICLE_COUNT = 3200;

    // Formation 0: Chaos Swarm (Vũ trụ ban đầu)
    const posChaos: THREE.Vector3[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const radius = 16 + Math.random() * 26;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      posChaos.push(
        new THREE.Vector3(
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.sin(phi) * Math.sin(theta),
          radius * Math.cos(phi)
        )
      );
    }

    // Formation 1: Text Target ("NGUYỄN ĐỨC LONG" & "PM27.07")
    const posText: THREE.Vector3[] = [];
    const textCanvas = document.createElement('canvas');
    textCanvas.width = 1000;
    textCanvas.height = 360;
    const tCtx = textCanvas.getContext('2d');
    if (tCtx) {
      tCtx.fillStyle = '#000000';
      tCtx.fillRect(0, 0, 1000, 360);

      tCtx.fillStyle = '#FFFFFF';
      tCtx.textAlign = 'center';

      // Graduate Name
      tCtx.font = 'bold 64px serif';
      tCtx.fillText(GRADUATION_CONFIG.graduate.fullName, 500, 140);

      // Degree & Class
      tCtx.font = 'bold 36px sans-serif';
      tCtx.fillText(`TÂN KỸ SƯ • LỚP ${GRADUATION_CONFIG.graduate.classCode}`, 500, 210);

      tCtx.font = '24px sans-serif';
      tCtx.fillText('KHOA CNTT • HUBT', 500, 265);

      const imgData = tCtx.getImageData(0, 0, 1000, 360).data;
      const sampledPoints: THREE.Vector3[] = [];

      // Sample bright white pixels
      for (let y = 0; y < 360; y += 4) {
        for (let x = 0; x < 1000; x += 4) {
          const index = (y * 1000 + x) * 4;
          if (imgData[index] > 128) {
            // Map 2D pixel to 3D coordinate space
            const posX = (x - 500) * 0.038;
            const posY = -(y - 180) * 0.038;
            const posZ = (Math.random() - 0.5) * 0.8;
            sampledPoints.push(new THREE.Vector3(posX, posY, posZ));
          }
        }
      }

      // Populate posText to PARTICLE_COUNT
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        if (i < sampledPoints.length) {
          posText.push(sampledPoints[i]);
        } else {
          // Wrap or add subtle aura around text
          const pt = sampledPoints[i % sampledPoints.length].clone();
          pt.x += (Math.random() - 0.5) * 1.2;
          pt.y += (Math.random() - 0.5) * 1.2;
          pt.z += (Math.random() - 0.5) * 2.0;
          posText.push(pt);
        }
      }
    }

    // Formation 2: 3D Graduation Cap (Mũ Cử Nhân 3D)
    const posCap: THREE.Vector3[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      if (i < 1300) {
        // Mortarboard Diamond Square Top Plate
        const u = (Math.random() - 0.5) * 9.5;
        const v = (Math.random() - 0.5) * 9.5;
        // Rotate by 45 degrees for diamond
        const rotX = (u - v) * 0.707;
        const rotZ = (u + v) * 0.707;
        posCap.push(new THREE.Vector3(rotX, 3.2 + (Math.random() - 0.5) * 0.25, rotZ));
      } else if (i < 2400) {
        // Skull Cap (Hemisphere / cylinder underneath)
        const rad = Math.random() * 3.4;
        const ang = Math.random() * Math.PI * 2;
        const h = Math.random() * 2.6;
        posCap.push(new THREE.Vector3(Math.cos(ang) * rad, 3.0 - h, Math.sin(ang) * rad));
      } else if (i < 2900) {
        // Tassel Cord hanging from center over edge
        const t = Math.random();
        const curveX = t * 5.4;
        const curveY = 3.3 - t * t * 3.8;
        const curveZ = t * 5.4;
        posCap.push(
          new THREE.Vector3(
            curveX + (Math.random() - 0.5) * 0.35,
            curveY + (Math.random() - 0.5) * 0.35,
            curveZ + (Math.random() - 0.5) * 0.35
          )
        );
      } else {
        // Golden Center Button & Orbiting Sparkle Halo
        const ang = Math.random() * Math.PI * 2;
        const r = 5.8 + Math.random() * 1.2;
        posCap.push(new THREE.Vector3(Math.cos(ang) * r, 1.8 + (Math.random() - 0.5) * 2, Math.sin(ang) * r));
      }
    }

    // 3. Current Live Particle Geometry & Colors
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const currentPoints: THREE.Vector3[] = [];
    const velocities: THREE.Vector3[] = [];

    const goldPalette = [
      new THREE.Color(0xd4af37), // Imperial Gold
      new THREE.Color(0xf3e5ab), // Champagne Gold
      new THREE.Color(0xffffff), // Pure White
      new THREE.Color(0xc5a059), // Rich Gold
      new THREE.Color(0xfbbf24), // Warm Amber
    ];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = posChaos[i].clone();
      currentPoints.push(p);
      positions[i * 3] = p.x;
      positions[i * 3 + 1] = p.y;
      positions[i * 3 + 2] = p.z;

      const col = goldPalette[Math.floor(Math.random() * goldPalette.length)];
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;

      // Random explosion velocity
      const vel = new THREE.Vector3((Math.random() - 0.5) * 1.8, (Math.random() - 0.5) * 1.8, (Math.random() - 0.5) * 1.8);
      vel.normalize().multiplyScalar(0.4 + Math.random() * 0.8);
      velocities.push(vel);
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle Texture
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 32;
    pCanvas.height = 32;
    const pCtx = pCanvas.getContext('2d');
    if (pCtx) {
      const grad = pCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(255,255,255,1)');
      grad.addColorStop(0.3, 'rgba(243,229,171,0.85)');
      grad.addColorStop(1, 'rgba(212,175,55,0)');
      pCtx.fillStyle = grad;
      pCtx.fillRect(0, 0, 32, 32);
    }
    const particleTex = new THREE.CanvasTexture(pCanvas);

    const material = new THREE.PointsMaterial({
      size: 0.32,
      map: particleTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      depthWrite: false,
    });

    const particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);

    // 4. Animation Render Loop
    let clock = new THREE.Clock();
    let elapsed = 0;

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      elapsed += delta;

      // Smooth mouse parallax
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;
      camera.position.x = mouse.x * 2.0;
      camera.position.y = mouse.y * 1.5;
      camera.lookAt(0, 0, 0);

      // Phase Progress Control
      if (elapsed > 2.8 && phaseRef.current === 'text') {
        setPhase('cap');
        try {
          sound.playParticleMorph();
        } catch {
          // Audio
        }
      }

      const pArr = geometry.attributes.position.array as Float32Array;

      if (phaseRef.current === 'text') {
        // Swarm into Text Shape
        morphProgressRef.current = Math.min(morphProgressRef.current + delta * 0.7, 1.0);
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const target = posText[i];
          const curr = currentPoints[i];
          // Smooth spring-like lerp with gentle wave
          curr.x += (target.x - curr.x) * 0.08;
          curr.y += (target.y - curr.y) * 0.08 + Math.sin(elapsed * 3 + i) * 0.005;
          curr.z += (target.z - curr.z) * 0.08;

          pArr[i * 3] = curr.x;
          pArr[i * 3 + 1] = curr.y;
          pArr[i * 3 + 2] = curr.z;
        }
      } else if (phaseRef.current === 'cap') {
        // Morph from Text into 3D Graduation Cap
        const capRotationAngle = elapsed * 0.45;
        const cosA = Math.cos(capRotationAngle);
        const sinA = Math.sin(capRotationAngle);

        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const rawTarget = posCap[i];
          // Rotate target around Y axis in 3D
          const rotX = rawTarget.x * cosA - rawTarget.z * sinA;
          const rotZ = rawTarget.x * sinA + rawTarget.z * cosA;
          const rotY = rawTarget.y - 1.2;

          const curr = currentPoints[i];
          curr.x += (rotX - curr.x) * 0.06;
          curr.y += (rotY - curr.y) * 0.06 + Math.sin(elapsed * 2 + i * 0.01) * 0.008;
          curr.z += (rotZ - curr.z) * 0.06;

          pArr[i * 3] = curr.x;
          pArr[i * 3 + 1] = curr.y;
          pArr[i * 3 + 2] = curr.z;
        }
      } else if (phaseRef.current === 'exploding') {
        // Explode particles outward radially
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const curr = currentPoints[i];
          const vel = velocities[i];
          curr.x += vel.x * (delta * 38);
          curr.y += vel.y * (delta * 38);
          curr.z += vel.z * (delta * 38);

          pArr[i * 3] = curr.x;
          pArr[i * 3 + 1] = curr.y;
          pArr[i * 3 + 2] = curr.z;
        }
        material.opacity = Math.max(material.opacity - delta * 1.5, 0);
      }

      geometry.attributes.position.needsUpdate = true;
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
      geometry.dispose();
      material.dispose();
      particleTex.dispose();
      renderer.dispose();
    };
  }, []);

  const handleEnterCeremony = () => {
    if (phase === 'exploding') return;
    setPhase('exploding');
    sound.playParticleExplosion();

    // Transition delay
    setTimeout(() => {
      onEnter();
    }, 750);
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

      {/* Golden Flash Light Transition when exploding */}
      <div
        className={`absolute inset-0 z-40 bg-gradient-to-tr from-amber-100 via-white to-amber-200 pointer-events-none transition-opacity duration-700 ease-out ${
          phase === 'exploding' ? 'opacity-95' : 'opacity-0'
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

      {/* Bottom Center Morphing HUD Status */}
      <div className="absolute inset-x-4 bottom-10 sm:bottom-16 z-20 flex flex-col items-center justify-center text-center pointer-events-auto">
        {/* Phase Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-[#D4AF37]/50 backdrop-blur-md text-xs text-[#FDE68A] shadow-lg mb-3">
          <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
          <span className="tracking-[0.25em] font-sans font-semibold uppercase">
            {phase === 'text' ? '✨ VŨ ĐIỆU HẠT // TỤ TÊN TÂN KHOA' : '🎓 BIẾN HÌNH // MŨ KỸ SƯ 3D XOAY'}
          </span>
        </div>

        {/* Dynamic Titles */}
        <div className="space-y-1 max-w-xl mx-auto drop-shadow-xl">
          <h1 className="text-2xl sm:text-4xl font-serif-luxury font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FDE68A] to-[#D4AF37]">
            {phase === 'text' ? 'KẾT TINH TÊN TÂN KHOA' : 'VINH DANH TÂN KỸ SƯ K27'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-sans">
            Khoa Công nghệ Thông tin • Trường Đại học Kinh doanh & Công nghệ Hà Nội (HUBT)
          </p>
        </div>

        {/* CTA Enter Button */}
        <div className="pt-6">
          <button
            onClick={handleEnterCeremony}
            className="group relative inline-flex items-center gap-3 px-8 sm:px-12 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-[#C5A059] via-[#F3E5AB] to-[#D4AF37] text-slate-950 font-bold text-sm sm:text-base tracking-widest uppercase shadow-2xl shadow-amber-500/40 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/60"
          >
            <Sparkles className="w-4 h-4 text-slate-900 animate-bounce" />
            <span>BƯỚC VÀO BUỔI LỄ</span>
            <ArrowRight className="w-4 h-4 text-slate-900 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <p className="text-[11px] text-amber-200/60 italic pt-2.5">
          {phase === 'text'
            ? 'Các hạt đang xoáy tụ thành họ tên tân khoa...'
            : 'Hàng ngàn hạt ánh sáng đang kết tinh thành Mũ Cử nhân 3D xoay'}
        </p>
      </div>
    </div>
  );
};
