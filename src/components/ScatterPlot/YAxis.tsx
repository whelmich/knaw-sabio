import { FunctionComponent, memo } from 'react';
import LogoMark from '../Logo/LogoMark';
import './YAxis.scss';
import colors from '../../config/colors';

interface Props {
  title: string;
  maxValue: string;
  minValue: string;
  offsetY: number;
}
const YAxis: FunctionComponent<Props> = ({
  title,
  maxValue,
  minValue,
  offsetY,
}) => {
  return (
    <div className="YAxis">
      {/* Title */}
      <div
        className="title"
        style={{
          transform:
            'rotate(-90deg) translateX(-' +
            (offsetY + title.length * 6) +
            'px)',
        }}
      >
        <LogoMark color={colors.PRIMARY} width={11} height={11} />
        <span>{title}</span>
      </div>
      {/* max Value */}
      {maxValue !== '' && <div className="max">{maxValue}</div>}
      {/* min Value */}
      {minValue !== '' && <div className="min">{minValue}</div>}
    </div>
  );
};

export default memo(YAxis);
