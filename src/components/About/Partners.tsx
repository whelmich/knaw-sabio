import { FunctionComponent } from 'react';
import './Partners.scss';

interface Props {}

const Partners: FunctionComponent<Props> = ({ children }) => {
  return (
    <div className="Partners">
      <h2>Funded by</h2>
      <div className="links">
        <a
          href="https://netwerkdigitaalerfgoed.nl/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            width="230"
            height="104"
            src="/images/logo-netwerkdigitaalerfgoed.svg"
            alt="Logo Netwerk Digitaal Erfgoed"
          />
        </a>
      </div>
    </div>
  );
};

export default Partners;
