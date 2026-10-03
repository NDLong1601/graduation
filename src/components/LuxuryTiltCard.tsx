import React, { useRef, useState, useCallback } from 'react';

interface LuxuryTiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  enableGlow?: boolean;
}

export const LuxuryTiltCard: React.FC<LuxuryTiltCardProps> = ({
  children,
  className = '',
  maxTilt = 7,
  enableGlow = true,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<{
    transform: string;
    glowPos: { x: number; y: number; opacity: number };
  }>({
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
    glowPos: { x: 50, y: 50, opacity: 0 },
  });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const card = cardRef.current;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -maxTilt;
      const rotateY = ((x - centerX) / centerX) * maxTilt;

      const glowX = (x / rect.width) * 100;
      const glowY = (y / rect.height) * 100;

      setStyle({
        transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.01, 1.01, 1.01)`,
        glowPos: { x: glowX, y: glowY, opacity: 1 },
      });
    },
    [maxTilt]
  );

  const handleMouseLeave = useCallback(() => {
    setStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      glowPos: { x: 50, y: 50, opacity: 0 },
    });
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: style.transform,
        transition: 'transform 0.15s ease-out, box-shadow 0.25s ease-out',
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }}
      className={`relative overflow-hidden group ${className}`}
      {...props}
    >
      {/* Dynamic Metallic Gold Sheen Layer */}
      {enableGlow && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-10"
          style={{
            opacity: style.glowPos.opacity,
            background: `radial-gradient(circle 350px at ${style.glowPos.x}% ${style.glowPos.y}%, rgba(212, 175, 55, 0.22) 0%, rgba(255, 255, 255, 0.15) 35%, transparent 70%)`,
          }}
        />
      )}
      {children}
    </div>
  );
};
