import { FunctionComponent } from 'react';
import classnames from 'clsx';

import './Popup.scss';

interface Props {
  title?: string;
  className?: string;
  onClose: () => void;
}

const Popup: FunctionComponent<Props> = ({
  title = '',
  className = '',
  children,
  onClose,
}) => {
  return (
    <div
      className={classnames('Popup', className)}
      onClick={(e) => {
        (e.target as Element).classList.contains('Popup') && onClose();
      }}
    >
      <div className="content">
        <div className="header">
          <h2>{title}</h2>
          <div className="close" onClick={onClose}></div>
        </div>
        <div className="body">{children}</div>
      </div>
    </div>
  );
};

export default Popup;
