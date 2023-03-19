import { FunctionComponent, useCallback } from 'react';

import { Graphics } from '@inlet/react-pixi';

interface Props {
  x: number;
  y: number;
  width: number;
  height: number;
  lineWidth: number;
  color: number;
  opacity: number;
}

const Border: FunctionComponent<Props> = ({
  x,
  y,
  width,
  height,
  lineWidth,
  color,
  opacity,
}) => {
  const draw = useCallback(
    (g) => {
      g.clear();
      g.lineStyle(lineWidth, color, opacity);
      g.drawRect(x, y, width, height);
    },
    [width, height, x, y, lineWidth, color, opacity]
  );

  return <Graphics draw={draw} />;
};

export default Border;
