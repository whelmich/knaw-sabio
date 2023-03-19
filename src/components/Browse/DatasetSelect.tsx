import { FunctionComponent, memo } from 'react';
import Select, { OnChangeValue } from 'react-select';

import { Dataset } from '../../interfaces/Dataset';
import colors from '../../config/colors';
import APIInfo from '../APIInfo/APIInfo';

interface Props {
  dataset: Dataset | null;
  datasets: Dataset[];
  setDataset: (dataset: Dataset) => void;
}

interface Option {
  label: string;
  value: string;
}

const DatasetSelect: FunctionComponent<Props> = ({
  dataset,
  datasets,
  setDataset,
}) => {
  const datasetOptions = datasets.map((d) => ({ value: d.id, label: d.name }));
  const activeDatasetId = dataset ? dataset.id : '';
  const onDatasetChange = (option: OnChangeValue<Option, false>) => {
    if (!option) {
      return;
    }
    const d = datasets?.find((d) => d.id === option.value);
    d && setDataset(d);
  };

  // Datasets dropdown style
  const selectStyles = {
    container: (provided: object) => {
      return {
        ...provided,
        width: dataset ? 50 + dataset.name.length * 10 : 'auto',
        borderLeft: '1px solid white',
        paddingLeft: '5px',
      };
    },

    valueContainer: (provided: object) => {
      return {
        ...provided,
        color: 'white',
        backgroundColor: colors.BLACK,
      };
    },

    indicatorSeparator: (provided: object) => {
      return {
        ...provided,
        display: 'none',
      };
    },

    dropdownIndicator: (provided: object) => {
      return {
        ...provided,
        // ':hover': { color: 'rgba(255,255,255,0.7)' },
        // color: 'white',
        ':hover': { color: colors.SECONDARY },
        color: colors.SECONDARY,
      };
    },

    singleValue: (provided: object) => {
      return {
        ...provided,
        color: 'white',
      };
    },

    control: (provided: object) => {
      return {
        ...provided,
        color: 'white',
        backgroundColor: colors.BLACK,
        border: 0,
        boxShadow: 'none',
      };
    },

    menu: (provided: object) => {
      return {
        ...provided,
        color: 'white',
        backgroundColor: colors.BLACK,
        width: 'auto',
        minWidth: '100%',
      };
    },

    option: (
      provided: object,
      state: { isSelected: boolean; isFocused: boolean }
    ) => {
      const backgroundColor = state.isSelected
        ? colors.SECONDARY_DARK
        : state.isFocused
        ? colors.SECONDARY
        : colors.BLACK;
      return {
        ...provided,
        backgroundColor,
      };
    },
  };

  return (
    <div className="datasets">
      <Select
        options={datasetOptions}
        onChange={onDatasetChange}
        value={datasetOptions.find(
          (option) => option.value === activeDatasetId
        )}
        styles={selectStyles}
        isDisabled={datasetOptions.length === 0}
      />
      <APIInfo />
    </div>
  );
};

export default memo(DatasetSelect);
