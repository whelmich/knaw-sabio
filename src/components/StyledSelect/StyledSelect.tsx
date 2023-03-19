import { FunctionComponent } from 'react';
import Select, { MenuPlacement } from 'react-select';
import colors from '../../config/colors';

type Option = {
  value: string | null;
  label: string;
};

interface Props {
  options: Option[];
  value: string | null;
  placeholder?: string;
  setValue: (value: string) => void;
  menuPlacement?: MenuPlacement | undefined;
}
const StyledSelect: FunctionComponent<Props> = ({
  options,
  value,
  setValue,
  placeholder = '',
  menuPlacement = 'bottom',
}) => {
  // Dropdown style
  const selectStyles = {
    indicatorSeparator: (provided: object) => {
      return {
        ...provided,
        display: 'none',
      };
    },

    dropdownIndicator: (provided: object) => {
      return {
        ...provided,
        ':hover': { color: colors.SECONDARY_DARK },
        color: colors.SECONDARY,
      };
    },

    container: (provided: object) => {
      return {
        ...provided,
        width: '100%',
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

  return (
    <Select
      menuPlacement={menuPlacement}
      className="StyledSelect"
      options={options}
      placeholder={placeholder}
      onChange={(option) => {
        option !== null && setValue(option.value || '');
      }}
      value={options.find((option) => option.value === value)}
      styles={selectStyles}
    />
  );
};

export default StyledSelect;
