// Get percentage from float with given number of decimals
export const floatToPercentage = (value: number, decimals: number) =>
  (value * 100).toFixed(decimals);

// Format integer to locale string
export const formatInt = (value: number) => Math.round(value).toLocaleString();
