import { FunctionComponent, useEffect, useState, memo } from 'react';
import classnames from 'clsx';

import './XAxis.scss';

interface Props {
  minValue: string;
  maxValue: string;
  attribute: number;
  attributes: string[];
  setAttribute: (index: number) => void;
}
const XAxis: FunctionComponent<Props> = ({
  minValue,
  maxValue,
  attribute,
  attributes,
  setAttribute,
}) => {
  const [showList, setShowList] = useState(false);

  // Hide list on document click
  useEffect(() => {
    if (!showList) {
      return;
    }
    const cancelList = () => {
      setShowList(false);
    };
    document.addEventListener('click', cancelList);
    return () => {
      document.removeEventListener('click', cancelList);
    };
  }, [showList]);

  if (attributes.length === 0) {
    return null;
  }

  return (
    <div className={classnames('XAxis', { showList })}>
      {/* Attribute selector */}
      <div className="attribute">
        {/* Prev */}
        <div
          className="prev icon-arrow-left"
          onClick={() => {
            setAttribute(
              (attributes.length + (attribute - 1)) % attributes.length
            );
          }}
        />

        {/* Selector */}
        <div
          className="current"
          onClick={(e) => {
            setShowList((v) => !v);
            e.stopPropagation();
          }}
        >
          <span>{attributes[attribute]}</span>
        </div>

        {/* Next */}
        <div
          className="next icon-arrow-left"
          onClick={() => {
            setAttribute((attribute + 1) % attributes.length);
          }}
        />

        {/* List */}
        {showList && (
          <ul className="list">
            {attributes.map((v, index) => (
              <li
                key={index}
                className={classnames({ active: attribute === index })}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowList(false);
                  setAttribute(index);
                }}
              >
                {v}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* min Value */}
      {minValue !== '' && <div className="min">{minValue}</div>}
      {/* max Value */}
      {maxValue !== '' && <div className="max">{maxValue}</div>}
    </div>
  );
};

export default memo(XAxis);
