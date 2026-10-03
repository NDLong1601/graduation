import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GRADUATION_CONFIG } from '../config';
import { sound } from '../utils/audioFx';
import { Sparkles, ArrowRight, Volume2, VolumeX, FastForward, Terminal, Cpu } from 'lucide-react';

interface CyberToGoldIntroProps {
  onEnter: () => void;
}

type AlchemistStage = 'cyber' | 'transmuting' | 'gold';

export const CyberToGoldIntro: React.FC<CyberToGoldIntroProps> = ({ onEnter }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState<AlchemistStage>('cyber');
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [isMuted, setIsMuted] = useState(sound.getMuted());

  // Animation Refs
  const animFrameRef = useRef<number | null>(null);
  const stageRef = useRef<AlchemistStage>('cyber');
  const alchemyProgressRef = useRef(0);

  useEffect(() => {
    stageRef.current = stage;
  }, [stage]);

  // Terminal Typing Sequence
  useEffect(() => {
    const lines = [
      '> git checkout branch/graduation-k27',
      '> loading modules: [Algorithms, Web3D, Database, SystemArch]... OK',
      '> candidate: "Nguyễn Đức Long" | class: "PM27.07"',
      '> faculty: Khoa Công nghệ Thông tin - HUBT',
      '> compiling degree: "KỸ SƯ KỸ THUẬT PHẦN MỀM"...',
      '> EXECUTING: long.graduate_with_honors()',
    ];

    let current = 0;
    const interval = setInterval(() => {
      if (current < lines.length) {
        setTerminalLines((prev) => [...prev, lines[current]]);
        try {
          sound.playCyberGlitch();
        } catch {
          // Audio
        }
        current++;
      } else {
        clearInterval(interval);
        // Trigger Alchemy Transformation to Gold!
        setTimeout(() => {
          setStage('transmuting');
          try {
            sound.playGoldAlchemyWave();
          } catch {
            // Audio
          }
        }, 400);

        setTimeout(() => {
          setStage('gold');
        }, 1600);
      }
    }, 550);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Three.js Scene Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x040814, 0.02);

    const width = window.innerWidth;
    const height = window.innerHeight;
    const camera = new THREE.PerspectiveCamera(56, width / height, 0.1, 1000);
    camera.position.set(0, 0, 22);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x040814, 1);
    container.appendChild(renderer.domElement);

    // Mouse Tracking
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0x0284c7, 1.2);
    scene.add(ambientLight);

    const centerLight = new THREE.PointLight(0x00f0ff, 4.0, 40);
    centerLight.position.set(0, 0, 5);
    scene.add(centerLight);

    // 3. Cyber Data Grid Floor
    const gridHelper = new THREE.GridHelper(60, 40, 0x00f0ff, 0x0369a1);
    gridHelper.position.y = -6;
    scene.add(gridHelper);

    // 4. Floating 3D Code Cubes (Software Modules)
    const cubeCount = 28;
    const cubeGroup = new THREE.Group();
    const cubeMeshes: { mesh: THREE.Mesh; initialY: number; speed: number; rotSpeed: number }[] = [];

    const cubeGeo = new THREE.BoxGeometry(1.4, 1.4, 1.4);
    const cyberMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.3,
      metalness: 0.8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.35,
    });

    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.18,
      metalness: 0.95,
      emissive: 0x9a7b38,
      emissiveIntensity: 0.25,
    });

    for (let i = 0; i < cubeCount; i++) {
      const mesh = new THREE.Mesh(cubeGeo, cyberMat);
      const ang = (i / cubeCount) * Math.PI * 2;
      const rad = 8 + Math.random() * 8;
      const y = (Math.random() - 0.5) * 10;
      mesh.position.set(Math.cos(ang) * rad, y, Math.sin(ang) * rad);

      // Edges highlight wireframe
      const edgeGeo = new THREE.EdgesGeometry(cubeGeo);
      const edgeMat = new THREE.LineBasicMaterial({ color: 0x38bdf8 });
      const wire = new THREE.LineSegments(edgeGeo, edgeMat);
      mesh.add(wire);

      cubeGroup.add(mesh);
      cubeMeshes.push({
        mesh,
        initialY: y,
        speed: 0.8 + Math.random() * 1.5,
        rotSpeed: (Math.random() - 0.5) * 0.03,
      });
    }
    scene.add(cubeGroup);

    // 5. Digital Matrix Rain Particles
    const particleCount = 1400;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    const particleCols = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      particlePos[i * 3] = (Math.random() - 0.5) * 45;
      particlePos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      particlePos[i * 3 + 2] = (Math.random() - 0.5) * 30;

      // Initial Cyan color
      particleCols[i * 3] = 0.0;
      particleCols[i * 3 + 1] = 0.85;
      particleCols[i * 3 + 2] = 1.0;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleCols, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.22,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const matrixRain = new THREE.Points(particleGeo, particleMat);
    scene.add(matrixRain);

    // 6. Expanding Golden Shockwave Ring (Active during Alchemy Transmutation)
    const waveGeo = new THREE.RingGeometry(0.5, 1.8, 64);
    const waveMat = new THREE.MeshBasicMaterial({
      color: 0xfde047,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    const waveMesh = new THREE.Mesh(waveGeo, waveMat);
    waveMesh.position.set(0, 0, 0);
    scene.add(waveMesh);

    // 7. Center Transmuted Golden Cap 3D (Revealed in Gold stage)
    const capGroup = new THREE.Group();
    // Cap plate
    const capPlate = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.15, 4.8), goldMat);
    capPlate.rotation.y = Math.PI / 4;
    capPlate.position.y = 1.2;
    capGroup.add(capPlate);

    // Skull cap
    const skullMesh = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.3, 1.4, 32), goldMat);
    skullMesh.position.y = 0.5;
    capGroup.add(skullMesh);

    // Tassel Cord & Fringe
    const tasselMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.25, 1.8, 16), goldMat);
    tasselMesh.position.set(2.4, 0.2, 2.4);
    capGroup.add(tasselMesh);

    capGroup.scale.set(0, 0, 0); // Initially hidden
    scene.add(capGroup);

    // 8. Animation Render Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Smooth mouse parallax
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;
      camera.position.x = mouse.x * 2.2;
      camera.position.y = mouse.y * 1.5;
      camera.lookAt(0, 0, 0);

      // Rotate code cubes
      cubeMeshes.forEach((item, idx) => {
        item.mesh.rotation.x += item.rotSpeed;
        item.mesh.rotation.y += item.rotSpeed * 1.2;
        item.mesh.position.y = item.initialY + Math.sin(elapsed * item.speed + idx) * 0.6;
      });

      // Matrix Rain falling
      const pArr = particleGeo.attributes.position.array as Float32Array;
      for (let i = 1; i < particleCount * 3; i += 3) {
        pArr[i] -= 0.12;
        if (pArr[i] < -15) pArr[i] = 15;
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Handle Alchemy Transmutation
      if (stageRef.current === 'transmuting' || stageRef.current === 'gold') {
        alchemyProgressRef.current = Math.min(alchemyProgressRef.current + delta * 0.9, 1.0);
        const p = alchemyProgressRef.current;

        // Shockwave expansion
        waveMesh.scale.set(1 + p * 28, 1 + p * 28, 1);
        waveMat.opacity = Math.max((1 - p) * 1.2, 0);

        // Turn Light from Cyan to Brilliant Gold
        centerLight.color.lerp(new THREE.Color(0xfde047), 0.08);
        centerLight.intensity = 4.0 + Math.sin(elapsed * 4) * 1.5;
        ambientLight.color.lerp(new THREE.Color(0x854d0e), 0.05);

        // Change Cube Material to 24K Gold!
        cubeMeshes.forEach((item) => {
          item.mesh.material = goldMat;
          // Change wireframe to gold
          const wire = item.mesh.children[0] as THREE.LineSegments;
          if (wire && wire.material) {
            (wire.material as THREE.LineBasicMaterial).color.set(0xffd700);
          }
        });

        // Turn Matrix particles from Cyan to Golden flakes
        const cArr = particleGeo.attributes.color.array as Float32Array;
        for (let i = 0; i < particleCount * 3; i += 3) {
          cArr[i] = THREE.MathUtils.lerp(cArr[i], 0.95, 0.08); // Red
          cArr[i + 1] = THREE.MathUtils.lerp(cArr[i + 1], 0.78, 0.08); // Green
          cArr[i + 2] = THREE.MathUtils.lerp(cArr[i + 2], 0.22, 0.08); // Blue
        }
        particleGeo.attributes.color.needsUpdate = true;

        // Reveal Golden Cap 3D at Center
        capGroup.scale.set(p * 1.5, p * 1.5, p * 1.5);
        capGroup.rotation.y = elapsed * 0.6;
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
      renderer.dispose();
    };
  }, []);

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
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#040814] text-white select-none">
      {/* 3D WebGL Canvas */}
      <div ref={containerRef} className="absolute inset-0 z-0" />

      {/* Top Controls Overlay */}
      <div className="absolute top-4 sm:top-6 inset-x-4 sm:inset-x-8 z-30 flex items-center justify-between pointer-events-auto">
        {/* Left: Audio Toggle */}
        <button
          onClick={toggleSound}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/70 hover:bg-slate-800/80 border border-cyan-500/40 backdrop-blur-md text-xs text-cyan-200 transition-all hover:scale-105 shadow-lg"
          title="Bật/Tắt âm thanh"
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-400" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />}
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

      {/* CENTER HUD: Cyber Terminal (Giai đoạn Code) */}
      {stage === 'cyber' && (
        <div className="absolute inset-x-4 top-20 sm:top-24 z-20 max-w-xl mx-auto pointer-events-auto animate-fadeIn">
          <div className="rounded-2xl bg-slate-950/85 border border-cyan-500/50 shadow-2xl shadow-cyan-950/60 p-4 sm:p-6 backdrop-blur-xl font-mono text-left">
            {/* Terminal Top Window Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-cyan-900/60 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <span className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="text-xs text-cyan-400/80 ml-2 font-semibold flex items-center gap-1">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>bash — hubt_software_engineer_k27.sh</span>
                </span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-cyan-400 font-bold bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                <Cpu className="w-3 h-3 animate-spin" />
                <span>BUILDING</span>
              </div>
            </div>

            {/* Terminal Lines Output */}
            <div className="space-y-1.5 text-xs sm:text-sm">
              {terminalLines.map((line, idx) => (
                <div
                  key={idx}
                  className={`transition-opacity duration-300 ${
                    idx === terminalLines.length - 1
                      ? 'text-cyan-300 font-bold drop-shadow'
                      : 'text-slate-400'
                  }`}
                >
                  {line}
                </div>
              ))}
              <div className="inline-block w-2.5 h-4 bg-cyan-400 animate-pulse ml-0.5 align-middle" />
            </div>
          </div>
        </div>
      )}

      {/* CENTER PROCLAMATION: Transmuted Imperial Gold (Giai đoạn Vàng Hoàng Gia) */}
      {(stage === 'transmuting' || stage === 'gold') && (
        <div className="absolute inset-x-4 bottom-10 sm:bottom-16 z-20 flex flex-col items-center justify-center text-center pointer-events-auto animate-scaleUp">
          {/* Alchemy Complete Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-[#D4AF37]/60 backdrop-blur-md text-xs text-[#FDE68A] shadow-xl mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-spin" />
            <span className="tracking-[0.25em] font-sans font-bold uppercase">
              THUẬT BIẾN MÃ NGUỒN THÀNH VÀNG HOÀNG GIA // 100% SUCCESS
            </span>
          </div>

          {/* Titles & Graduate Honor */}
          <div className="space-y-1 max-w-xl mx-auto drop-shadow-2xl">
            <span className="text-xs font-sans font-bold tracking-[0.3em] text-[#D4AF37] uppercase">
              CHÚC MỪNG TÂN KỸ SƯ KỸ THUẬT PHẦN MỀM
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif-luxury font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FDE68A] to-[#D4AF37]">
              {GRADUATION_CONFIG.graduate.fullName}
            </h1>
            <p className="text-xs sm:text-sm text-amber-200/90 font-medium">
              Chuyên ngành: <span className="text-white font-bold">{GRADUATION_CONFIG.graduate.major}</span> • Lớp{' '}
              <span className="font-numeral font-bold text-[#FDE68A]">{GRADUATION_CONFIG.graduate.classCode}</span>
            </p>
            <p className="text-xs text-slate-300 mt-0.5 font-sans">
              Khoa Công nghệ Thông tin • Trường ĐH Kinh doanh & Công nghệ Hà Nội
            </p>
          </div>

          {/* Enter Button */}
          <div className="pt-6">
            <button
              onClick={handleEnterCeremony}
              className="group relative inline-flex items-center gap-3 px-8 sm:px-12 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-[#C5A059] via-[#F3E5AB] to-[#D4AF37] text-slate-950 font-bold text-sm sm:text-base tracking-widest uppercase shadow-2xl shadow-amber-500/50 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/70"
            >
              <Sparkles className="w-4 h-4 text-slate-900 animate-bounce" />
              <span>BƯỚC VÀO BUỔI LỄ</span>
              <ArrowRight className="w-4 h-4 text-slate-900 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <p className="text-[11px] text-amber-200/60 italic pt-2.5">
            Mọi dòng mã thuật toán đã được đúc thành chiếc Bằng Kỹ sư Vàng 24K
          </p>
        </div>
      )}
    </div>
  );
};
