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
  onUpdate?: (position: { x: number; y: number; rotation: number }) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  mode?: 'view' | 'edit';
  // 편집 모드에서 실시간 위치 업데이트를 비활성화하는 옵션 추가
  disableRealtimeUpdate?: boolean;
}

let globalZIndex = 1;

export default function DraggablePolaroid({
  children,
  defaultX = 0,
  defaultY = 0,
  defaultRotation = 0,
  width,
  height,
  onUpdate,
  onDragStart,
  onDragEnd,
  mode = 'view',
  disableRealtimeUpdate = false,
}: DraggablePolaroidProps) {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const totalRotationRef = useRef(defaultRotation);
  const polaroidRef = useRef<HTMLDivElement>(null);
  const [zIndex, setZIndex] = useState(() => {
    globalZIndex += 1;
    return globalZIndex;
  });

  // 초기 위치를 저장하는 ref (편집 모드에서 사용)
  const initialPositionRef = useRef({ x: defaultX, y: defaultY, rotation: defaultRotation });

  // useSpring을 사용하여 x, y, rotation 상태를 관리합니다.
  const [{ x, y, rotation }, api] = useSpring(() => ({
    x: defaultX,
    y: defaultY,
    rotation: defaultRotation,
    config: { tension: 300, friction: 30 },
  }));

  // 드래그 시작 시점의 현재 스프링 값을 저장합니다.
  const dragStartSpringValRef = useRef<{ x: number; y: number }>({ x: defaultX, y: defaultY });

  // 윈도우 크기 변경 감지 및 초기 설정
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    if (typeof window !== 'undefined') {
      handleResize();
      window.addEventListener('resize', handleResize);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  // prop이 변경될 때 위치 업데이트 로직을 조건부로 실행
  useEffect(() => {
    // 편집 모드이고 실시간 업데이트가 비활성화된 경우
    if (mode === 'edit' && disableRealtimeUpdate) {
      // 초기 위치만 설정하고, 이후 prop 변경은 무시
      if (
        initialPositionRef.current.x === defaultX &&
        initialPositionRef.current.y === defaultY &&
        initialPositionRef.current.rotation === defaultRotation
      ) {
        api.start({ x: defaultX, y: defaultY, rotation: defaultRotation });
        totalRotationRef.current = defaultRotation;
        dragStartSpringValRef.current = { x: defaultX, y: defaultY };
      }
      return;
    }

    // 일반적인 경우 (보기 모드 또는 실시간 업데이트 활성화)
    api.start({ x: defaultX, y: defaultY, rotation: defaultRotation });
    totalRotationRef.current = defaultRotation;
    dragStartSpringValRef.current = { x: defaultX, y: defaultY };
    initialPositionRef.current = { x: defaultX, y: defaultY, rotation: defaultRotation };
  }, [defaultX, defaultY, defaultRotation, api, mode, disableRealtimeUpdate]);

  const bind = useGesture(
    {
      onDragStart: () => {
        if (mode !== 'edit') return;
        dragStartSpringValRef.current = { x: x.get(), y: y.get() };
        globalZIndex += 1;
        setZIndex(globalZIndex);
        if (onDragStart) onDragStart();
      },
      onDrag: ({ active, movement: [mx, my], event }) => {
        if (mode !== 'edit') return;
        if (!windowSize.width || !windowSize.height) return;

        let newX = dragStartSpringValRef.current.x + mx;
        let newY = dragStartSpringValRef.current.y + my;

        // 경계 제한
        newX = Math.min(Math.max(newX, 0), windowSize.width - width);

        const scrollThreshold = 100;
        const scrollSpeed = 10;

        let pointerY = 0;
        const e = event as any;

        if (e.touches && e.touches.length > 0) {
          pointerY = e.touches[0].clientY;
        } else if (typeof e.clientY === 'number') {
          pointerY = e.clientY;
        } else {
          pointerY = 0;
        }

        const distanceToBottom = window.innerHeight - pointerY;
        const distanceToTop = pointerY;

        // 하단 자동 스크롤
        if (distanceToBottom < scrollThreshold) {
          const scrollBottomLimit = document.documentElement.scrollHeight - window.innerHeight;
          const currentScroll = window.scrollY;

          if (currentScroll < scrollBottomLimit) {
            window.scrollBy({ top: scrollSpeed, behavior: 'auto' });
            newY += scrollSpeed;
          }
        }

        // 상단 자동 스크롤
        if (distanceToTop < scrollThreshold) {
          const currentScroll = window.scrollY;

          if (currentScroll > 0) {
            window.scrollBy({ top: -scrollSpeed, behavior: 'auto' });
            newY -= scrollSpeed;
          }
        }

        api.start({ x: newX, y: newY, immediate: active });
      },
      onDragEnd: () => {
        if (mode !== 'edit') return;
        if (!windowSize.width || !windowSize.height) return;

        if (onUpdate) {
          onUpdate({
            x: x.get(),
            y: y.get(),
            rotation: totalRotationRef.current,
          });
        }
        if (onDragEnd) onDragEnd();
      },

      onPinch: ({ da: [, angle] }) => {
        if (mode !== 'edit') return;

        const newRotation = totalRotationRef.current + angle;
        api.start({ rotation: newRotation });
      },
      onPinchEnd: () => {
        if (mode !== 'edit') return;

        totalRotationRef.current = rotation.get();
        if (onUpdate) {
          onUpdate({
            x: x.get(),
            y: y.get(),
            rotation: totalRotationRef.current,
          });
        }
      },
    },
    {
      drag: { pointer: { touch: true }, enabled: mode === 'edit' },
      pinch: { pointer: { touch: true }, from: () => [0, 0], enabled: mode === 'edit' },
    }
  );

  if (windowSize.width === 0 || windowSize.height === 0) return null;

  return (
    <animated.div
      {...(mode === 'edit' ? bind() : {})}
      ref={polaroidRef}
      style={{
        x,
        y,
        rotateZ: rotation,
        position: 'absolute',
        width: width,
        height: height,
        touchAction: mode === 'edit' ? 'none' : 'auto',
        zIndex,
        cursor: mode === 'edit' ? 'move' : 'default',
      }}
    >
      {children}
    </animated.div>
  );
}
