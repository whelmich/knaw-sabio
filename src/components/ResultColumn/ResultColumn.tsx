import { FunctionComponent } from 'react';

import { Result, ResultObject } from '../../interfaces/Result';
import { Dataset } from '../../interfaces/Dataset';
import { Query } from '../../interfaces/Query';

import { floatToPercentage, formatInt } from '../../util/numbers';

import ColumnHeader from '../ColumnHeader/ColumnHeader';
import Visual from '../Visual/Visual';
import LogoMark from '../Logo/LogoMark';

import './ResultColumn.scss';
import { EVENT_RESET_VIEWPORT } from '../../config/constants';
import { Point } from '../../interfaces/Point';
import classnames from 'clsx';
import colors from '../../config/colors';
import Guides from '../Guides/Guides';

interface Props {
  view: string;
  attribute: number | null;
  loading: boolean;
  dataset: Dataset;
  result: Result | null;
  query: Query | null;
  mousePos: React.MutableRefObject<Point>;
  hoverObject: ResultObject | null;
  selectedObject: ResultObject | null;
  setSelectedObject: (object: ResultObject | null) => void;
  setVisibleObjects: (objects: Array<ResultObject>) => void;
  setHoverObject: (object: ResultObject | null) => void;
  setAttribute: (attribute: number) => void;
}

const ResultColumn: FunctionComponent<Props> = ({
  view,
  attribute,
  dataset,
  result,
  query,
  mousePos,
  hoverObject,
  selectedObject,
  loading,
  setSelectedObject,
  setVisibleObjects,
  setHoverObject,
  setAttribute,
}) => {
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    mousePos.current.x = e.pageX;
    mousePos.current.y = e.pageY;
  };

  return (
    <div
      className={classnames('ResultColumn', { loading })}
      onMouseMove={onMouseMove}
    >
      <ResultColumnHeader dataset={dataset} result={result} />

      <Visual
        query={query}
        result={result}
        view={view}
        attribute={attribute || 0}
        selectedObject={selectedObject}
        setSelectedObject={setSelectedObject}
        setVisibleObjects={setVisibleObjects}
        setHoverObject={setHoverObject}
        setAttribute={setAttribute}
      />

      {loading && <LogoMark width={80} height={80} color={colors.SECONDARY} />}

      <Guides
        result={result}
        query={query}
        attribute={attribute || 0}
        hoverObject={hoverObject}
      />
    </div>
  );
};

interface HeaderProps {
  dataset: Dataset;
  result: Result | null;
}

const resetViewport = () => {
  const event = new CustomEvent(EVENT_RESET_VIEWPORT);
  window.dispatchEvent(event);
};

const ResultColumnHeader: FunctionComponent<HeaderProps> = ({
  dataset,
  result,
}) => {
  const resultCount = result !== null ? result.results.length : 0;
  const percentage = resultCount / dataset.object_count;

  return (
    <ColumnHeader
      title={
        <>
          Results{' '}
          {result !== null && (
            <>
              <span className="count">{formatInt(resultCount)}</span>
              <span className="total">
                {' '}
                / {formatInt(dataset.object_count)}{' '}
              </span>
              {resultCount > 0 && (
                <span className="percentages">
                  ({floatToPercentage(percentage, 1)}%)
                </span>
              )}
            </>
          )}
        </>
      }
    >
      <div
        className="reset-viewport"
        onClick={resetViewport}
        title="Reset viewport"
      />
    </ColumnHeader>
  );
};

export default ResultColumn;
