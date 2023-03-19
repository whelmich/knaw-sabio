import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from '../Header/Header';
import Browse from '../Browse/Browse';
import About from '../About/About';

import './App.scss';
import { API_ROOT } from '../../config/constants';
import LogoMark from '../Logo/LogoMark';

const App = () => {
  let location = useLocation();

  // Listen to URL changes, and send to server/log
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      fetch(location.pathname, { method: 'HEAD' });
    }
  }, [location]);

  return (
    <div className="App">
      {API_ROOT === '' ? (
        <APIError />
      ) : (
        <>
          <Header />
          <Routes>
            <Route path="" element={<Browse home={true} />} />
            <Route path="about" element={<About />} />
            <Route path="browse/*" element={<Browse />} />
          </Routes>
        </>
      )}

      {/* Mobile warning */}
      <MobileWarning />
    </div>
  );
};

const AppWithRouter = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

const APIError = () => (
  <div className="api-error">
    <h2>Error: Missing API parameter</h2>
    <p>
      Add it to the url, e.g.:
      {' ' + window.location.protocol + '//' + window.location.host}
      ?api=https://example.com/api/v1/
    </p>
  </div>
);

const MobileWarning = () => {
  return (
    <div className="mobile-warning ">
      <LogoMark width={110} height={110} />
      <h2>
        This application only works on devices larger than 1024px. Please visit
        SABIO on computer or tablet.
      </h2>
    </div>
  );
};

export default AppWithRouter;
