import { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import colors from '../../config/colors';
import LogoMark from '../Logo/LogoMark';
import PercentageLabel from '../PercentageLabel/PercentageLabel';
import './Example.scss';

export interface Props {
  imageUrl: string;
  score: number;
  title: string;
  engine: string;
  url: string;
}

const Example: FunctionComponent<Props> = ({
  imageUrl,
  score,
  title,
  engine,
  url,
}) => {
  return (
    <Link to={url} className="Example">
      <div
        className="image"
        style={{ backgroundImage: 'url(' + imageUrl + ')' }}
      ></div>
      <h2>{title}</h2>
      <p>{engine}</p>

      <div className="score">
        <LogoMark color={colors.PRIMARY} width={15} height={15} />
        <PercentageLabel value={score} />
      </div>
    </Link>
  );
};

export default Example;
