import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GRADUATION_CONFIG } from '../config';
import { sound } from '../utils/audioFx';
import { Sparkles, Volume2, VolumeX, FastForward } from 'lucide-react';

interface RoyalGatesIntroProps {
  onEnter: () => void;
}

export const RoyalGatesIntro: React.FC<RoyalGatesIntroProps> = ({ onEnter }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpening, setIsOpening] = useState(false);
  const [isMuted, setIsMuted] = useState(sound.getMuted());

  // Animation Refs
  const animFrameRef = useRef<number | null>(null);
  const isOpeningRef = useRef(false);
  const openProgressRef = useRef(0);

  useEffect(() => {
    isOpeningRef.current = isOpening;
  }, [isOpening]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Three.js Scene & Camera Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060913, 0.016);

    const width = window.innerWidth;
    const height = window.innerHeight;
    const camera = new THREE.PerspectiveCamera(54, width / height, 0.1, 1000);
    camera.position.set(0, 3.8, 22);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x060913, 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Mouse Tracking for subtle camera parallax
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 2. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0x1e293b, 1.2);
    scene.add(ambientLight);

    // Moonlight Key Light
    const moonLight = new THREE.DirectionalLight(0xd4af37, 2.2);
    moonLight.position.set(10, 20, 15);
    moonLight.castShadow = true;
    scene.add(moonLight);

    // Giant Golden Backlight behind the gates (revealed when gates open)
    const backFloodLight = new THREE.DirectionalLight(0xfffbeb, 6.0);
    backFloodLight.position.set(0, 8, -18);
    backFloodLight.target.position.set(0, 3, 0);
    scene.add(backFloodLight);
    scene.add(backFloodLight.target);

    // 3. Materials
    const marbleMat = new THREE.MeshStandardMaterial({
      color: 0xf5f3ee,
      roughness: 0.35,
      metalness: 0.1,
    });

    const polishedGoldMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.18,
      metalness: 0.95,
      emissive: 0x9a7b38,
      emissiveIntensity: 0.18,
    });

    const wroughtIronMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.45,
      metalness: 0.8,
    });

    const redCarpetMat = new THREE.MeshStandardMaterial({
      color: 0x881337,
      roughness: 0.65,
      metalness: 0.05,
    });

    // 4. Ground Floor & Royal Red Carpet
    const floorGeo = new THREE.PlaneGeometry(80, 80);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x0b1120,
      roughness: 0.6,
      metalness: 0.2,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = -0.05;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // Red Carpet
    const carpetGeo = new THREE.PlaneGeometry(6.4, 70);
    const carpetMesh = new THREE.Mesh(carpetGeo, redCarpetMat);
    carpetMesh.rotation.x = -Math.PI / 2;
    carpetMesh.position.set(0, 0.01, 5);
    carpetMesh.receiveShadow = true;
    scene.add(carpetMesh);

    // Carpet Golden Borders
    const carpetBorderGeo = new THREE.PlaneGeometry(0.25, 70);
    const leftBorder = new THREE.Mesh(carpetBorderGeo, polishedGoldMat);
    leftBorder.rotation.x = -Math.PI / 2;
    leftBorder.position.set(-3.2, 0.02, 5);
    scene.add(leftBorder);

    const rightBorder = new THREE.Mesh(carpetBorderGeo, polishedGoldMat);
    rightBorder.rotation.x = -Math.PI / 2;
    rightBorder.position.set(3.2, 0.02, 5);
    scene.add(rightBorder);

    // 5. Marble Pillars (Trụ Cột Cẩm Thạch)
    const pillarWidth = 2.2;
    const pillarHeight = 15;
    const pillarGeo = new THREE.BoxGeometry(pillarWidth, pillarHeight, pillarWidth);

    // Left Pillar
    const leftPillar = new THREE.Mesh(pillarGeo, marbleMat);
    leftPillar.position.set(-8.9, pillarHeight / 2, 0);
    leftPillar.castShadow = true;
    leftPillar.receiveShadow = true;
    scene.add(leftPillar);

    // Left Pillar Gold Capital & Base
    const capGeo = new THREE.BoxGeometry(2.6, 0.8, 2.6);
    const leftCapTop = new THREE.Mesh(capGeo, polishedGoldMat);
    leftCapTop.position.set(-8.9, pillarHeight + 0.4, 0);
    scene.add(leftCapTop);

    const leftCapBottom = new THREE.Mesh(capGeo, polishedGoldMat);
    leftCapBottom.position.set(-8.9, 0.4, 0);
    scene.add(leftCapBottom);

    // Right Pillar
    const rightPillar = new THREE.Mesh(pillarGeo, marbleMat);
    rightPillar.position.set(8.9, pillarHeight / 2, 0);
    rightPillar.castShadow = true;
    rightPillar.receiveShadow = true;
    scene.add(rightPillar);

    const rightCapTop = new THREE.Mesh(capGeo, polishedGoldMat);
    rightCapTop.position.set(8.9, pillarHeight + 0.4, 0);
    scene.add(rightCapTop);

    const rightCapBottom = new THREE.Mesh(capGeo, polishedGoldMat);
    rightCapBottom.position.set(8.9, 0.4, 0);
    scene.add(rightCapBottom);

    // Lanterns on Pillar Tops with Point Lights
    const lanternGeo = new THREE.CylinderGeometry(0.5, 0.7, 1.6, 8);
    const leftLantern = new THREE.Mesh(lanternGeo, polishedGoldMat);
    leftLantern.position.set(-8.9, pillarHeight + 1.6, 0);
    scene.add(leftLantern);

    const leftPointLight = new THREE.PointLight(0xf59e0b, 3.5, 25);
    leftPointLight.position.set(-8.9, pillarHeight + 2.0, 0);
    scene.add(leftPointLight);

    const rightLantern = new THREE.Mesh(lanternGeo, polishedGoldMat);
    rightLantern.position.set(8.9, pillarHeight + 1.6, 0);
    scene.add(rightLantern);

    const rightPointLight = new THREE.PointLight(0xf59e0b, 3.5, 25);
    rightPointLight.position.set(8.9, pillarHeight + 2.0, 0);
    scene.add(rightPointLight);

    // 6. Archway Lintel Beam (Xà Ngang Vòm Cổng)
    const lintelGeo = new THREE.BoxGeometry(20, 1.8, 2.0);
    const lintelMesh = new THREE.Mesh(lintelGeo, marbleMat);
    lintelMesh.position.set(0, pillarHeight - 0.5, 0);
    scene.add(lintelMesh);

    const lintelTrim = new THREE.Mesh(new THREE.BoxGeometry(20.4, 0.35, 2.2), polishedGoldMat);
    lintelTrim.position.set(0, pillarHeight + 0.5, 0);
    scene.add(lintelTrim);

    // 7. Left & Right Royal Gate Doors (Đôi Cánh Cổng Hoàng Gia 3D)
    // Left Gate Door Pivot Group (hinge at x = -7.8)
    const leftGatePivot = new THREE.Group();
    leftGatePivot.position.set(-7.8, 0, 0);
    scene.add(leftGatePivot);

    const leftGateMeshGroup = new THREE.Group();
    leftGatePivot.add(leftGateMeshGroup);

    // Outer Gate Frame
    const gateWidth = 7.7;
    const gateHeight = 13.8;
    const frameGeo = new THREE.BoxGeometry(gateWidth, gateHeight, 0.28);
    // Offset so pivot is at outer edge
    frameGeo.translate(gateWidth / 2, gateHeight / 2, 0);

    const leftFrame = new THREE.Mesh(frameGeo, wroughtIronMat);
    leftFrame.castShadow = true;
    leftGateMeshGroup.add(leftFrame);

    // Gold decorative inner border
    const innerBorderGeo = new THREE.BoxGeometry(gateWidth - 0.8, gateHeight - 0.8, 0.32);
    innerBorderGeo.translate(gateWidth / 2, gateHeight / 2, 0);
    const leftInnerWireframe = new THREE.LineSegments(
      new THREE.EdgesGeometry(innerBorderGeo),
      new THREE.LineBasicMaterial({ color: 0xd4af37, linewidth: 2 })
    );
    leftGateMeshGroup.add(leftInnerWireframe);

    // Vertical Wrought Iron Spikes & Bars
    for (let i = 1; i < 7; i++) {
      const barX = (gateWidth / 7) * i;
      const barGeo = new THREE.CylinderGeometry(0.08, 0.08, gateHeight - 0.6, 12);
      const barMesh = new THREE.Mesh(barGeo, polishedGoldMat);
      barMesh.position.set(barX, gateHeight / 2, 0);
      leftGateMeshGroup.add(barMesh);

      // Top Fleur-de-lis spear tip
      const spearGeo = new THREE.ConeGeometry(0.22, 0.8, 6);
      const spearMesh = new THREE.Mesh(spearGeo, polishedGoldMat);
      spearMesh.position.set(barX, gateHeight + 0.1, 0);
      leftGateMeshGroup.add(spearMesh);
    }

    // Left Half of Center Graduation Emblem
    const halfMedallionGeo = new THREE.CylinderGeometry(1.6, 1.6, 0.45, 32, 1, false, 0, Math.PI);
    const leftHalfMedallion = new THREE.Mesh(halfMedallionGeo, polishedGoldMat);
    leftHalfMedallion.rotation.z = Math.PI / 2;
    leftHalfMedallion.rotation.y = Math.PI / 2;
    leftHalfMedallion.position.set(gateWidth, gateHeight / 2, 0.1);
    leftGateMeshGroup.add(leftHalfMedallion);

    // Right Gate Door Pivot Group (hinge at x = +7.8)
    const rightGatePivot = new THREE.Group();
    rightGatePivot.position.set(7.8, 0, 0);
    scene.add(rightGatePivot);

    const rightGateMeshGroup = new THREE.Group();
    rightGatePivot.add(rightGateMeshGroup);

    const rightFrameGeo = new THREE.BoxGeometry(gateWidth, gateHeight, 0.28);
    rightFrameGeo.translate(-gateWidth / 2, gateHeight / 2, 0);
    const rightFrame = new THREE.Mesh(rightFrameGeo, wroughtIronMat);
    rightFrame.castShadow = true;
    rightGateMeshGroup.add(rightFrame);

    const rightInnerBorderGeo = new THREE.BoxGeometry(gateWidth - 0.8, gateHeight - 0.8, 0.32);
    rightInnerBorderGeo.translate(-gateWidth / 2, gateHeight / 2, 0);
    const rightInnerWireframe = new THREE.LineSegments(
      new THREE.EdgesGeometry(rightInnerBorderGeo),
      new THREE.LineBasicMaterial({ color: 0xd4af37, linewidth: 2 })
    );
    rightGateMeshGroup.add(rightInnerWireframe);

    for (let i = 1; i < 7; i++) {
      const barX = -(gateWidth / 7) * i;
      const barGeo = new THREE.CylinderGeometry(0.08, 0.08, gateHeight - 0.6, 12);
      const barMesh = new THREE.Mesh(barGeo, polishedGoldMat);
      barMesh.position.set(barX, gateHeight / 2, 0);
      rightGateMeshGroup.add(barMesh);

      const spearGeo = new THREE.ConeGeometry(0.22, 0.8, 6);
      const spearMesh = new THREE.Mesh(spearGeo, polishedGoldMat);
      spearMesh.position.set(barX, gateHeight + 0.1, 0);
      rightGateMeshGroup.add(spearMesh);
    }

    // Right Half of Center Graduation Emblem
    const rightHalfMedallion = new THREE.Mesh(halfMedallionGeo, polishedGoldMat);
    rightHalfMedallion.rotation.z = -Math.PI / 2;
    rightHalfMedallion.rotation.y = -Math.PI / 2;
    rightHalfMedallion.position.set(-gateWidth, gateHeight / 2, 0.1);
    rightGateMeshGroup.add(rightHalfMedallion);

    // 8. Atmospheric Floating Golden Dust Motes
    const particleCount = 1200;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 36;
      particlePositions[i + 1] = Math.random() * 18;
      particlePositions[i + 2] = (Math.random() - 0.5) * 32;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xfde047,
      size: 0.16,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const dustParticles = new THREE.Points(particleGeo, particleMat);
    scene.add(dustParticles);

    // 9. Animation Render Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Smooth Mouse Parallax
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      if (!isOpeningRef.current) {
        camera.position.x = mouse.x * 2.2;
        camera.position.y = 3.8 + mouse.y * 1.2;
        camera.lookAt(0, 5.5, 0);
      } else {
        // Gate Opening Sequence
        openProgressRef.current = Math.min(openProgressRef.current + delta * 0.55, 1.0);
        const p = openProgressRef.current;

        // Smooth cubic easing
        const ease = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;

        // Gates swing outward
        leftGatePivot.rotation.y = -ease * (Math.PI / 2.3);
        rightGatePivot.rotation.y = ease * (Math.PI / 2.3);

        // Camera glides forward through the gate
        camera.position.z = 22 - ease * 27.5; // moves from 22 to -5.5
        camera.position.x = 0;
        camera.position.y = 3.8 + ease * 0.5;
        camera.lookAt(0, 5.0, -15);

        // Enhance god-rays as gates open
        backFloodLight.intensity = 6.0 + ease * 12.0;

        // When camera passes through threshold, complete transition
        if (p >= 0.98) {
          onEnter();
          return;
        }
      }

      // Dust particles gentle bobbing
      const posArray = particleGeo.attributes.position.array as Float32Array;
      for (let i = 1; i < particleCount * 3; i += 3) {
        posArray[i] -= 0.015;
        if (posArray[i] < 0) posArray[i] = 18;
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Subtle flickering of lanterns
      const flicker = 3.2 + Math.sin(clock.getElapsedTime() * 8) * 0.3;
      leftPointLight.intensity = flicker;
      rightPointLight.intensity = flicker;

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
  }, [onEnter]);

  const handleOpenGate = () => {
    if (isOpening) return;
    setIsOpening(true);
    sound.playGateOpen();
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

      {/* Golden Flash Light Transition when entering */}
      <div
        className={`absolute inset-0 z-40 bg-gradient-to-tr from-amber-100 via-white to-amber-200 pointer-events-none transition-opacity duration-1000 ease-out ${
          isOpening ? 'opacity-90' : 'opacity-0'
        }`}
        style={{
          transitionDelay: '1.2s',
        }}
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

      {/* Center Grand Royal Gates Overlay UI */}
      {!isOpening && (
        <div className="absolute inset-x-4 bottom-14 sm:bottom-20 z-20 flex flex-col items-center justify-center text-center pointer-events-auto animate-fadeIn">
          {/* Ceremony Top Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-[#D4AF37]/50 backdrop-blur-md text-xs text-[#F3E5AB] shadow-lg mb-3">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
            <span className="tracking-[0.25em] font-sans font-semibold uppercase">
              NGHI THỨC KHAI MẠC HOÀNG GIA // HUBT K27
            </span>
          </div>

          {/* Titles & Graduate Name */}
          <div className="space-y-1 max-w-xl mx-auto drop-shadow-xl">
            <h1 className="text-2xl sm:text-4xl font-serif-luxury font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FDE68A] to-[#D4AF37]">
              CỔNG ĐẠI LỄ ĐƯỜNG VINH DANH
            </h1>
            <p className="text-sm sm:text-base font-serif-luxury text-[#F3E5AB] font-bold tracking-wide">
              LỄ TỐT NGHIỆP TÂN KỸ SƯ: <span className="text-white underline decoration-[#D4AF37]/60">{GRADUATION_CONFIG.graduate.fullName}</span>
            </p>
            <p className="text-xs text-slate-300 font-sans">
              Khoa Công nghệ Thông tin • Lớp <span className="font-numeral font-bold text-[#FDE68A]">{GRADUATION_CONFIG.graduate.classCode}</span> • HUBT
            </p>
          </div>

          {/* Gate Opening Button */}
          <div className="pt-6">
            <button
              onClick={handleOpenGate}
              className="group relative inline-flex items-center gap-3 px-8 sm:px-12 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-[#800F15] via-[#A81D24] to-[#60080D] hover:from-[#A81D24] hover:to-[#800F15] text-[#FDE68A] font-bold text-sm sm:text-base tracking-widest uppercase shadow-2xl shadow-red-950/80 hover:scale-105 active:scale-95 transition-all cursor-pointer border-2 border-[#D4AF37]"
            >
              <span className="text-xl">🏛️</span>
              <span>MỞ CỔNG HOÀNG GIA</span>
              <Sparkles className="w-4 h-4 text-[#D4AF37] animate-bounce" />
            </button>
          </div>

          <p className="text-[11px] text-amber-200/60 italic pt-2">
            Chạm vào nút để bẻ khóa then cài và mở cánh cổng đại lễ đường
          </p>
        </div>
      )}

      {/* Opening State Notification */}
      {isOpening && (
        <div className="absolute inset-x-4 bottom-12 z-20 flex justify-center text-center pointer-events-none animate-fadeIn">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-slate-900/80 border border-[#D4AF37]/50 backdrop-blur-md text-xs sm:text-sm text-[#FDE68A] font-serif-luxury tracking-wider">
            <Sparkles className="w-4 h-4 text-[#D4AF37] animate-spin" />
            <span>Đang mở cổng đại lễ đường... Trân trọng đón tiếp Quý khách!</span>
          </div>
        </div>
      )}
    </div>
  );
};
