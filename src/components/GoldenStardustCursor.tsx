import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  spin: number;
  angle: number;
}

export const GoldenStardustCursor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Check if device supports hover/mouse (disable on purely touch screens)
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles: Particle[] = [];
    const colors = ['#D4AF37', '#F3E5AB', '#FFE082', '#FFFFFF', '#C5A059'];

    let mouseX = -100;
    let mouseY = -100;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Spawn 2-3 stardust particles per move
      const count = Math.random() < 0.6 ? 2 : 3;
      for (let i = 0; i < count; i++) {
        if (particles.length > 90) particles.shift(); // Limit max particles for 60fps
        particles.push({
          x: mouseX + (Math.random() - 0.5) * 8,
          y: mouseY + (Math.random() - 0.5) * 8,
          vx: (Math.random() - 0.5) * 1.4,
          vy: Math.random() * 0.9 + 0.3, // gently fall down
          size: Math.random() * 2.8 + 1.2,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          decay: Math.random() * 0.025 + 0.02,
          spin: (Math.random() - 0.5) * 0.15,
          angle: Math.random() * Math.PI * 2,
        });
      }
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize);

    // Draw 4-point golden star
    const drawStar = (x: number, y: number, radius: number, angle: number, color: string, alpha: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.shadowColor = '#D4AF37';
      ctx.shadowBlur = 6;

      ctx.beginPath();
      ctx.moveTo(0, -radius);
      ctx.quadraticCurveTo(radius * 0.15, -radius * 0.15, radius, 0);
      ctx.quadraticCurveTo(radius * 0.15, radius * 0.15, 0, radius);
      ctx.quadraticCurveTo(-radius * 0.15, radius * 0.15, -radius, 0);
      ctx.quadraticCurveTo(-radius * 0.15, -radius * 0.15, 0, -radius);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    let animationId: number;

    const render = (_time: number) => {
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.angle += p.spin;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        drawStar(p.x, p.y, p.size, p.angle, p.color, p.alpha);
      }

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
    />
  );
};
