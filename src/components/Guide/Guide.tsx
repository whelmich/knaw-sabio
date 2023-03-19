import { FunctionComponent } from 'react';
import classnames from 'clsx';

import './Guide.scss';
import {
  COLUMN_HEADER_HEIGHT,
  COLUMN_WIDTH,
  HEADER_HEIGHT,
} from '../../config/constants';

interface Props {
  value: string;
  x?: number;
  y?: number;
  vertical?: boolean;
  horizontal?: boolean;
}

const Guide: FunctionComponent<Props> = ({
  value,
  horizontal = true,
  vertical = false,
  x = 0,
  y = 0,
}) => {
  return (
    <div
      className={classnames('Guide', {
        horizontal: horizontal && !vertical,
        vertical,
        xLow: x < window.innerWidth / 2 - COLUMN_WIDTH,
        yLow:
          y < (window.innerHeight - COLUMN_HEADER_HEIGHT - HEADER_HEIGHT) / 2,
      })}
      style={{ transform: `translate(${x}px,${y}px)` }}
    >
      <div>{value}</div>
    </div>
  );
};

export default Guide;
