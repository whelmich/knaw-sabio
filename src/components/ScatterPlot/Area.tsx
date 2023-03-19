import { FunctionComponent, useCallback } from 'react';

import { Graphics } from '@inlet/react-pixi';

interface Props {
  x: number;
  y: number;
  width: number;
  height: number;
  margin: number;
}

const Area: FunctionComponent<Props> = ({ x, y, width, height, margin }) => {
  const draw = useCallback(
    (g) => {
      g.clear();
      g.lineStyle(3, 0x183748, 0.1);
      g.drawRoundedRect(
        x + margin,
        y + margin,
        width - 2 * margin,
        height - 2 * margin,
        20
      );
    },
    [x, y, width, height, margin]
  );

  return <Graphics draw={draw} />;
};

export default Area;
