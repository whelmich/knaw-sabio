import { FunctionComponent } from 'react';
import LogoMark from '../Logo/LogoMark';
import './Intro.scss';

interface Props {}

const Intro: FunctionComponent<Props> = ({ children }) => {
  return (
    <div className="Intro">
      {/* Logo */}
      <div className="logo">
        <LogoMark width={110} height={110} />
        <LogoMark width={110} height={110} />
        <LogoMark width={110} height={110} />
      </div>
      {/* Intro text */}
      <div className="text">
        <h1>The SociAl BIas Observatory</h1>
        <p>
          In this project, we investigate how collection managers and curators
          create and add metadata to collection objects, and how bias in these
          metadata can be detected using statistical models.
        </p>
        <div className="buttons">
          {/* Children, add action buttons here */}
          {children}
        </div>
      </div>
    </div>
  );
};

export default Intro;
