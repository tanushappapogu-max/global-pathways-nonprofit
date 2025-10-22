import React from 'react';

interface AnimatedThreadsProps {
  className?: string;
  count?: number;
}

export const AnimatedThreads: React.FC<AnimatedThreadsProps> = ({ 
  className = '', 
  count = 8 
}) => {
  return (
    <div className={`fixed inset-0 overflow-hidden pointer-events-none ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="absolute animate-float opacity-10"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 200 + 100}px`,
            height: '2px',
            background: `linear-gradient(90deg, transparent, ${
              ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981'][Math.floor(Math.random() * 4)]
            }, transparent)`,
            transform: `rotate(${Math.random() * 360}deg)`,
            animationDelay: `${index * 0.5}s`,
            animationDuration: `${8 + Math.random() * 4}s`,
          }}
        />
      ))}
    </div>
  );
};