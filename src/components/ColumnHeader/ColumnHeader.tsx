import { FunctionComponent } from 'react';
import classnames from 'clsx';
import './ColumnHeader.scss';

interface Props {
  title: string | JSX.Element;
  className?: string;
}

const ColumnHeader: FunctionComponent<Props> = ({
  title,
  className = '',
  children,
}) => {
  return (
    <div className={classnames('ColumnHeader', className)}>
      <h2>{title}</h2>
      <div className="actions">{children}</div>
    </div>
  );
};

export default ColumnHeader;
