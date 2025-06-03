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
}

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
}: DraggablePolaroidProps) {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const totalRotationRef = useRef(defaultRotation);
  const polaroidRef = useRef<HTMLDivElement>(null);

  // useSpring을 사용하여 x, y, rotation 상태를 관리합니다.
  // 이 상태는 드래그에 의해 변경되는 실제 위치입니다.
  const [{ x, y, rotation }, api] = useSpring(() => ({
    x: defaultX,
    y: defaultY,
    rotation: defaultRotation,
    config: { tension: 300, friction: 30 },
  }));

  // 드래그 시작 시점의 현재 스프링 값(x.get(), y.get())을 저장합니다.
  // 이는 `movement`가 이 시작점으로부터의 상대적인 이동을 나타내기 때문에 중요합니다.
  const dragStartSpringValRef = useRef<{ x: number; y: number }>({ x: defaultX, y: defaultY });

  // 윈도우 크기 변경 감지 및 초기 설정
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    if (typeof window !== 'undefined') {
      handleResize(); // 컴포넌트 마운트 시 초기 크기 설정
      window.addEventListener('resize', handleResize);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  // `defaultX`, `defaultY`, `defaultRotation` prop이 변경될 때만 스프링 상태를 업데이트합니다.
  // 이는 `MemoryPage`에서 추억 목록이 업데이트되거나, 로딩 시점에 초기 위치를 설정하는 경우에만 발동되어야 합니다.
  // 드래그 중에는 이펙트가 발동되지 않아야 다른 아이템의 이동에 영향을 주지 않습니다.
  // `useSpring`의 `api.start`를 사용하여 값을 변경하므로, 이펙트 내부에서 직접 `api.start`를 호출합니다.
  useEffect(() => {
    api.start({ x: defaultX, y: defaultY, rotation: defaultRotation });
    totalRotationRef.current = defaultRotation; // 회전값도 동기화
    dragStartSpringValRef.current = { x: defaultX, y: defaultY }; // 드래그 시작점도 초기화
  }, [defaultX, defaultY, defaultRotation, api]); // api도 의존성 배열에 포함

  const bind = useGesture(
    {
      onDragStart: () => {
        // 드래그 시작 시, 현재 스프링의 애니메이션된 값을 참조하여 저장합니다.
        // `movement`는 이 시점부터의 상대적인 이동 거리를 제공할 것입니다.
        dragStartSpringValRef.current = { x: x.get(), y: y.get() };
        if (onDragStart) onDragStart();
      },
      onDrag: ({ active, movement: [mx, my] }) => {
        if (!windowSize.width || !windowSize.height) return;

        // 드래그 시작 시점의 값 (dragStartSpringValRef)에 이동량(mx, my)을 더하여
        // 현재 드래그 중인 위치를 계산합니다.
        let newX = dragStartSpringValRef.current.x + mx;
        let newY = dragStartSpringValRef.current.y + my;

        // 경계 제한
        newX = Math.min(Math.max(newX, 0), windowSize.width - width);
        newY = Math.min(Math.max(newY, 0), windowSize.height - height);

        // 스프링 상태를 업데이트합니다. `immediate: active`는 드래그 중 부드러운 애니메이션을 끕니다.
        api.start({ x: newX, y: newY, immediate: active });
      },
      onDragEnd: () => {
        if (!windowSize.width || !windowSize.height) return;

        // 드래그 종료 시, 스프링의 최종 값을 가져와 onUpdate로 전달합니다.
        // `x.get()`과 `y.get()`은 `onDrag`에서 이미 경계 제한이 적용된 최종 위치를 가지고 있습니다.
        if (onUpdate) {
          onUpdate({
            x: x.get(),
            y: y.get(),
            rotation: totalRotationRef.current, // 마지막 회전값 전달
          });
        }
        if (onDragEnd) onDragEnd();
      },

      onPinch: ({ da: [, angle] }) => {
        const newRotation = totalRotationRef.current + angle;
        api.start({ rotation: newRotation });
      },
      onPinchEnd: () => {
        totalRotationRef.current = rotation.get(); // 최종 회전 값 업데이트
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
      drag: { pointer: { touch: true } },
      pinch: { pointer: { touch: true }, from: () => [0, 0] }, // 핀치 시작 시 기준 각도/거리 설정
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
        rotateZ: rotation, // rotateZ 사용
        position: 'absolute', // 절대 위치로 설정하여 겹치지 않게 함
        width: width,
        height: height,
        touchAction: 'none', // 모바일에서 스크롤 방지 (중요!)
        // zIndex: x.to((val) => (val === x.get() && y.get() === y.get() ? 100 : 1)), // 드래그 시 맨 앞으로 (선택 사항)
      }}
    >
      {children}
    </animated.div>
  );
}
