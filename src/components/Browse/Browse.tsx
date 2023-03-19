import { FunctionComponent } from 'react';
import classnames from 'clsx';

import useBrowseNav from '../../hooks/useBrowseNav';
import useDatasets from '../../hooks/useDatasets';
import useEngines from '../../hooks/useEngines';
import useDataset from '../../hooks/useDataset';
import useQuery from '../../hooks/useQuery';
import useResult from '../../hooks/useResult';
import useView from '../../hooks/useView';
import useEnginePopup from '../../hooks/useEnginePopup';
import useBrowseParams from '../../hooks/useBrowseParams';

import QueryColumn from '../QueryColumn/QueryColumn';
import ResultColumn from '../ResultColumn/ResultColumn';
import StatsColumn from '../StatsColumn/StatsColumn';
import ObjectDetailsColumn from '../ObjectDetailsColumn/ObjectDetailsColumn';
import EnginePopup from '../EnginePopup/EnginePopup';
import Errors from '../Errors/Errors';
import DatasetSelect from './DatasetSelect';

import { HEADER_HEIGHT } from '../../config/constants';
import useSelectedObject from '../../hooks/useSelectedObject';
import useObjectDetails from '../../hooks/useObjectDetails';
import useVisibleObjects from '../../hooks/useVisibleObjects';
import HoverObject from '../HoverObject/HoverObject';
import useHoverObject from '../../hooks/useHoverObject';
import LandingPopup from '../LandingPopup/LandingPopup';
import useLanding from '../../hooks/useLanding';
import useAttribute from '../../hooks/useAttribute';

import './Browse.scss';

interface Props {
  home?: boolean;
}

const Browse: FunctionComponent<Props> = ({ home = false }) => {
  // Landing
  const [showLanding, hideLanding] = useLanding({ home });

  // Router params
  const params = useBrowseParams();

  // All datasets
  const [datasets, datasetsError] = useDatasets();

  // Current dataset
  const [dataset, datasetError] = useDataset({
    datasets,
    param: params.dataset || '',
  });

  // Available Engines
  const [engines, enginesError] = useEngines({ dataset });

  // Query
  const [query, queryError] = useQuery({
    engines,
    dataset,
    param: params.query || '',
  });

  // Get Result
  const [result, resultLoading, resultError] = useResult({ dataset, query });

  // Engine Popup
  const [enginePopup, setEnginePopup] = useEnginePopup();

  // View
  const [view, viewError] = useView({
    param: params.view || '',
  });

  // Attribute
  const [attribute, attributeError] = useAttribute({
    result,
    param: params.attribute || '',
  });

  // Selected Object
  const [selectedObject, selectedObjectError] = useSelectedObject({
    result,
    param: params.selectedObject || '',
  });

  // Object details
  const [objectDetails, objectDetailsError] = useObjectDetails({
    datasetId: dataset ? dataset.id : '',
    objectId: selectedObject ? selectedObject.id : '',
  });

  // Navigation functions
  const {
    setQuery,
    resetQuery,
    setDataset,
    /* setView, */
    setAttribute,
    setSelectedObject,
  } = useBrowseNav({
    resultLoading,
    params,
    dataset,
    engines,
    query,
    result,
    view,
    attribute,
    selectedObject,
  });

  // Visible Objects
  const [visibleObjects, setVisibleObjects] = useVisibleObjects();

  // Hover Object
  const [hoverObject, setHoverObject, mousePos] = useHoverObject();

  // Combine errors
  const errors = [
    datasetsError,
    datasetError,
    enginesError,
    queryError,
    viewError,
    attributeError,
    selectedObjectError,
    objectDetailsError,
    resultError,
  ].filter((e) => e);

  return (
    <div
      className={classnames('Browse', {
        loading: resultLoading,
        showObjectDetails: selectedObject && objectDetails,
      })}
    >
      {/* Dataset selector */}
      {dataset && (
        <DatasetSelect
          datasets={datasets}
          dataset={dataset}
          setDataset={setDataset}
        />
      )}

      {/* Query column */}
      {dataset && query && engines && engines.length > 0 && (
        <QueryColumn
          loading={resultLoading}
          key={dataset.id}
          dataset={dataset}
          engines={engines}
          query={query}
          setQuery={setQuery}
          resetQuery={resetQuery}
          setEnginePopup={setEnginePopup}
        />
      )}

      {/* Result column */}
      {dataset && (
        <ResultColumn
          loading={resultLoading}
          view={view}
          attribute={attribute}
          setAttribute={setAttribute}
          result={result}
          query={query}
          setSelectedObject={setSelectedObject}
          dataset={dataset}
          mousePos={mousePos}
          selectedObject={selectedObject}
          setVisibleObjects={setVisibleObjects}
          hoverObject={hoverObject}
          setHoverObject={setHoverObject}
        />
      )}

      {/* Stats column */}
      {dataset && (
        <StatsColumn results={visibleObjects} hoverObject={hoverObject} />
      )}

      {/* Selected Object column */}
      {selectedObject && objectDetails && (
        <ObjectDetailsColumn
          objectDetails={objectDetails}
          resultObject={selectedObject}
          highlightExactWords={result ? result.highlightExactWords : false}
          loading={selectedObject.id !== objectDetails.id}
          onClose={() => {
            setSelectedObject(null);
          }}
        />
      )}

      {/* Engine details */}
      {enginePopup && (
        <EnginePopup
          engine={enginePopup}
          onClose={() => {
            setEnginePopup(null);
          }}
        />
      )}

      {/* Errors */}
      {errors && <Errors errors={errors} />}

      {/* Object hover */}
      {hoverObject && (
        <HoverObject
          object={hoverObject}
          x={mousePos.current.x + 10}
          y={mousePos.current.y + 10 - HEADER_HEIGHT}
          attributes={result ? result.attributes : []}
        />
      )}

      {/* Landing Popup */}
      {showLanding && <LandingPopup onClose={hideLanding} />}
    </div>
  );
};

export default Browse;
