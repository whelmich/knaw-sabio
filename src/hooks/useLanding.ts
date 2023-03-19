import { useCallback, useState } from 'react';

type LandingHook = (props: { home: boolean }) => [boolean, () => void];

const landingSessionStorageKey = 'sabio_landing_shown';

export const useLanding: LandingHook = ({ home }) => {
  const [showLanding, setShowLanding] = useState(
    home && !window.sessionStorage.getItem(landingSessionStorageKey)
  );

  const hideLanding = useCallback(() => {
    setShowLanding(false);
    window.sessionStorage.setItem(landingSessionStorageKey, 'true');
  }, []);

  return [showLanding, hideLanding];
};

export default useLanding;
