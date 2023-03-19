import { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import Examples from '../About/Examples';

import Intro from '../About/Intro';
import Partners from '../About/Partners';
import Popup from '../Popup/Popup';

import './LandingPopup.scss';

interface Props {
  onClose: () => void;
}

const LandingPopup: FunctionComponent<Props> = ({ onClose }) => {
  return (
    <Popup
      className="LandingPopup"
      title={'Welcome to SABIO'}
      onClose={onClose}
    >
      <Intro>
        <div className="btn" onClick={onClose}>
          Start exploring
        </div>

        <Link className="btn dark margin" to="/about">
          About
        </Link>
      </Intro>

      <Examples onExampleClick={onClose} />

      <Partners />
    </Popup>
  );
};

export default LandingPopup;
