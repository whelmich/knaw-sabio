import { memo } from 'react';
import { API_ROOT } from '../../config/constants';
import './APIInfo.scss';

const APIInfo = () => {
  return (
    <div
      className="APIInfo"
      title="Current API endpoint. Can be customized in the with e.g. ?api=https://example.com/api"
    >
      <span className="label">API</span>
      <span className="url">{API_ROOT}</span>
    </div>
  );
};

export default memo(APIInfo);
