import { memo, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import classnames from 'clsx';

import LogoMark from '../Logo/LogoMark';
import LogoText from '../Logo/LogoText';

import './Header.scss';
import { EVENT_LOADING_QUERY, EVENT_RENDERING } from '../../config/constants';
import { EventLoadingQuery, EventRendering } from '../../interfaces/Events';

const Header = () => {
  const [loading, setLoading] = useState(false);
  const [rendering, setRendering] = useState(false);

  // Listen to loading events
  useEffect(() => {
    const onLoading = ((e: CustomEvent<EventLoadingQuery>) => {
      setLoading(e.detail.loading);
    }) as EventListener;

    window.addEventListener(EVENT_LOADING_QUERY, onLoading);

    return () => {
      window.removeEventListener(EVENT_LOADING_QUERY, onLoading);
    };
  });

  // Listen to rendering events
  useEffect(() => {
    const onRendering = ((e: CustomEvent<EventRendering>) => {
      setRendering(e.detail.rendering);
    }) as EventListener;

    window.addEventListener(EVENT_RENDERING, onRendering);

    return () => {
      window.removeEventListener(EVENT_RENDERING, onRendering);
    };
  });

  return (
    <div className={classnames('Header', { loading, rendering })}>
      <div className="left">
        {/* Logo */}
        <NavLink className="logo" to="/">
          <LogoText /> <LogoMark />
        </NavLink>
      </div>

      {/* Menu */}
      <nav>
        <NavLink to="/browse">Browse</NavLink>
        <NavLink to="/about">About</NavLink>
      </nav>
    </div>
  );
};

export default memo(Header);
