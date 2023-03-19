import { FunctionComponent } from 'react';

import { EngineParam } from '../../interfaces/Engine';
import { Query } from '../../interfaces/Query';

import StyledSelect from '../StyledSelect/StyledSelect';

interface Props {
  param: EngineParam;
  query: Query;
  setQuery: (query: Query) => void;
}
const ParamSelect: FunctionComponent<Props> = ({ param, query, setQuery }) => {
  const options = Object.entries(param.options).map(([value, label]) => ({
    value,
    label,
  }));

  const currentValue = query.engineParams.reduce(
    (value, p) => (p.id === param.id ? p.value : value),
    param.default
  );

  return (
    <StyledSelect
      options={options}
      setValue={(value) => {
        const exists = query.engineParams.find((p) => p.id === param.id);
        if (!exists) {
          // add engine param
          query.engineParams.push({ id: param.id, value: value });
        }
        setQuery({
          ...query,
          engineParams: query.engineParams.map((p) =>
            p.id === param.id ? { ...p, value } : p
          ),
        });
      }}
      value={currentValue}
    />
  );
};

export default ParamSelect;
