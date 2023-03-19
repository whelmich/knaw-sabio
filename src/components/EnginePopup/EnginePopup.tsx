import { FunctionComponent } from 'react';
import { API_ROOT } from '../../config/constants';

import { Engine } from '../../interfaces/Engine';
import Popup from '../Popup/Popup';

import './EnginePopup.scss';

interface Props {
  engine: Engine;
  onClose: () => void;
}

const EnginePopup: FunctionComponent<Props> = ({ engine, onClose }) => {
  return (
    <Popup
      className="EnginePopup"
      title={'Engine details: ' + engine.name}
      onClose={onClose}
    >
      <iframe
        title={engine.name}
        src={API_ROOT + 'engines/' + encodeURIComponent(engine.id) + '/html'}
      />
    </Popup>
  );
};

export default EnginePopup;
