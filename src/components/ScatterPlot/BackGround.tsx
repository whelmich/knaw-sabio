import { FunctionComponent, useRef } from 'react';
import { Sprite } from '@inlet/react-pixi';

import { Texture, Point, InteractionEvent } from 'pixi.js';

interface Props {
  width: number;
  height: number;
  onClick: () => void;
  onPointerMove: (e: InteractionEvent) => void;
}
const Background: FunctionComponent<Props> = ({
  width,
  height,
  onClick,
  onPointerMove,
}) => {
  const clickPos = useRef<Point | null>(null);
  const clickTime = useRef(0);
  return (
    <Sprite
      texture={Texture.WHITE}
      x={0}
      y={0}
      width={width}
      height={height}
      // tint={0xff0000}
      alpha={0}
      interactive={true}
      // Share pointer position
      pointermove={onPointerMove}
      // click on same location within 100ms
      pointerdown={(e) => {
        clickPos.current = e.data.global;
        clickTime.current = new Date().getTime();
      }}
      pointerup={(e) => {
        const dx = clickPos.current ? e.data.global.x - clickPos.current.x : 0;
        const dy = clickPos.current ? e.data.global.y - clickPos.current.y : 0;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const deltaTime = clickTime.current
          ? new Date().getTime() - clickTime.current
          : 0;
        if (distance < 5 && deltaTime < 100) {
          onClick();
        }
      }}
    />
  );
};

export default Background;
