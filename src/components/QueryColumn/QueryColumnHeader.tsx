import { FunctionComponent, useState, useRef, memo } from 'react';
import ColumnHeader from '../ColumnHeader/ColumnHeader';
import './QueryColumnHeader.scss';
import colors from '../../config/colors';

interface Props {
  resetQuery: () => void;
}

const QueryColumnHeader: FunctionComponent<Props> = ({ resetQuery }) => {
  const [showMenu, setShowMenu] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const copyToClipboard = () => {
    if (!inputRef.current) {
      return;
    }
    inputRef.current.select();
    document.execCommand('copy');
    inputRef.current.blur();
  };

  return (
    <ColumnHeader className="QueryColumnHeader" title="Query">
      {/* Query menu*/}
      <div
        className="QueryMenu"
        onClick={() => {
          setShowMenu((show) => !show);
        }}
      >
        <div className="button" />

        {showMenu && (
          <div className="menu">
            <div className="menu-item clickable" onClick={resetQuery}>
              Reset query
            </div>

            <div
              className="menu-item share"
              onClick={() => {
                copyToClipboard();
              }}
            >
              Copy share url:
              <CopyIcon />
              <input
                ref={inputRef}
                readOnly
                contentEditable={true}
                value={document.location.href}
              />
            </div>
          </div>
        )}
      </div>
    </ColumnHeader>
  );
};

const CopyIcon = () => (
  <svg
    style={{ width: 24, height: 24 }}
    className="copy-icon"
    viewBox="0 0 24 24"
  >
    <path
      fill={colors.SECONDARY}
      d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"
    />
  </svg>
);

export default memo(QueryColumnHeader);
