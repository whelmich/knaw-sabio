import { FunctionComponent } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

import { Query } from '../../interfaces/Query';

import ToggleBox from '../ToggleBox/ToggleBox';
import FormBox from '../FormBox/FormBox';
import StyledSelect from '../StyledSelect/StyledSelect';
import * as dictionary from '../../config/dictionary';

interface Props {
  query: Query;
  setQuery: (query: Query) => void;
}

const presetTerms = [
  {
    label: 'Custom',
    value: null,
  },
  {
    label: 'Colonialism',
    value: dictionary.colonialismTerms,
  },
  {
    label: 'Discrimination',
    value: dictionary.discriminationTerms,
  },
  {
    label: 'Gender & Sexuality',
    value: dictionary.genderSexualityTerms,
  },
  {
    label: 'Religion',
    value: dictionary.religionTerms,
  },
  {
    label: 'Slavery',
    value: dictionary.slaveryTerms,
  },
  {
    label: 'Slavery Locations',
    value: dictionary.slaveryLocationTerms,
  },
  {
    label: 'Slavery Products',
    value: dictionary.slaveryProductTerms,
  },
];

const VocabularyQuery: FunctionComponent<Props> = ({ query, setQuery }) => {
  const currentPreset = presetTerms.find(
    (option) => option.value === query.vocabularyTerms
  );

  return (
    <ToggleBox className="VocabularyQuery" title="Vocabulary">
      {/* Preset terms */}
      <FormBox
        title="Preset"
        description="Select a list of Dutch terms categorized by theme"
      >
        <StyledSelect
          options={currentPreset ? presetTerms.slice(1) : presetTerms}
          setValue={(value) =>
            value &&
            setQuery({
              ...query,
              vocabularyTerms: value,
            })
          }
          value={currentPreset ? currentPreset.value : null}
        />
      </FormBox>

      {/* Terms */}
      <FormBox
        title="Terms"
        description="A comma separated list of terms to calculate the indicator scores with"
        // extra={<button className="btn small">Presets</button>}
      >
        <TextareaAutosize
          value={query.vocabularyTerms}
          spellCheck="false"
          cacheMeasurements={true}
          onChange={(e) => {
            setQuery({
              ...query,
              vocabularyTerms: e.target.value,
            });
          }}
        />
      </FormBox>
    </ToggleBox>
  );
};

export default VocabularyQuery;
