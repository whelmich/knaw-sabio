import { FunctionComponent, useRef, useCallback } from 'react';
import debounce from 'debounce';
import AsyncSelect from 'react-select/async';

import colors from '../../config/colors';

interface Props {
  url: string;
  value: string;
  onChange: (value: string) => void;
}

const SPLIT_CHARACTER = '|';

const AutoComplete: FunctionComponent<Props> = ({ url, value, onChange }) => {
  const abortController = useRef<AbortController | null>(null);

  // Load options from given url (url + inputvalue)
  const loadOptions = useCallback(
    (inputValue: string, callback: (options: readonly any[]) => void) => {
      if (abortController.current !== null) {
        abortController.current.abort();
      }
      abortController.current = new AbortController();

      // min length
      if (inputValue.length < 2) {
        callback([]);
        return;
      }

      // load datasets from API
      const load = async () => {
        try {
          const response = await fetch(url + encodeURIComponent(inputValue), {
            signal:
              abortController.current !== null
                ? abortController.current.signal
                : null,
          });
          const json = await response.json();
          const options = json.map((value: string) => ({
            value,
            label: value,
          }));
          callback(options);
        } catch (err) {
          console.error(err);
        }
      };

      const debouncedLoader = debounce(load, 400);
      debouncedLoader();
      return () => {
        debouncedLoader.clear();
      };
    },
    [url]
  );

  // Get all non empty values from the value string
  const values = value
    .split(SPLIT_CHARACTER)
    .filter((a) => a)
    .map((v) => v.trim());

  // Current Values as Options {value, label}
  const currentValues = values.map((value) => ({
    value,
    label: value,
  }));

  return (
    <AsyncSelect
      value={currentValues}
      isMulti
      cacheOptions
      defaultOptions
      styles={selectStyles}
      loadOptions={
        loadOptions as (
          inputValue: string,
          callback: (options: readonly any[]) => void
        ) => void
      }
      onChange={(options) => {
        onChange(
          options
            ? options.map((option) => option.value).join(SPLIT_CHARACTER)
            : ''
        );
      }}
    />
  );
};

// Datasets dropdown style
const selectStyles = {
  indicatorSeparator: (provided: object) => {
    return {
      ...provided,
      display: 'none',
    };
  },

  multiValueRemove: (provided: object) => {
    return {
      ...provided,
      color: colors.SECONDARY,
    };
  },

  multiValue: (provided: object) => {
    return {
      ...provided,
      backgroundColor: colors.SECONDARY_15,
    };
  },

  dropdownIndicator: (provided: object) => {
    return {
      ...provided,
      ':hover': { color: colors.SECONDARY_DARK },
      color: colors.SECONDARY,
    };
  },

  control: (provided: object) => {
    return {
      ...provided,
      border: '1px solid' + colors.GREY,
      boxShadow: 'none',
      ':hover': { border: '1px solid' + colors.GREY },
    };
  },

  option: (
    provided: object,
    state: { isSelected: boolean; isFocused: boolean }
  ) => {
    const backgroundColor = state.isSelected
      ? colors.GREY_LIGHT
      : state.isFocused
      ? colors.SECONDARY
      : 'white';
    const color = state.isSelected
      ? colors.BLACK
      : state.isFocused
      ? 'white'
      : colors.BLACK;
    return {
      ...provided,
      backgroundColor,
      color,
    };
  },
};

export default AutoComplete;
