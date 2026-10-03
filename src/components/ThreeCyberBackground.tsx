import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ThreeCyberBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 18;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    // 2. Lighting for Gold Leaves
    const ambientLight = new THREE.AmbientLight(0xfffdf5, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xd4af37, 2.0);
    dirLight1.position.set(5, 8, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight2.position.set(-5, -4, 4);
    scene.add(dirLight2);

    // 3. Gold Leaf Flakes Instanced Mesh (Mảnh vàng lá chân thực)
    const count = window.innerWidth < 768 ? 45 : 85;
    
    // Irregular diamond/petal geometry for gold leaf
    const leafGeo = new THREE.PlaneGeometry(0.35, 0.5, 2, 2);
    // slightly bend vertices for organic curvature
    const posAttr = leafGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const z = (Math.random() - 0.5) * 0.08;
      posAttr.setZ(i, z);
    }
    leafGeo.computeVertexNormals();

    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.9,
      roughness: 0.25,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.82,
    });

    const instancedMesh = new THREE.InstancedMesh(leafGeo, goldMaterial, count);
    scene.add(instancedMesh);

    // Physics state for each flake
    interface FlakeData {
      pos: THREE.Vector3;
      rot: THREE.Euler;
      rotSpeed: THREE.Vector3;
      vel: THREE.Vector3;
      swayOffset: number;
      scale: number;
    }

    const bounds = { x: 16, y: 12, z: 8 };
    const flakes: FlakeData[] = [];

    for (let i = 0; i < count; i++) {
      const flake: FlakeData = {
        pos: new THREE.Vector3(
          (Math.random() - 0.5) * bounds.x * 2,
          (Math.random() - 0.5) * bounds.y * 2,
          (Math.random() - 0.5) * bounds.z * 2
        ),
        rot: new THREE.Euler(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        ),
        rotSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.025,
          (Math.random() - 0.5) * 0.015
        ),
        vel: new THREE.Vector3(
          (Math.random() - 0.5) * 0.005,
          -(Math.random() * 0.012 + 0.006), // downward gravity drift
          (Math.random() - 0.5) * 0.005
        ),
        swayOffset: Math.random() * Math.PI * 2,
        scale: Math.random() * 0.6 + 0.5,
      };
      flakes.push(flake);
    }

    // 4. Mouse Tracking & Wind Force
    const mouse3D = new THREE.Vector3(0, 0, 0);
    const prevMouse3D = new THREE.Vector3(0, 0, 0);
    const mouseVel = new THREE.Vector3(0, 0, 0);
    let scrollY = 0;

    const onMouseMove = (e: MouseEvent) => {
      // Unproject to approximate 3D world plane at z=0
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;

      prevMouse3D.copy(mouse3D);
      mouse3D.set(normX * (bounds.x * 0.8), normY * (bounds.y * 0.8), 0);
      mouseVel.subVectors(mouse3D, prevMouse3D);
    };

    const onScroll = () => {
      scrollY = window.scrollY;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    // 5. Animation Loop
    let animationId: number;
    const dummy = new THREE.Object3D();
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Camera gently tracks scroll
      camera.position.y = -scrollY * 0.0018;

      // Update Flakes Physics
      for (let i = 0; i < count; i++) {
        const f = flakes[i];

        // Organic falling & swaying
        f.pos.y += f.vel.y;
        f.pos.x += Math.sin(time * 0.8 + f.swayOffset) * 0.006;
        f.pos.z += Math.cos(time * 0.6 + f.swayOffset) * 0.004;

        // 3D Rotation tumbling
        f.rot.x += f.rotSpeed.x;
        f.rot.y += f.rotSpeed.y;
        f.rot.z += f.rotSpeed.z;

        // Wind Impulse from Mouse: push flakes away when cursor moves near them
        const dist = f.pos.distanceTo(mouse3D);
        if (dist < 4.5 && mouseVel.lengthSq() > 0.001) {
          const pushForce = (4.5 - dist) * 0.012;
          const pushDir = f.pos.clone().sub(mouse3D).normalize();
          f.pos.addScaledVector(pushDir, pushForce);
          f.rotSpeed.x += (Math.random() - 0.5) * 0.05;
          f.rotSpeed.y += (Math.random() - 0.5) * 0.05;
        }

        // Wrap around top/bottom and sides
        if (f.pos.y < -bounds.y - camera.position.y) {
          f.pos.y = bounds.y - camera.position.y;
          f.pos.x = (Math.random() - 0.5) * bounds.x * 2;
        }
        if (f.pos.x > bounds.x) f.pos.x = -bounds.x;
        if (f.pos.x < -bounds.x) f.pos.x = bounds.x;

        // Set transformation matrix
        dummy.position.copy(f.pos);
        dummy.rotation.copy(f.rot);
        dummy.scale.setScalar(f.scale);
        dummy.updateMatrix();

        instancedMesh.setMatrixAt(i, dummy.matrix);
      }

      instancedMesh.instanceMatrix.needsUpdate = true;
      renderer.render(scene, camera);
    };

    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      leafGeo.dispose();
      goldMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-90"
    />
  );
};
