import { FunctionComponent, memo } from 'react';

interface Props {
  color?: string;
  width?: number;
  height?: number;
}

const LogoMark: FunctionComponent<Props> = ({
  color = '#FFCE06',
  width = 20,
  height = 21,
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 20 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="logo-mark"
  >
    <path
      id="sabio-logo-mark"
      d="M6.77333 10.3664L0 6.41221L2.24 3.0458L8.26667 7.21374L8 0H12L11.7333 7.21374L17.76 3.0458L20 6.41221L13.2267 10.3664L20 14.3206L17.76 17.687L11.7333 13.5191L12 21H8L8.26667 13.5191L2.24 17.687L0 14.3206L6.77333 10.3664Z"
      fill={color}
    />
  </svg>
);

export default memo(LogoMark);
