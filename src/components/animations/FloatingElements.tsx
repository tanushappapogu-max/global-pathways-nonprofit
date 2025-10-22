import React, { useEffect, useRef } from 'react';

interface FloatingElementsProps {
  className?: string;
  count?: number;
}

export const FloatingElements: React.FC<FloatingElementsProps> = ({ 
  className = '', 
  count = 6 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const elements = container.children;
    
    Array.from(elements).forEach((element, index) => {
      const htmlElement = element as HTMLElement;
      htmlElement.style.animationDelay = `${index * 0.5}s`;
      htmlElement.style.animationDuration = `${6 + Math.random() * 4}s`;
    });
  }, []);

  const shapes = ['circle', 'square', 'triangle'];
  const colors = ['bg-blue-200', 'bg-purple-200', 'bg-pink-200', 'bg-green-200', 'bg-yellow-200'];

  return (
    <div ref={containerRef} className={`fixed inset-0 overflow-hidden pointer-events-none ${className}`}>
      {Array.from({ length: count }).map((_, index) => {
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * 100 + 50;
        const left = Math.random() * 100;
        const top = Math.random() * 100;

        return (
          <div
            key={index}
            className={`absolute ${color} opacity-20 animate-float`}
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: `${size}px`,
              height: `${size}px`,
              borderRadius: shape === 'circle' ? '50%' : shape === 'triangle' ? '0' : '10px',
              clipPath: shape === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 'none',
            }}
          />
        );
      })}
      <style jsx>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
            opacity: 0.2;
          }
          25% { 
            transform: translateY(-20px) rotate(90deg); 
            opacity: 0.3;
          }
          50% { 
            transform: translateY(-40px) rotate(180deg); 
            opacity: 0.2;
          }
          75% { 
            transform: translateY(-20px) rotate(270deg); 
            opacity: 0.3;
          }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};