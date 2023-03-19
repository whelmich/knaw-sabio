import debounce from 'debounce';
import { useEffect, useState } from 'react';
import { EVENT_UPDATE_MOUSE } from '../config/constants';
import { MouseUpdateEvent } from '../interfaces/Events';
import { WorldPoint } from '../interfaces/WorldPoint';

type MousePosHook = () => WorldPoint;

export const useMousePos: MousePosHook = () => {
  const [position, setPosition] = useState<WorldPoint>({
    x: 0,
    y: 0,
    globalX: 0,
    globalY: 0,
  });

  // Update position from MouseUpdateEvent
  useEffect(() => {
    const onUpdateMouse = debounce((e: CustomEvent<MouseUpdateEvent>) => {
      if (!e.detail.position) {
        return;
      }
      const { x, y } = e.detail.position;
      const globalX = e.detail.globalPosition.x;
      const globalY = e.detail.globalPosition.y;
      setPosition({ x, y, globalX, globalY });
    }, 10) as unknown as EventListener & { clear(): void };

    window.addEventListener(EVENT_UPDATE_MOUSE, onUpdateMouse);
    return () => {
      onUpdateMouse.clear();
      window.removeEventListener(EVENT_UPDATE_MOUSE, onUpdateMouse);
    };
  }, []);

  return position;
};

export default useMousePos;
