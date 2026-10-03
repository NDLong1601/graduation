import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GRADUATION_CONFIG } from '../config';
import { sound } from '../utils/audioFx';
import { Sparkles, ArrowRight, Volume2, VolumeX, FastForward, Terminal, Cpu } from 'lucide-react';

interface CyberToGoldIntroProps {
  onEnter: () => void;
}

type AlchemistStage = 'cyber' | 'transmuting' | 'gold';

interface InteractiveCube {
  mesh: THREE.Group;
  outerBox: THREE.Mesh;
  innerCore: THREE.Mesh;
  wireframe: THREE.LineSegments;
  basePos: THREE.Vector3;
  currentPos: THREE.Vector3;
  velocity: THREE.Vector3;
  rotSpeed: THREE.Vector3;
  spinBonus: number;
  scaleBonus: number;
}

interface Spark {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  color: THREE.Color;
  life: number;
  maxLife: number;
}

export const CyberToGoldIntro: React.FC<CyberToGoldIntroProps> = ({ onEnter }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState<AlchemistStage>('cyber');
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [isMuted, setIsMuted] = useState(sound.getMuted());

  // Animation & Stage Refs
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
    scene.fog = new THREE.FogExp2(0x040814, 0.018);

    const width = window.innerWidth;
    const height = window.innerHeight;
    const camera = new THREE.PerspectiveCamera(54, width / height, 0.1, 1000);
    camera.position.set(0, 0, 20);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x040814, 1);
    container.appendChild(renderer.domElement);

    // Mouse Tracking & Raycasting
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const mouseNorm = new THREE.Vector2(-999, -999);
    const raycaster = new THREE.Raycaster();

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(e.clientY / window.innerHeight) * 2 - 1;
      mouseNorm.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseNorm.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 2. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0x0284c7, 1.4);
    scene.add(ambientLight);

    const centerLight = new THREE.PointLight(0x00f0ff, 4.5, 45);
    centerLight.position.set(0, 0, 5);
    scene.add(centerLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 1.2);
    rimLight.position.set(5, 10, 8);
    scene.add(rimLight);

    // 3. Cyber Data Grid Floor
    const gridHelper = new THREE.GridHelper(60, 40, 0x00f0ff, 0x0369a1);
    gridHelper.position.y = -6;
    scene.add(gridHelper);

    // 4. Interactive Sleek 3D Quantum Data Prisms (Khối dữ liệu pha lê lõi vàng)
    const cubeCount = 26;
    const interactiveCubes: InteractiveCube[] = [];
    const interactiveMeshList: THREE.Object3D[] = [];

    // Materials
    const cyberBoxMat = new THREE.MeshPhysicalMaterial({
      color: 0x071328,
      roughness: 0.12,
      metalness: 0.85,
      transmission: 0.6,
      ior: 1.5,
      transparent: true,
      opacity: 0.9,
    });

    const goldBoxMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.12,
      metalness: 0.95,
      emissive: 0x8a6d3b,
      emissiveIntensity: 0.28,
    });

    const cyberCoreMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const goldCoreMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });

    const cubeGeo = new THREE.BoxGeometry(1.05, 1.05, 1.05);
    const edgeGeo = new THREE.EdgesGeometry(cubeGeo);
    const coreGeo = new THREE.OctahedronGeometry(0.32);

    for (let i = 0; i < cubeCount; i++) {
      const cubeGroup = new THREE.Group();

      // Outer glass/gold shell
      const outerBox = new THREE.Mesh(cubeGeo, cyberBoxMat.clone());
      cubeGroup.add(outerBox);

      // Luminous edges
      const edgeMat = new THREE.LineBasicMaterial({ color: 0x00f0ff });
      const wireframe = new THREE.LineSegments(edgeGeo, edgeMat);
      cubeGroup.add(wireframe);

      // Inner glowing quantum energy core
      const innerCore = new THREE.Mesh(coreGeo, cyberCoreMat.clone());
      cubeGroup.add(innerCore);

      // Arrange in an elegant curved framing orbit (CLEAR of center title/cap zone)
      const ang = (i / cubeCount) * Math.PI * 2;
      const rad = 10.5 + Math.random() * 8.5;
      let x = Math.cos(ang) * rad;
      let y = (Math.random() - 0.5) * 11;
      let z = Math.sin(ang) * (rad * 0.75) - 3;

      // Ensure center safe zone for text & cap
      if (Math.abs(x) < 5.0 && Math.abs(y) < 3.5 && z > -5) {
        x = (x >= 0 ? 1 : -1) * (5.5 + Math.random() * 3);
        y = (y >= 0 ? 1 : -1) * (4.0 + Math.random() * 3);
      }

      cubeGroup.position.set(x, y, z);
      scene.add(cubeGroup);

      interactiveMeshList.push(outerBox);

      interactiveCubes.push({
        mesh: cubeGroup,
        outerBox,
        innerCore,
        wireframe,
        basePos: new THREE.Vector3(x, y, z),
        currentPos: new THREE.Vector3(x, y, z),
        velocity: new THREE.Vector3(0, 0, 0),
        rotSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.025,
          (Math.random() - 0.5) * 0.015
        ),
        spinBonus: 0,
        scaleBonus: 0,
      });
    }

    // 5. Digital Matrix Particle Dust
    const particleCount = 1200;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    const particleCols = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      particlePos[i * 3] = (Math.random() - 0.5) * 45;
      particlePos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      particlePos[i * 3 + 2] = (Math.random() - 0.5) * 30;

      particleCols[i * 3] = 0.0;
      particleCols[i * 3 + 1] = 0.85;
      particleCols[i * 3 + 2] = 1.0;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleCols, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const matrixRain = new THREE.Points(particleGeo, particleMat);
    scene.add(matrixRain);

    // 6. Expanding Golden Shockwave Ring
    const waveGeo = new THREE.RingGeometry(0.5, 1.8, 64);
    const waveMat = new THREE.MeshBasicMaterial({
      color: 0xfde047,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    const waveMesh = new THREE.Mesh(waveGeo, waveMat);
    scene.add(waveMesh);

    // 7. Center Transmuted Golden Cap 3D (Revealed in Gold stage)
    const capGroup = new THREE.Group();
    const capPlate = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.14, 4.2), goldBoxMat);
    capPlate.rotation.y = Math.PI / 4;
    capPlate.position.y = 1.1;
    capGroup.add(capPlate);

    // Gold trim on plate
    const capEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(4.2, 0.14, 4.2)),
      new THREE.LineBasicMaterial({ color: 0xfff08a })
    );
    capPlate.add(capEdges);

    const skullMesh = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.2, 1.3, 32), goldBoxMat);
    skullMesh.position.y = 0.45;
    capGroup.add(skullMesh);

    const tasselMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.22, 1.6, 16), goldBoxMat);
    tasselMesh.position.set(2.1, 0.2, 2.1);
    capGroup.add(tasselMesh);

    capGroup.scale.set(0, 0, 0);
    scene.add(capGroup);

    // 8. Interactive Golden Click Sparks System
    const sparks: Spark[] = [];
    const maxSparks = 180;
    const sparkGeo = new THREE.BufferGeometry();
    const sparkPos = new Float32Array(maxSparks * 3);
    const sparkCols = new Float32Array(maxSparks * 3);
    sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3));
    sparkGeo.setAttribute('color', new THREE.BufferAttribute(sparkCols, 3));

    const sparkMat = new THREE.PointsMaterial({
      size: 0.25,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const sparkPoints = new THREE.Points(sparkGeo, sparkMat);
    scene.add(sparkPoints);

    const spawnSparks = (origin: THREE.Vector3) => {
      const isGoldStage = stageRef.current === 'transmuting' || stageRef.current === 'gold';
      const count = 16;
      for (let i = 0; i < count; i++) {
        if (sparks.length >= maxSparks) sparks.shift();
        const v = new THREE.Vector3(
          (Math.random() - 0.5) * 5.0,
          (Math.random() - 0.5) * 5.0,
          (Math.random() - 0.5) * 5.0
        );
        sparks.push({
          pos: origin.clone(),
          vel: v,
          color: isGoldStage ? new THREE.Color(0xffd700) : new THREE.Color(0x38bdf8),
          life: 0,
          maxLife: 0.6 + Math.random() * 0.4,
        });
      }
    };

    // Click on Cube Event
    const handleCanvasClick = () => {
      raycaster.setFromCamera(mouseNorm, camera);
      const intersects = raycaster.intersectObjects(interactiveMeshList, true);
      if (intersects.length > 0) {
        const hitOuter = intersects[0].object;
        const target = interactiveCubes.find((c) => c.outerBox === hitOuter || c.mesh === hitOuter.parent);
        if (target) {
          sound.playClick();
          // Boost spin & scale impulse
          target.spinBonus = 18.0;
          target.scaleBonus = 0.5;
          // Spawn sparks at cube location
          spawnSparks(target.mesh.position);
        }
      }
    };
    container.addEventListener('click', handleCanvasClick);

    // 9. Animation Render Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Camera parallax
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;
      camera.position.x = mouse.x * 2.0;
      camera.position.y = mouse.y * 1.4;
      camera.lookAt(0, 0, 0);

      // Raycast for hover state & proximity physics
      raycaster.setFromCamera(mouseNorm, camera);
      const rayIntersects = raycaster.intersectObjects(interactiveMeshList, true);
      const hoveredMesh = rayIntersects.length > 0 ? rayIntersects[0].object : null;

      // Update cursor pointer
      if (container) {
        container.style.cursor = hoveredMesh ? 'pointer' : 'default';
      }

      // Update Interactive Prisms
      interactiveCubes.forEach((item, idx) => {
        // Base bobbing
        const targetY = item.basePos.y + Math.sin(elapsed * 1.2 + idx * 0.7) * 0.4;
        const targetX = item.basePos.x + Math.cos(elapsed * 0.8 + idx * 0.5) * 0.25;

        // Proximity repulsion from mouse ray
        const cubePos = item.mesh.position;
        const rayPoint = new THREE.Vector3();
        raycaster.ray.closestPointToPoint(cubePos, rayPoint);
        const distToRay = cubePos.distanceTo(rayPoint);

        const isHovered = hoveredMesh && (hoveredMesh === item.outerBox || hoveredMesh.parent === item.mesh);

        if (distToRay < 3.8 || isHovered) {
          // Repulsion vector pushing away from cursor
          const pushDir = cubePos.clone().sub(rayPoint).normalize();
          const pushForce = Math.max((3.8 - distToRay) * 0.45, 0);
          item.velocity.add(pushDir.multiplyScalar(pushForce));

          // Spin reaction
          item.rotSpeed.x += (Math.random() - 0.5) * 0.02;
          item.rotSpeed.y += (Math.random() - 0.5) * 0.02;

          // Inner core pulse
          item.innerCore.scale.set(1.4, 1.4, 1.4);
        } else {
          item.innerCore.scale.set(1.0, 1.0, 1.0);
        }

        // Spring damping back to anchor
        const springForceX = (targetX - item.currentPos.x) * 2.5;
        const springForceY = (targetY - item.currentPos.y) * 2.5;
        item.velocity.x = (item.velocity.x + springForceX * delta) * 0.88;
        item.velocity.y = (item.velocity.y + springForceY * delta) * 0.88;

        item.currentPos.x += item.velocity.x * delta * 15;
        item.currentPos.y += item.velocity.y * delta * 15;
        item.mesh.position.set(item.currentPos.x, item.currentPos.y, item.basePos.z);

        // Rotation update with click spin bonus decay
        item.spinBonus = Math.max(item.spinBonus - delta * 12.0, 0);
        item.mesh.rotation.x += item.rotSpeed.x + item.spinBonus * delta * 0.8;
        item.mesh.rotation.y += item.rotSpeed.y + item.spinBonus * delta;

        // Scale impulse decay
        item.scaleBonus = Math.max(item.scaleBonus - delta * 1.5, 0);
        const curScale = 1.0 + item.scaleBonus;
        item.mesh.scale.set(curScale, curScale, curScale);

        // Inner core rotation
        item.innerCore.rotation.y += delta * 2.0;
        item.innerCore.rotation.z += delta * 1.5;
      });

      // Update Click Sparks
      const sPosArr = sparkGeo.attributes.position.array as Float32Array;
      const sColArr = sparkGeo.attributes.color.array as Float32Array;
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.life += delta;
        if (s.life >= s.maxLife) {
          sparks.splice(i, 1);
          continue;
        }

        s.pos.addScaledVector(s.vel, delta);
        s.vel.multiplyScalar(0.96);

        const alpha = Math.max(1 - s.life / s.maxLife, 0);
        sPosArr[i * 3] = s.pos.x;
        sPosArr[i * 3 + 1] = s.pos.y;
        sPosArr[i * 3 + 2] = s.pos.z;

        sColArr[i * 3] = s.color.r * alpha;
        sColArr[i * 3 + 1] = s.color.g * alpha;
        sColArr[i * 3 + 2] = s.color.b * alpha;
      }
      // Zero out unused spark slots
      for (let i = sparks.length; i < maxSparks; i++) {
        sPosArr[i * 3] = 0;
        sPosArr[i * 3 + 1] = 0;
        sPosArr[i * 3 + 2] = 0;
        sColArr[i * 3] = 0;
        sColArr[i * 3 + 1] = 0;
        sColArr[i * 3 + 2] = 0;
      }
      sparkGeo.attributes.position.needsUpdate = true;
      sparkGeo.attributes.color.needsUpdate = true;

      // Matrix Rain Falling
      const pArr = particleGeo.attributes.position.array as Float32Array;
      for (let i = 1; i < particleCount * 3; i += 3) {
        pArr[i] -= 0.12;
        if (pArr[i] < -15) pArr[i] = 15;
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Transmutation Wave & Gold Evolution
      if (stageRef.current === 'transmuting' || stageRef.current === 'gold') {
        alchemyProgressRef.current = Math.min(alchemyProgressRef.current + delta * 0.95, 1.0);
        const p = alchemyProgressRef.current;

        // Shockwave expansion
        waveMesh.scale.set(1 + p * 28, 1 + p * 28, 1);
        waveMat.opacity = Math.max((1 - p) * 1.2, 0);

        // Turn Light from Cyan to Warm Radiant Gold
        centerLight.color.lerp(new THREE.Color(0xfde047), 0.08);
        centerLight.intensity = 4.5 + Math.sin(elapsed * 4) * 1.5;
        ambientLight.color.lerp(new THREE.Color(0x92400e), 0.06);

        // Transmute All Data Cubes into 24K Polished Gold
        interactiveCubes.forEach((item) => {
          item.outerBox.material = goldBoxMat;
          (item.wireframe.material as THREE.LineBasicMaterial).color.set(0xffea79);
          item.innerCore.material = goldCoreMat;
        });

        // Turn Matrix Rain into Gold Flakes
        const cArr = particleGeo.attributes.color.array as Float32Array;
        for (let i = 0; i < particleCount * 3; i += 3) {
          cArr[i] = THREE.MathUtils.lerp(cArr[i], 0.96, 0.08);
          cArr[i + 1] = THREE.MathUtils.lerp(cArr[i + 1], 0.82, 0.08);
          cArr[i + 2] = THREE.MathUtils.lerp(cArr[i + 2], 0.25, 0.08);
        }
        particleGeo.attributes.color.needsUpdate = true;

        // Reveal Golden Cap 3D in Center
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
      container.removeEventListener('click', handleCanvasClick);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      cubeGeo.dispose();
      edgeGeo.dispose();
      coreGeo.dispose();
      particleGeo.dispose();
      waveGeo.dispose();
      sparkGeo.dispose();
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
          {/* Titles & Graduate Honor (Removed pill badge per user request) */}
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
            💡 Chạm vào các khối dữ liệu hoàng kim 3D xung quanh để tương tác hoặc bấm nút để mở cổng
          </p>
        </div>
      )}
    </div>
  );
};
