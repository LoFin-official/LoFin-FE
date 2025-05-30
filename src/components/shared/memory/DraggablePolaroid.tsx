'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useGesture } from '@use-gesture/react';

interface DraggablePolaroidProps {
  children: React.ReactNode;
  defaultX?: number;
  defaultY?: number;
  defaultRotation?: number;
  width: number;
  height: number;
}

export default function DraggablePolaroid({ children, defaultX = 0, defaultY = 0, defaultRotation = 0, width, height }: DraggablePolaroidProps) {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const totalRotationRef = useRef(defaultRotation);
  const polaroidRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [{ x, y, rotation }, api] = useSpring(() => ({
    x: defaultX,
    y: defaultY,
    rotation: defaultRotation,
  }));

  const bind = useGesture(
    {
      // 한 손가락 드래그
      onDrag: ({ offset: [dx, dy], touches }) => {
        if (touches > 1) return; // 두 손가락 이상일 경우 무시
        const newX = defaultX + dx;
        const newY = defaultY + dy;
        const limitedX = Math.min(Math.max(newX, 0), windowSize.width - width);
        const limitedY = Math.min(Math.max(newY, 0), windowSize.height - height);
        api.start({ x: limitedX, y: limitedY });
      },

      // 두 손가락 회전
      onPinch: ({ da: [, angle] }) => {
        const newRotation = totalRotationRef.current + angle;
        api.start({ rotation: newRotation });
      },

      onPinchEnd: () => {
        totalRotationRef.current = rotation.get();
      },
    },
    {
      drag: { pointer: { touch: true } },
      pinch: { pointer: { touch: true }, from: () => [0, 0] },
    }
  );

  if (windowSize.width === 0 || windowSize.height === 0) return null;

  return (
    <animated.div
      {...bind()}
      ref={polaroidRef}
      style={{
        x,
        y,
        rotate: rotation,
        position: 'absolute',
        width,
        height,
        cursor: 'grab',
        touchAction: 'none',
        userSelect: 'none',
        transformOrigin: 'center center',
      }}
    >
      {children}
    </animated.div>
  );
}
