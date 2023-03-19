import colors from './colors';

// Default styling for the react-input-slider component
const sliderStyle = {
  track: { width: '100%', backgroundColor: colors.GREY_LIGHT },
  active: { backgroundColor: colors.SECONDARY },
  thumb: {
    backgroundColor: colors.SECONDARY,
    boxShadow: '1px 1px 5px rgba(0,0,0,0.3)',
  },
};

export default sliderStyle;
