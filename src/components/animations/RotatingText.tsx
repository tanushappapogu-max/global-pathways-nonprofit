import React, { useState, useEffect } from 'react';

interface RotatingTextProps {
  texts: string[];
  className?: string;
  interval?: number;
}

export const RotatingText: React.FC<RotatingTextProps> = ({ 
  texts, 
  className = '', 
  interval = 3000 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % texts.length);
        setIsAnimating(false);
      }, 300);
    }, interval);

    return () => clearInterval(timer);
  }, [texts.length, interval]);

  return (
    <div className={`relative inline-block ${className}`}>
      <span
        className={`transition-all duration-300 ${
          isAnimating 
            ? 'opacity-0 transform -translate-y-2' 
            : 'opacity-100 transform translate-y-0'
        }`}
      >
        {texts[currentIndex]}
      </span>
    </div>
  );
};