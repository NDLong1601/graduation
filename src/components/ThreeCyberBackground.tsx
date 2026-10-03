import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ThreeCyberBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 25;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    // 2. Interactive 3D Constellation Nodes (Connected by Cyber Laser Lines)
    const particleCount = window.innerWidth < 768 ? 55 : 95;
    const maxDistance = 4.2;

    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities: { x: number; y: number; z: number }[] = [];

    const bounds = { x: 20, y: 15, z: 12 };

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * bounds.x * 2;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * bounds.y * 2;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * bounds.z * 2;

      particleVelocities.push({
        x: (Math.random() - 0.5) * 0.015,
        y: (Math.random() - 0.5) * 0.015,
        z: (Math.random() - 0.5) * 0.015,
      });
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    // Cyan glowing particles
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x00f5d4,
      size: 0.16,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // 3. Dynamic Laser Lines Geometry
    const maxLineSegments = (particleCount * (particleCount - 1)) / 2;
    const linePositions = new Float32Array(maxLineSegments * 6);
    const lineColors = new Float32Array(maxLineSegments * 6);

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3).setUsage(THREE.DynamicDrawUsage));
    lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3).setUsage(THREE.DynamicDrawUsage));

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
    });

    const lineSegments = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lineSegments);

    // 4. Distant Cyber Cosmic Dust (Deep Stars)
    const starCount = 300;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 60;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 60;
      starPositions[i * 3 + 2] = -15 + (Math.random() - 0.5) * 30;
    }
    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({
      color: 0xa855f7,
      size: 0.1,
      transparent: true,
      opacity: 0.5,
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // 5. Mouse & Scroll Interaction Tracking
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let scrollY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const onScroll = () => {
      scrollY = window.scrollY;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    // 6. Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Camera responds gently to mouse and scroll position
      camera.position.x = mouse.x * 2.5;
      camera.position.y = mouse.y * 1.8 - scrollY * 0.003;
      camera.lookAt(0, -scrollY * 0.003, 0);

      // Slow rotation for background cosmic stars
      stars.rotation.y += 0.0003;
      stars.rotation.x += 0.0001;

      // Update particle positions
      const positions = particleGeometry.attributes.position.array as Float32Array;
      let lineVertexIndex = 0;
      let colorIndex = 0;

      for (let i = 0; i < particleCount; i++) {
        // Move particle
        positions[i * 3] += particleVelocities[i].x;
        positions[i * 3 + 1] += particleVelocities[i].y;
        positions[i * 3 + 2] += particleVelocities[i].z;

        // Bounce within bounding box
        if (Math.abs(positions[i * 3]) > bounds.x) particleVelocities[i].x *= -1;
        if (Math.abs(positions[i * 3 + 1]) > bounds.y) particleVelocities[i].y *= -1;
        if (Math.abs(positions[i * 3 + 2]) > bounds.z) particleVelocities[i].z *= -1;

        // Check distance to other particles to draw lines
        for (let j = i + 1; j < particleCount; j++) {
          const dx = positions[i * 3] - positions[j * 3];
          const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
          const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < maxDistance) {
            // Line from particle i to j
            linePositions[lineVertexIndex++] = positions[i * 3];
            linePositions[lineVertexIndex++] = positions[i * 3 + 1];
            linePositions[lineVertexIndex++] = positions[i * 3 + 2];

            linePositions[lineVertexIndex++] = positions[j * 3];
            linePositions[lineVertexIndex++] = positions[j * 3 + 1];
            linePositions[lineVertexIndex++] = positions[j * 3 + 2];

            // Color gradient (Cyan to Purple) based on distance
            const alpha = 1 - dist / maxDistance;
            lineColors[colorIndex++] = 0.02 * alpha; // R
            lineColors[colorIndex++] = 0.96 * alpha; // G
            lineColors[colorIndex++] = 0.83 * alpha; // B

            lineColors[colorIndex++] = 0.65 * alpha; // R
            lineColors[colorIndex++] = 0.33 * alpha; // G
            lineColors[colorIndex++] = 0.96 * alpha; // B
          }
        }
      }

      particleGeometry.attributes.position.needsUpdate = true;

      // Update line geometry count
      lineGeometry.setDrawRange(0, lineVertexIndex / 3);
      lineGeometry.attributes.position.needsUpdate = true;
      lineGeometry.attributes.color.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // 7. Window Resize
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      particleGeometry.dispose();
      particleMaterial.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      starGeometry.dispose();
      starMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-60"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
