import { FunctionComponent } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { ResultObject } from '../../interfaces/Result';

import ColumnHeader from '../ColumnHeader/ColumnHeader';
import Bar from '../Bar/Bar';
import LogoMark from '../Logo/LogoMark';

import './StatsColumn.scss';
import { getBarsFromResults } from '../../util/bars';
import { setHighlightWord, addQueryKeyword } from '../../util/events';

interface Props {
  results: Array<ResultObject>;
  hoverObject: ResultObject | null;
}

const StatsColumn: FunctionComponent<Props> = ({ results, hoverObject }) => {
  // Average result score
  const scoreAverage =
    results.length > 0
      ? results.reduce((sum, resultObject) => sum + resultObject.score, 0) /
        results.length
      : 0;

  // Max result score
  const scoreMax =
    results.length > 0
      ? results.reduce(
          (max, resultObject) =>
            resultObject.score > max ? resultObject.score : max,
          results[0].score
        )
      : 0;
  // Min result score
  const scoreMin =
    results.length > 0
      ? results.reduce(
          (min, resultObject) =>
            resultObject.score < min ? resultObject.score : min,
          results[0].score
        )
      : 0;

  // Bars
  const bars = getBarsFromResults({ resultObjects: results, unit: '%' });

  return (
    <div className="StatsColumn">
      {/* Header */}
      <ColumnHeader
        title={
          <>
            <LogoMark color="white" width={11} height={12} />
            <span style={{ paddingLeft: 10 }}>Indicator scores</span>
          </>
        }
      />

      <Scrollbars className="Scrollbar">
        {/* Global results stats */}
        <div className="global">
          <Bar name="Minimum" value={scoreMin} />
          <Bar name="Average" value={scoreAverage} />
          <Bar name="Maximum" value={scoreMax} />
        </div>

        {/* Detailed score */}
        <div className="scores">
          {bars.slice(0, 1000).map((bar, index) => (
            <Bar
              {...bar}
              key={index}
              onHover={setHighlightWord}
              onClick={addQueryKeyword}
              highlight={
                hoverObject
                  ? Object.keys(hoverObject.score_details).includes(bar.name)
                  : false
              }
            />
          ))}
        </div>
      </Scrollbars>
    </div>
  );
};

export default StatsColumn;
