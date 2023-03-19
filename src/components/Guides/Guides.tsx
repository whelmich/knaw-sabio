import { FunctionComponent, useRef } from 'react';
import classnames from 'clsx';

import './Guides.scss';
import Guide from '../Guide/Guide';
import useMousePos from '../../hooks/useMousePos';
import { Result, ResultObject } from '../../interfaces/Result';
import { Query } from '../../interfaces/Query';
import { floatToPercentage } from '../../util/numbers';

interface Props {
  result: Result | null;
  attribute: number;
  query: Query | null;
  hoverObject: ResultObject | null;
}

const Guides: FunctionComponent<Props> = ({
  result,
  attribute,
  query,
  hoverObject,
}) => {
  const guidesRef = useRef<HTMLDivElement | null>(null);
  const position = useMousePos();

  // Labels
  const labelHorizontal = query
    ? floatToPercentage(
        query.engineMinScore +
          (1 - position.y) * (query.engineMaxScore - query.engineMinScore),
        1
      ).replace('.0', '') + '%'
    : '';

  const labelVertical = result
    ? getResultLabel(result, attribute, hoverObject, position.x, position.y)
    : '';

  return (
    <div className={classnames('Guides')} ref={guidesRef}>
      {position.globalY > 0 && (
        <Guide horizontal value={labelHorizontal} y={position.globalY} />
      )}
      {position.globalX > 0 && (
        <Guide vertical value={labelVertical} x={position.globalX} />
      )}
    </div>
  );
};

const getResultLabel = (
  result: Result,
  attribute: number,
  hoverObject: ResultObject | null,
  x: number,
  y: number
) => {
  if (result.results.length < 1) {
    return '';
  }
  // Get label from hover Object
  if (hoverObject) {
    return hoverObject.values[attribute];
  }

  // Get closest attribute value
  let closestResult: ResultObject = result.results[0];
  let closestX = Infinity;
  let closestY = Infinity;
  let deltaX = 0;
  let deltaY = 0;
  result.results.forEach((result) => {
    deltaX = Math.abs(result.x[attribute] - x);
    if (deltaX < closestX) {
      closestX = deltaX;
      closestResult = result as ResultObject;
      closestY = Math.abs(result.score - y);
    } else {
      if (deltaX < closestX) {
        deltaY = Math.abs(result.score - y);
        if (deltaY < closestY) {
          closestY = deltaY;
          closestResult = result;
        }
      }
    }
  });
  return closestX < 0.05 ? closestResult?.values[attribute] : '';
};

export default Guides;
