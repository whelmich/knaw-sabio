import { FunctionComponent, useState, useEffect } from 'react';

import { Query } from '../../interfaces/Query';
import { Engine } from '../../interfaces/Engine';

import Slider from 'react-input-slider';

import ToggleBox from '../ToggleBox/ToggleBox';
import FormBox from '../FormBox/FormBox';
import PercentageLabel from '../PercentageLabel/PercentageLabel';
import StyledSelect from '../StyledSelect/StyledSelect';
import EngineParamSelect from './EngineParamSelect';

import sliderStyle from '../../config/sliderStyle';
import { debounce } from 'debounce';

interface Props {
  engines: Engine[];
  query: Query;
  setQuery: (query: Query) => void;
  setEnginePopup: (engine: Engine | null) => void;
}
const EngineQuery: FunctionComponent<Props> = ({
  engines,
  query,
  setQuery,
  setEnginePopup,
}) => {
  // Get active engine from query;
  const engine = engines.find((engine) => engine.id === query.engineId);

  // Local min score (for debouncing)
  const [minScore, setMinScore] = useState(query.engineMinScore);
  // Local max score (for debouncing)
  const [maxScore, setMaxScore] = useState(query.engineMaxScore);

  // Update from main query
  useEffect(() => {
    setMinScore(query.engineMinScore);
    setMaxScore(query.engineMaxScore);
  }, [query.engineMaxScore, query.engineMinScore]);

  // Debounce update on min/max score
  useEffect(() => {
    const updateQuery = debounce(() => {
      setQuery({
        ...query,
        engineMinScore: minScore,
        engineMaxScore: maxScore,
      });
    }, 150);

    if (
      query.engineMinScore !== minScore ||
      query.engineMaxScore !== maxScore
    ) {
      updateQuery();
    }

    return () => {
      updateQuery.clear();
    };
  }, [query, setQuery, minScore, maxScore]);

  return (
    <ToggleBox className="EngineQuery" title="Indicator">
      {/* Engine */}
      <FormBox
        title="Engine"
        description="Select a SABIO engine, which will be used to create an indicator score for each object"
      >
        <div className="flex">
          <StyledSelect
            options={engines.map((engine) => ({
              value: engine.id,
              label: engine.name,
            }))}
            setValue={(value) => {
              setQuery({
                ...query,
                engineId: value,
              });
            }}
            value={query.engineId}
          />

          <button
            className="btn"
            style={{ marginLeft: 10 }}
            onClick={() => {
              engine && setEnginePopup(engine);
            }}
          >
            INFO
          </button>
        </div>
      </FormBox>

      {/* Min value */}
      <FormBox
        title="Minimum score"
        description="Minimum value of the indicator score"
        extra={<PercentageLabel value={minScore} />}
      >
        <Slider
          axis="x"
          styles={sliderStyle}
          xstep={0.001}
          xmin={0}
          xmax={1}
          x={minScore}
          onChange={({ x }) => {
            setMinScore(x);
            if (x > maxScore) {
              setMaxScore(x);
            }
          }}
        />
      </FormBox>

      {/* Max value */}
      <FormBox
        title="Maximum score"
        description="Maximum value of the indicator score"
        extra={<PercentageLabel value={maxScore} />}
      >
        <Slider
          axis="x"
          styles={sliderStyle}
          xstep={0.001}
          xmin={0}
          xmax={1}
          x={maxScore}
          onChange={({ x }) => {
            setMaxScore(x);
            if (x < minScore) {
              setMinScore(x);
            }
          }}
        />
      </FormBox>

      {/* Engine Params */}
      {engine !== undefined &&
        engine.params.map((param) => (
          <FormBox
            key={param.id}
            title={param.label}
            description={param.description}
          >
            {/* Select */}
            {param.control === 'select' && (
              <EngineParamSelect
                query={query}
                setQuery={setQuery}
                param={param}
              />
            )}
          </FormBox>
        ))}
    </ToggleBox>
  );
};

export default EngineQuery;
