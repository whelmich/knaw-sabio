import { FunctionComponent } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import classnames from 'clsx';
import { ResultObject } from '../../interfaces/Result';

import ColumnHeader from '../ColumnHeader/ColumnHeader';
import Bar from '../Bar/Bar';
import ToggleBox from '../ToggleBox/ToggleBox';

import ObjectDetailsComponent from '../ObjectDetails/ObjectDetails';
import LogoMark from '../Logo/LogoMark';
import { ObjectDetails } from '../../interfaces/ObjectDetails';
import { getBarsFromResults } from '../../util/bars';
import colors from '../../config/colors';
import { setHighlightWord, addQueryKeyword } from '../../util/events';

import './ObjectDetailsColumn.scss';

interface Props {
  resultObject: ResultObject;
  objectDetails: ObjectDetails;
  loading: boolean;
  highlightExactWords: boolean;
  onClose: () => void;
}

const ObjectDetailsColumn: FunctionComponent<Props> = ({
  resultObject,
  objectDetails,
  highlightExactWords,
  loading,
  onClose,
}) => {
  // Bars
  const bars = getBarsFromResults({ resultObjects: [resultObject], unit: '%' });

  return (
    <div className={classnames('ObjectDetailsColumn', { loading })}>
      {/* Header */}
      <ColumnHeader title="Object details">
        <div className="close" onClick={onClose} />
      </ColumnHeader>

      <Scrollbars className="Scrollbar">
        {objectDetails !== null && (
          <ObjectDetailsComponent
            object={objectDetails}
            score={resultObject.score}
            highlightWords={Object.keys(resultObject.score_details)}
            highlightExactWords={highlightExactWords}
          />
        )}
        {/* Indicator core */}
        <ToggleBox
          title={
            <>
              <LogoMark color={colors.PRIMARY} width={11} height={12} />
              <span style={{ paddingLeft: 10 }}>Indicator scores</span>
            </>
          }
        >
          {bars.slice(0, 1000).map((bar, index) => (
            <Bar
              {...bar}
              key={index}
              onHover={setHighlightWord}
              onClick={addQueryKeyword}
            />
          ))}
        </ToggleBox>
      </Scrollbars>
    </div>
  );
};

export default ObjectDetailsColumn;
