import { FunctionComponent } from 'react';
import ReactTooltip from 'react-tooltip';

import colors from '../../config/colors';

import './HelpTooltip.scss';

interface Props {
  description: string;
  char?: string;
}

const HelpTooltip: FunctionComponent<Props> = ({ description, char = '?' }) => {
  return (
    <span className="HelpTooltip">
      <span data-tip={description}>{char}</span>
      <ReactTooltip
        place="right"
        type="dark"
        effect="solid"
        delayShow={100}
        delayHide={200}
        backgroundColor={colors.BLACK}
      />
    </span>
  );
};

export default HelpTooltip;
