import React, { useEffect, useRef, useState } from 'react';

interface AnimatedListProps {
  items: Array<{
    id: string | number;
    content: React.ReactNode;
  }>;
  className?: string;
  delay?: number;
}

export const AnimatedList: React.FC<AnimatedListProps> = ({ 
  items, 
  className = '', 
  delay = 100 
}) => {
  const [visibleItems, setVisibleItems] = useState<Set<string | number>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const itemId = entry.target.getAttribute('data-item-id');
            if (itemId) {
              setTimeout(() => {
                setVisibleItems(prev => new Set([...prev, itemId]));
              }, delay);
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [delay]);

  useEffect(() => {
    const elements = document.querySelectorAll('[data-item-id]');
    elements.forEach(el => {
      if (observerRef.current) {
        observerRef.current.observe(el);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [items]);

  return (
    <div className={className}>
      {items.map((item, index) => (
        <div
          key={item.id}
          data-item-id={item.id}
          className={`transition-all duration-700 ease-out ${
            visibleItems.has(item.id)
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-8 scale-95'
          }`}
          style={{
            transitionDelay: `${index * 100}ms`,
          }}
        >
          {item.content}
        </div>
      ))}
    </div>
  );
};