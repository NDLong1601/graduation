import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  animation?: 'fade-up' | 'scale' | 'slide-left' | 'slide-right';
  delay?: number; // ms
  className?: string;
  threshold?: number;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  animation = 'fade-up',
  delay = 0,
  className = '',
  threshold = 0.12,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const getAnimationClass = () => {
    switch (animation) {
      case 'scale':
        return 'reveal-scale';
      case 'slide-left':
        return 'reveal-left';
      case 'slide-right':
        return 'reveal-right';
      default:
        return 'reveal-fade-up';
    }
  };

  return (
    <div
      ref={ref}
      style={{
        transitionDelay: `${delay}ms`,
      }}
      className={`reveal-init ${getAnimationClass()} ${isVisible ? 'reveal-active' : ''} ${className}`}
    >
      {children}
    </div>
  );
};
