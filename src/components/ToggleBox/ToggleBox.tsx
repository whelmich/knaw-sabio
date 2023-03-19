import { FunctionComponent, useState } from 'react';
import './ToggleBox.scss';
import classnames from 'clsx';

interface Props {
  title?: string | JSX.Element;
  initState?: boolean;
  className?: string;
}

const ToggleBox: FunctionComponent<Props> = ({
  title = '',
  initState = true,
  className = '',
  children,
}) => {
  const [open, setOpen] = useState(initState);
  return (
    <div className={classnames('ToggleBox', className, { open })}>
      {/* Header */}
      <div
        className="header"
        onClick={() => {
          setOpen(!open);
        }}
      >
        <h3>{title}</h3>
      </div>

      {/* Content (children) */}
      {open && <div className="content">{children}</div>}
    </div>
  );
};

export default ToggleBox;
