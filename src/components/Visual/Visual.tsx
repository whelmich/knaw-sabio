import { FunctionComponent, useMemo } from 'react';

import { Result, ResultObject } from '../../interfaces/Result';
import { Query } from '../../interfaces/Query';

import { VIEW_SCATTERPLOT } from '../../config/constants';

import ScatterPlot from '../ScatterPlot/ScatterPlot';

import './Visual.scss';

interface Props {
  result: Result | null;
  view: string;
  attribute: number;
  query: Query | null;
  selectedObject: ResultObject | null;
  setSelectedObject: (object: ResultObject | null) => void;
  setVisibleObjects: (objects: Array<ResultObject>) => void;
  setHoverObject: (object: ResultObject | null) => void;
  setAttribute: (attribute: number) => void;
}

const Visual: FunctionComponent<Props> = ({
  result,
  attribute,
  view,
  query,
  selectedObject,
  setSelectedObject,
  setVisibleObjects,
  setHoverObject,
  setAttribute,
}) => {
  const visual = useMemo(() => {
    switch (view) {
      case VIEW_SCATTERPLOT:
        return (
          <ScatterPlot
            attribute={attribute}
            setAttribute={setAttribute}
            result={result}
            setSelectedObject={setSelectedObject}
            setVisibleObjects={setVisibleObjects}
            selectedObject={selectedObject}
            query={query}
            setHoverObject={setHoverObject}
          />
        );
      default:
        console.error('Unknown view', view);
        return null;
    }
  }, [
    attribute,
    result,
    view,
    query,
    selectedObject,
    setSelectedObject,
    setVisibleObjects,
    setHoverObject,
    setAttribute,
  ]);

  return <div className="Visual">{visual}</div>;
};

export default Visual;
