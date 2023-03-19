import { FunctionComponent } from 'react';
import { API_ROOT } from '../../config/constants';
import './Errors.scss';

interface Props {
  errors: string[];
}

const Errors: FunctionComponent<Props> = ({ errors }) => {
  return (
    <ul className="Errors">
      {errors.map((error, index) => (
        <li key={index}>
          <span>{API_ROOT} - </span>
          {error}
        </li>
      ))}
    </ul>
  );
};

export default Errors;
