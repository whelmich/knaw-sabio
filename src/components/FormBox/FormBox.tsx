import { FunctionComponent } from 'react';
import classnames from 'clsx';
import './FormBox.scss';
import HelpTooltip from '../HelpTooltip/HelpTooltip';

interface Props {
  title: string;
  className?: string;
  description?: string;
  extra?: JSX.Element;
}

const FormBox: FunctionComponent<Props> = ({
  title,
  description,
  children,
  className = '',
  extra = null,
}) => {
  return (
    <div className={classnames('FormBox', className)}>
      <label>
        {title} {description && <HelpTooltip description={description} />}
        <span className="extra">{extra}</span>
      </label>
      <div className="content">{children}</div>
    </div>
  );
};

export default FormBox;
