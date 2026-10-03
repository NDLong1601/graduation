import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audioFx';
import { Sparkles, RotateCcw } from 'lucide-react';

interface ThreeGraduationSceneProps {
  onTossComplete?: () => void;
}

export const ThreeGraduationScene: React.FC<ThreeGraduationSceneProps> = ({ onTossComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isTossing, setIsTossing] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);

  // References for animation
  const sceneRef = useRef<THREE.Scene | null>(null);
  const capGroupRef = useRef<THREE.Group | null>(null);
  const ringsRef = useRef<THREE.Group | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const tossAnimationRef = useRef<{
    active: boolean;
    progress: number;
    initialY: number;
  }>({ active: false, progress: 0, initialY: 0 });

  // Mouse tracking
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, isDragging: false, prevX: 0, prevY: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const isMobile = width < 500;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.5, isMobile ? 7.2 : 6.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xfff1f2, 1.1);
    scene.add(ambientLight);

    // Warm Rose Gold Key Light
    const roseLight = new THREE.PointLight(0xfb7185, 16, 22);
    roseLight.position.set(-3, 3, 3);
    scene.add(roseLight);

    // Velvet Wine/Crimson Fill Light
    const wineLight = new THREE.PointLight(0xbe123c, 14, 22);
    wineLight.position.set(3, -2, 2);
    scene.add(wineLight);

    // Champagne Golden Rim Light
    const goldRim = new THREE.DirectionalLight(0xfcd34d, 3.0);
    goldRim.position.set(0, 4, -4);
    scene.add(goldRim);

    // Interactive Cursor Follower Light (Rose Gold Glow)
    const cursorLight = new THREE.PointLight(0xf43f5e, 9, 12);
    cursorLight.position.set(0, 0, 3.5);
    scene.add(cursorLight);

    // Holographic Cyber Pedestal (Floor disc)
    const floorGeo = new THREE.RingGeometry(1.6, 2.6, 32);
    const floorMat = new THREE.MeshBasicMaterial({
      color: 0xfb7185,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = Math.PI / 2;
    floorMesh.position.y = -1.25;
    scene.add(floorMesh);

    // 3. Main Cap Group
    const capGroup = new THREE.Group();
    capGroupRef.current = capGroup;
    scene.add(capGroup);

    // Cap Materials (Deep Velvet Charcoal/Burgundy)
    const capFabricMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a0710,
      roughness: 0.4,
      metalness: 0.3,
    });

    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xfcd34d,
      roughness: 0.18,
      metalness: 0.9,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.2,
    });

    const diplomaPaperMat = new THREE.MeshStandardMaterial({
      color: 0xfff1f2,
      roughness: 0.35,
      metalness: 0.1,
    });

    const diplomaRibbonMat = new THREE.MeshStandardMaterial({
      color: 0x9f1239,
      roughness: 0.25,
      metalness: 0.7,
      emissive: 0xbe123c,
      emissiveIntensity: 0.3,
    });

    // 3.1 Mortarboard Upper Square Plaque
    const boardGeo = new THREE.BoxGeometry(2.6, 0.08, 2.6);
    const boardMesh = new THREE.Mesh(boardGeo, capFabricMaterial);
    boardMesh.position.y = 0.55;
    boardMesh.castShadow = true;
    boardMesh.receiveShadow = true;
    capGroup.add(boardMesh);

    // Rose Gold Edge trim for the board
    const edges = new THREE.EdgesGeometry(boardGeo);
    const lineMat = new THREE.LineBasicMaterial({ color: 0xfb7185, linewidth: 2 });
    const boardWireframe = new THREE.LineSegments(edges, lineMat);
    boardMesh.add(boardWireframe);

    // 3.2 Skull Cap (Underneath base)
    const skullCapGeo = new THREE.CylinderGeometry(0.85, 0.72, 0.7, 32);
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
    // Cord
    const cordCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.61, 0),
      new THREE.Vector3(0.6, 0.60, 0.6),
      new THREE.Vector3(1.35, 0.52, 1.35),
      new THREE.Vector3(1.42, 0.1, 1.42),
    ]);
    const cordGeo = new THREE.TubeGeometry(cordCurve, 20, 0.025, 8, false);
    const cordMesh = new THREE.Mesh(cordGeo, goldMaterial);
    tasselGroup.add(cordMesh);

    // Tassel Fringe / Hang
    const tasselHangGeo = new THREE.CylinderGeometry(0.06, 0.14, 0.45, 16);
    const tasselHang = new THREE.Mesh(tasselHangGeo, goldMaterial);
    tasselHang.position.set(1.42, -0.1, 1.42);
    tasselGroup.add(tasselHang);
    capGroup.add(tasselGroup);

    // 3.5 Diploma Scroll (Under/Next to the cap)
    const diplomaGroup = new THREE.Group();
    diplomaGroup.position.set(0, -0.65, 0.3);
    diplomaGroup.rotation.z = Math.PI / 10;
    diplomaGroup.rotation.y = -Math.PI / 8;

    // Scroll Roll
    const scrollGeo = new THREE.CylinderGeometry(0.24, 0.24, 2.2, 32);
    const scrollMesh = new THREE.Mesh(scrollGeo, diplomaPaperMat);
    scrollMesh.rotation.z = Math.PI / 2;
    diplomaGroup.add(scrollMesh);

    // Red Ribbon Ring
    const ribbonGeo = new THREE.CylinderGeometry(0.26, 0.26, 0.25, 32);
    const ribbonMesh = new THREE.Mesh(ribbonGeo, diplomaRibbonMat);
    ribbonMesh.rotation.z = Math.PI / 2;
    diplomaGroup.add(ribbonMesh);

    // Gold Seal on ribbon
    const sealGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.04, 24);
    const sealMesh = new THREE.Mesh(sealGeo, goldMaterial);
    sealMesh.position.set(0, 0.26, 0);
    diplomaGroup.add(sealMesh);

    capGroup.add(diplomaGroup);

    // 3.6 Orbiting Golden 3D Stars
    const starsGroup = new THREE.Group();
    const starGeo = new THREE.OctahedronGeometry(0.12, 0);
    for (let i = 0; i < 6; i++) {
      const starMesh = new THREE.Mesh(starGeo, goldMaterial);
      const angle = (i / 6) * Math.PI * 2;
      const radius = 2.0;
      starMesh.position.set(Math.cos(angle) * radius, ((i % 3) - 1) * 0.45, Math.sin(angle) * radius);
      starsGroup.add(starMesh);
    }
    capGroup.add(starsGroup);
    const ringsGroup = new THREE.Group();
    ringsRef.current = ringsGroup;

    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0xfb7185,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const ringGeo1 = new THREE.TorusGeometry(2.2, 0.03, 16, 64);
    const ringMesh1 = new THREE.Mesh(ringGeo1, ringMat1);
    ringMesh1.rotation.x = Math.PI / 3;
    ringsGroup.add(ringMesh1);

    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0xfcd34d,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });
    const ringGeo2 = new THREE.TorusGeometry(2.5, 0.02, 16, 64);
    const ringMesh2 = new THREE.Mesh(ringGeo2, ringMat2);
    ringMesh2.rotation.y = Math.PI / 4;
    ringMesh2.rotation.x = -Math.PI / 6;
    ringsGroup.add(ringMesh2);

    scene.add(ringsGroup);

    // 5. Ambient Velvet Cosmic Star Particles
    const particleCount = 450;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const roseColor = new THREE.Color(0xfb7185);
    const wineColor = new THREE.Color(0xbe123c);
    const goldColor = new THREE.Color(0xfcd34d);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;

      const pick = Math.random();
      const col = pick < 0.45 ? roseColor : pick < 0.8 ? goldColor : wineColor;
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    particlesRef.current = particles;
    scene.add(particles);

    // 6. Handle Mouse and Dragging
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

    // Touch support for Mobile
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

    // 7. Animation Loop
    let clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // Handle Toss Animation
      if (tossAnimationRef.current.active && capGroupRef.current) {
        tossAnimationRef.current.progress += 0.016;
        const p = tossAnimationRef.current.progress;

        if (p < 0.5) {
          // Shooting up & spinning
          const upFactor = Math.sin(p * Math.PI);
          capGroupRef.current.position.y = tossAnimationRef.current.initialY + upFactor * 2.8;
          capGroupRef.current.rotation.y += 0.18;
          capGroupRef.current.rotation.z = Math.sin(p * 10) * 0.35;
        } else if (p < 1.0) {
          // Floating down smoothly with damping
          const downFactor = Math.sin(p * Math.PI);
          capGroupRef.current.position.y = tossAnimationRef.current.initialY + downFactor * 2.8;
          capGroupRef.current.rotation.y += 0.08;
          capGroupRef.current.rotation.z = Math.sin(p * 8) * 0.15;
        } else {
          // Finish
          tossAnimationRef.current.active = false;
          capGroupRef.current.position.y = tossAnimationRef.current.initialY;
          setIsTossing(false);
          if (onTossComplete) onTossComplete();
        }
      } else if (capGroupRef.current && !mouseRef.current.isDragging) {
        // Natural subtle floating idle animation
        capGroupRef.current.position.y = Math.sin(elapsedTime * 1.5) * 0.12;
        capGroupRef.current.rotation.y += 0.005;
        // Subtle tilt with mouse
        capGroupRef.current.rotation.x = 0.2 + mouseRef.current.y * 0.3;
        capGroupRef.current.rotation.z = -mouseRef.current.x * 0.2;
      }

      // Move cursor light to illuminate 3D model dynamically
      cursorLight.position.x = mouseRef.current.x * 4.5;
      cursorLight.position.y = mouseRef.current.y * 3.5 + 0.5;

      // Rotate 3D Stars Group
      starsGroup.rotation.y = elapsedTime * 0.4;
      starsGroup.children.forEach((star) => {
        star.rotation.x += 0.02;
        star.rotation.y += 0.03;
      });

      // Rotate Floor Disc
      floorMesh.rotation.z = -elapsedTime * 0.15;

      // Rotate Hologram Rings
      if (ringsRef.current) {
        ringsRef.current.rotation.z = elapsedTime * 0.3;
        ringsRef.current.rotation.y = elapsedTime * 0.2;
      }

      // Rotate Particle field slowly
      if (particlesRef.current) {
        particlesRef.current.rotation.y = elapsedTime * 0.05;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 8. Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.position.z = newW < 500 ? 7.2 : 6.2;
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
      renderer.dispose();
    };
  }, [onTossComplete]);

  // Cap Toss Function Trigger
  const triggerCapToss = () => {
    if (isTossing || !capGroupRef.current) return;
    setIsTossing(true);
    sound.playCapToss();

    tossAnimationRef.current = {
      active: true,
      progress: 0,
      initialY: capGroupRef.current.position.y,
    };

    // Rose Gold & Champagne Gold Confetti Explosion
    confetti({
      particleCount: 130,
      spread: 95,
      origin: { y: 0.6 },
      colors: ['#fb7185', '#f43f5e', '#fbbf24', '#fef08a', '#fda4af', '#be123c'],
    });

    setTimeout(() => {
      confetti({
        particleCount: 80,
        angle: 60,
        spread: 60,
        origin: { x: 0 },
        colors: ['#fb7185', '#fcd34d'],
      });
      confetti({
        particleCount: 80,
        angle: 120,
        spread: 60,
        origin: { x: 1 },
        colors: ['#be123c', '#f43f5e'],
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
    <div className="relative w-full h-[340px] sm:h-[440px] md:h-[520px] select-none flex items-center justify-center">
      {/* 3D WebGL Canvas Container */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing outline-none touch-none"
        title="Kéo chuột hoặc vuốt để xoay mô hình 3D"
      />

      {/* Rose Gold UI Badge Overlay */}
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 pointer-events-none">
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-rose-950/80 border border-rose-500/30 backdrop-blur-md text-[10px] sm:text-xs font-mono-code text-rose-300 shadow-lg shadow-rose-950/50">
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-rose-400 animate-ping" />
          <span>3D_HOLO_VIEWER // 360°</span>
        </div>
      </div>

      {/* Drag & Toss Hint Controls */}
      <div className="absolute bottom-3 sm:bottom-4 inset-x-3 sm:inset-x-4 flex items-center justify-between gap-2 pointer-events-auto">
        <div className="text-[10px] sm:text-[11px] font-mono-code text-rose-200/70 bg-rose-950/70 backdrop-blur-md px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg border border-rose-800/40 hidden sm:flex items-center gap-1.5">
          <span className="text-amber-400 font-bold">🖱️</span>
          <span>Kéo/vuốt xoay 360°</span>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {isInteracting && (
            <button
              onClick={resetRotation}
              className="p-2 sm:p-2.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-800/60 text-rose-200 hover:text-white transition-all text-xs"
              title="Đặt lại góc xoay"
            >
              <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          )}

          <button
            onClick={triggerCapToss}
            disabled={isTossing}
            className={`flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm tracking-wider uppercase transition-all shadow-lg ${
              isTossing
                ? 'bg-rose-900/60 text-rose-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white shadow-rose-900/50 hover:scale-105 active:scale-95'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isTossing ? 'animate-spin' : 'animate-bounce'}`} />
            <span>{isTossing ? 'ĐANG TUNG...' : '🎓 TUNG MŨ!'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
