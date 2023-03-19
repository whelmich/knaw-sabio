import { FunctionComponent, useEffect, useRef } from 'react';
import classnames from 'clsx';
import PercentageLabel from '../PercentageLabel/PercentageLabel';
import './Bar.scss';

interface Props {
  name: string;
  value: number;
  highlight?: boolean;
  onClick?: (name: string) => void;
  onHover?: (name: string) => void;
}

const Bar: FunctionComponent<Props> = ({
  name,
  value,
  highlight = false,
  onClick,
  onHover,
}) => {
  const hover = useRef(false);

  // clear hover on bar remove
  useEffect(() => {
    return () => {
      if (hover.current && onHover) {
        onHover('');
      }
    };
  }, [onHover]);

  return (
    <div
      className={classnames('Bar', { interactive: onHover, highlight })}
      onClick={() => {
        onClick && onClick(name);
      }}
      onMouseEnter={() => {
        if (onHover) {
          onHover(name);
          hover.current = true;
        }
      }}
      onMouseLeave={() => {
        if (onHover) {
          onHover('');
          hover.current = false;
        }
      }}
    >
      <div>
        <span className="name">{name}</span> <PercentageLabel value={value} />
      </div>
      <div className="bar">
        <div className="value" style={{ width: 100 * value + '%' }} />
      </div>
    </div>
  );
};

export default Bar;
