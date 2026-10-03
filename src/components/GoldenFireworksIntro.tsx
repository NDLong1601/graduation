import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GRADUATION_CONFIG } from '../config';
import { sound } from '../utils/audioFx';
import { Sparkles, ArrowRight, Volume2, VolumeX, FastForward, Flame } from 'lucide-react';

interface GoldenFireworksIntroProps {
  onEnter: () => void;
}

interface FireworkRocket {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  targetY: number;
  color: THREE.Color;
  type: 'peony' | 'willow' | 'ring' | 'crown';
  mesh: THREE.Points;
  trailGeo: THREE.BufferGeometry;
  alive: boolean;
}

interface SparkParticle {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  color: THREE.Color;
  size: number;
  alpha: number;
  decay: number;
  drag: number;
  gravity: number;
}

interface SparkExplosion {
  particles: SparkParticle[];
  geometry: THREE.BufferGeometry;
  material: THREE.PointsMaterial;
  mesh: THREE.Points;
  alive: boolean;
}

export const GoldenFireworksIntro: React.FC<GoldenFireworksIntroProps> = ({ onEnter }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFinale, setIsFinale] = useState(false);
  const [isMuted, setIsMuted] = useState(sound.getMuted());
  const [fireworkCount, setFireworkCount] = useState(0);

  const animFrameRef = useRef<number | null>(null);
  const isFinaleRef = useRef(false);
  const finaleTimeRef = useRef(0);

  // Store launch function ref for interactive clicks
  const launchRocketRef = useRef<((targetPos?: THREE.Vector3, isSuper?: boolean) => void) | null>(null);

  useEffect(() => {
    isFinaleRef.current = isFinale;
  }, [isFinale]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Initial audio welcome launch
    try {
      sound.playFireworkLaunch();
    } catch {
      // Audio
    }

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030712, 0.015);

    const width = window.innerWidth;
    const height = window.innerHeight;
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    camera.position.set(0, 4, 18);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x030712, 1);
    container.appendChild(renderer.domElement);

    // Dynamic 3D sky mouse tracking (look-around effect)
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0x090d16, 2.0);
    scene.add(ambientLight);

    const venueGlow = new THREE.PointLight(0xd4af37, 2.0, 40);
    venueGlow.position.set(0, -6, 0);
    scene.add(venueGlow);

    // 3. Ground Horizon Grid & Silhouette
    const groundGeo = new THREE.PlaneGeometry(160, 160, 32, 32);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x060b18,
      roughness: 0.8,
      metalness: 0.3,
      wireframe: true,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -6;
    scene.add(ground);

    // Distant venue silhouette pillars
    const pillarMat = new THREE.MeshBasicMaterial({ color: 0x0a1128, transparent: true, opacity: 0.7 });
    for (let i = -7; i <= 7; i++) {
      const pGeo = new THREE.BoxGeometry(0.8, 3 + Math.abs(i) * 0.4, 0.8);
      const pillar = new THREE.Mesh(pGeo, pillarMat);
      pillar.position.set(i * 4, -4.5 + (3 + Math.abs(i) * 0.4) / 2, -18);
      scene.add(pillar);
    }

    // 4. Background Starfield
    const starCount = 900;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPos[i] = (Math.random() - 0.5) * 120;
      starPos[i + 1] = Math.random() * 60 - 5;
      starPos[i + 2] = (Math.random() - 0.5) * 80 - 15;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xfef08a,
      size: 0.16,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // 5. Firework Physics Containers
    const rockets: FireworkRocket[] = [];
    const explosions: SparkExplosion[] = [];

    // Color palettes for celebration
    const palette = [
      new THREE.Color(0xffd700), // Pure Gold
      new THREE.Color(0xfef08a), // Champagne Light
      new THREE.Color(0xf59e0b), // Deep Amber
      new THREE.Color(0xffffff), // Diamond Silver
      new THREE.Color(0xf43f5e), // Festive Crimson Rose
      new THREE.Color(0x38bdf8), // Celestial Sky Blue
    ];

    // Detonation Generator
    const createExplosion = (pos: THREE.Vector3, type: FireworkRocket['type'], baseColor: THREE.Color, isSuper: boolean = false) => {
      sound.playFireworkBurst();
      setFireworkCount((prev) => prev + 1);

      const particleCount = isSuper ? 360 : type === 'willow' ? 240 : 180;
      const particles: SparkParticle[] = [];

      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount; i++) {
        let v: THREE.Vector3;
        let color = baseColor.clone();

        if (type === 'ring') {
          // Ring planar expansion
          const angle = (i / particleCount) * Math.PI * 2;
          const speed = 4.5 + Math.random() * 1.5;
          v = new THREE.Vector3(Math.cos(angle) * speed, Math.sin(angle) * speed, (Math.random() - 0.5) * 1.2);
        } else if (type === 'willow') {
          // Willow drooping waterfall
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(Math.random() * 1.8 - 0.9);
          const speed = (2.5 + Math.random() * 3.5) * (isSuper ? 1.4 : 1.0);
          v = new THREE.Vector3(
            speed * Math.sin(phi) * Math.cos(theta),
            speed * Math.cos(phi) + 1.0,
            speed * Math.sin(phi) * Math.sin(theta)
          );
        } else {
          // Peony & Crown 3D sphere blast
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(Math.random() * 2 - 1);
          const speed = (3.5 + Math.random() * 4.2) * (isSuper ? 1.6 : 1.0);
          v = new THREE.Vector3(
            speed * Math.sin(phi) * Math.cos(theta),
            speed * Math.sin(phi) * Math.sin(theta),
            speed * Math.cos(phi)
          );
        }

        // Slight color variation on outer shell
        if (Math.random() > 0.7) {
          color = new THREE.Color(0xffffff);
        }

        particles.push({
          pos: pos.clone(),
          vel: v,
          color: color,
          size: type === 'willow' ? 0.35 : 0.28,
          alpha: 1.0,
          decay: type === 'willow' ? 0.007 + Math.random() * 0.005 : 0.015 + Math.random() * 0.01,
          drag: type === 'willow' ? 0.975 : 0.96,
          gravity: type === 'willow' ? 1.8 : 1.2,
        });

        positions[i * 3] = pos.x;
        positions[i * 3 + 1] = pos.y;
        positions[i * 3 + 2] = pos.z;

        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const mat = new THREE.PointsMaterial({
        size: isSuper ? 0.38 : 0.3,
        vertexColors: true,
        transparent: true,
        opacity: 1.0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const mesh = new THREE.Points(geo, mat);
      scene.add(mesh);

      explosions.push({
        particles,
        geometry: geo,
        material: mat,
        mesh,
        alive: true,
      });
    };

    // Rocket Launcher
    const launchRocket = (targetPos?: THREE.Vector3, isSuper: boolean = false) => {
      sound.playFireworkLaunch();

      const startX = targetPos ? targetPos.x + (Math.random() - 0.5) * 2 : (Math.random() - 0.5) * 16;
      const startZ = targetPos ? targetPos.z : (Math.random() - 0.5) * 8 - 4;
      const startPos = new THREE.Vector3(startX, -5.5, startZ);

      const targetY = targetPos ? targetPos.y : 3.5 + Math.random() * 6.5;
      const speedY = 9.0 + Math.random() * 3.5;

      const types: FireworkRocket['type'][] = ['willow', 'peony', 'ring', 'crown'];
      const chosenType = isSuper ? 'willow' : types[Math.floor(Math.random() * types.length)];
      const chosenColor = palette[Math.floor(Math.random() * palette.length)];

      // Rocket trail particles
      const trailCount = 14;
      const trailGeo = new THREE.BufferGeometry();
      const trailPos = new Float32Array(trailCount * 3);
      for (let i = 0; i < trailCount * 3; i += 3) {
        trailPos[i] = startPos.x;
        trailPos[i + 1] = startPos.y;
        trailPos[i + 2] = startPos.z;
      }
      trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPos, 3));

      const rocketMat = new THREE.PointsMaterial({
        color: 0xfffbeb,
        size: 0.28,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
      });

      const rocketMesh = new THREE.Points(trailGeo, rocketMat);
      scene.add(rocketMesh);

      rockets.push({
        pos: startPos,
        vel: new THREE.Vector3((Math.random() - 0.5) * 0.8, speedY, (Math.random() - 0.5) * 0.4),
        targetY: targetY,
        color: chosenColor,
        type: chosenType,
        mesh: rocketMesh,
        trailGeo: trailGeo,
        alive: true,
      });
    };

    launchRocketRef.current = launchRocket;

    // Launch initial opening salvo
    launchRocket(new THREE.Vector3(0, 5.5, -2));
    setTimeout(() => launchRocket(new THREE.Vector3(-4.5, 4.5, -3)), 600);
    setTimeout(() => launchRocket(new THREE.Vector3(4.5, 6.0, -3)), 1200);

    // Auto recurring show timer
    let showInterval = setInterval(() => {
      if (!isFinaleRef.current) {
        launchRocket();
      }
    }, 1800);

    // 6. Animation Render Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Smooth 3D mouse look & camera tilt
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      camera.position.x = mouse.x * 2.8;
      camera.position.y = 4 + mouse.y * 1.6;
      camera.lookAt(0, 3.5, 0);

      // Star twinkle
      starMat.opacity = 0.65 + Math.sin(elapsed * 2.5) * 0.2;

      // Update Rockets
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        if (!r.alive) continue;

        r.pos.x += r.vel.x * delta;
        r.pos.y += r.vel.y * delta;
        r.pos.z += r.vel.z * delta;

        // Update trail
        const posAttr = r.trailGeo.attributes.position as THREE.BufferAttribute;
        const arr = posAttr.array as Float32Array;
        // Shift trail points
        for (let j = arr.length - 1; j >= 3; j--) {
          arr[j] = arr[j - 3];
        }
        arr[0] = r.pos.x;
        arr[1] = r.pos.y;
        arr[2] = r.pos.z;
        posAttr.needsUpdate = true;

        // Check apex detonation
        if (r.pos.y >= r.targetY || r.vel.y <= 0) {
          r.alive = false;
          scene.remove(r.mesh);
          r.trailGeo.dispose();
          createExplosion(r.pos, r.type, r.color);
          rockets.splice(i, 1);
        }
      }

      // Update Explosions
      for (let i = explosions.length - 1; i >= 0; i--) {
        const exp = explosions[i];
        if (!exp.alive) continue;

        const posAttr = exp.geometry.attributes.position as THREE.BufferAttribute;
        const colorAttr = exp.geometry.attributes.color as THREE.BufferAttribute;
        const pArr = posAttr.array as Float32Array;
        const cArr = colorAttr.array as Float32Array;

        let allDead = true;

        for (let j = 0; j < exp.particles.length; j++) {
          const p = exp.particles[j];
          if (p.alpha <= 0.01) continue;

          // Physics update
          p.vel.x *= p.drag;
          p.vel.z *= p.drag;
          p.vel.y = p.vel.y * p.drag - p.gravity * delta * 4;

          p.pos.x += p.vel.x * delta;
          p.pos.y += p.vel.y * delta;
          p.pos.z += p.vel.z * delta;

          p.alpha -= p.decay * (delta * 60);

          if (p.alpha > 0.01) {
            allDead = false;
            pArr[j * 3] = p.pos.x;
            pArr[j * 3 + 1] = p.pos.y;
            pArr[j * 3 + 2] = p.pos.z;

            // Fade sparkle
            cArr[j * 3] = p.color.r * p.alpha;
            cArr[j * 3 + 1] = p.color.g * p.alpha;
            cArr[j * 3 + 2] = p.color.b * p.alpha;
          } else {
            p.alpha = 0;
            cArr[j * 3] = 0;
            cArr[j * 3 + 1] = 0;
            cArr[j * 3 + 2] = 0;
          }
        }

        posAttr.needsUpdate = true;
        colorAttr.needsUpdate = true;

        if (allDead) {
          exp.alive = false;
          scene.remove(exp.mesh);
          exp.geometry.dispose();
          exp.material.dispose();
          explosions.splice(i, 1);
        }
      }

      // Finale sequence check
      if (isFinaleRef.current) {
        finaleTimeRef.current += delta;
        if (finaleTimeRef.current >= 1.9) {
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
      clearInterval(showInterval);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      starGeo.dispose();
      starMat.dispose();
      groundGeo.dispose();
      groundMat.dispose();
      renderer.dispose();
    };
  }, [onEnter]);

  // Handle user clicking anywhere on sky to launch firework rocket
  const handleSkyClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isFinale) return;
    const normX = (e.clientX / window.innerWidth) * 2 - 1;
    const normY = -(e.clientY / window.innerHeight) * 2 - 1;

    // Map screen coordinate to 3D sky space
    const target = new THREE.Vector3(normX * 10, 2.5 + (normY + 1) * 3.5, -2);
    launchRocketRef.current?.(target);
  };

  // Grand Finale trigger
  const handleTriggerFinale = () => {
    if (isFinale) return;
    setIsFinale(true);
    sound.playGrandCelebrationBurst();

    // Launch heavy 8-rocket barrage simultaneously across sky
    const offsets = [-8, -5, -2.5, 0, 2.5, 5, 8];
    offsets.forEach((ox, idx) => {
      setTimeout(() => {
        launchRocketRef.current?.(new THREE.Vector3(ox, 5.0 + (idx % 2) * 1.5, -2 - Math.random() * 3), true);
      }, idx * 120);
    });
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
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#030712] text-white select-none">
      {/* 3D WebGL Canvas with Click to Launch */}
      <div
        ref={containerRef}
        onClick={handleSkyClick}
        className="absolute inset-0 z-0 cursor-crosshair"
        title="Chạm bất cứ vị trí nào trên bầu trời để bắn pháo hoa!"
      />

      {/* Grand Finale Light Flash Layer */}
      <div
        className={`absolute inset-0 z-40 bg-gradient-to-t from-[#FFE58F] via-white to-[#F3E5AB] pointer-events-none transition-opacity duration-1000 ease-out ${
          isFinale ? 'opacity-95' : 'opacity-0'
        }`}
      />

      {/* Top Controls Overlay */}
      <div className="absolute top-4 sm:top-6 inset-x-4 sm:inset-x-8 z-30 flex items-center justify-between pointer-events-auto">
        {/* Left: Audio Toggle & Firework counter */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={toggleSound}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/75 hover:bg-slate-800/80 border border-[#D4AF37]/40 backdrop-blur-md text-xs text-[#F3E5AB] transition-all hover:scale-105 shadow-lg"
            title="Bật/Tắt âm thanh"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-400" /> : <Volume2 className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />}
            <span className="font-sans font-medium">{isMuted ? 'Bật Âm Thanh' : 'Âm Thanh Bật'}</span>
          </button>

          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/60 border border-slate-700/60 backdrop-blur-md text-[11px] text-amber-200">
            <Flame className="w-3 h-3 text-amber-400" />
            <span>Đã bắn: <strong className="font-numeral text-white">{fireworkCount}</strong> chùm</span>
          </div>
        </div>

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
            3D FIREWORKS CEREMONY // ĐÊM HỘI VINH DANH
          </span>
        </div>

        {/* Titles */}
        <div className="space-y-1 max-w-xl mx-auto drop-shadow-2xl">
          <h1 className="text-2xl sm:text-4xl font-serif-luxury font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FDE68A] to-[#D4AF37]">
            LỄ KHAI MÀN VINH DANH TÂN KỸ SƯ
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
            onClick={handleTriggerFinale}
            className="group relative inline-flex items-center gap-3 px-8 sm:px-12 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-[#C5A059] via-[#F3E5AB] to-[#D4AF37] text-slate-950 font-bold text-sm sm:text-base tracking-widest uppercase shadow-2xl shadow-amber-500/50 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/70"
          >
            <Sparkles className="w-4 h-4 text-slate-900 animate-bounce" />
            <span>🎆 KHAI MÀN ĐẠI LỄ</span>
            <ArrowRight className="w-4 h-4 text-slate-900 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <p className="text-[11px] text-amber-200/70 italic pt-2.5">
          💡 Chạm bất kỳ vị trí nào trên bầu trời để tự tay bắn pháo hoa hoặc bấm nút để khai màn
        </p>
      </div>
    </div>
  );
};
