import { useState } from 'react';
import { Engine } from '../interfaces/Engine';

type EnginePopupHook = () => [Engine | null, (engine: Engine | null) => void];

export const useEnginePopup: EnginePopupHook = () => {
  // Engine popup
  const [enginePopup, setEnginePopup] = useState<Engine | null>(null);

  return [
    enginePopup,
    (engine: Engine | null) => {
      setEnginePopup(engine);
    },
  ];
};

export default useEnginePopup;
