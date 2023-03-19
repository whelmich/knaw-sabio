import { SABIO_PROJECT_URL } from '../../config/constants';

import Examples from './Examples';
import Intro from './Intro';
import Partners from './Partners';

import './About.scss';

const About = () => {
  return (
    <div className="About">
      <Intro>
        <a
          className="btn icon-button-link"
          href={SABIO_PROJECT_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          Project website
        </a>
      </Intro>

      <Examples />

      <Partners />
    </div>
  );
};

export default About;
