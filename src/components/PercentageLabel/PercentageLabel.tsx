import { FunctionComponent } from 'react';
import './PercentageLabel.scss';
import { floatToPercentage } from '../../util/numbers';

interface Props {
  value: number;
  decimals?: number;
}

const PercentageLabel: FunctionComponent<Props> = ({ value, decimals = 1 }) => {
  const percentage = floatToPercentage(value, decimals);

  return (
    <span className="PercentageLabel">
      {percentage}
      <span>%</span>
    </span>
  );
};

export default PercentageLabel;
