import { useEffect, useState } from 'react';
import { Engine, EngineParam } from '../interfaces/Engine';
import { Dataset } from '../interfaces/Dataset';
import { API_ROOT } from '../config/constants';

type EnginesHook = (props: {
  dataset: Dataset | null;
}) => [engines: Engine[], error: string];

export const useEngines: EnginesHook = ({ dataset }) => {
  const [allEngines, setAllEngines] = useState<Engine[]>([]);
  const [error, setError] = useState('');

  // load Engines from API once
  useEffect(() => {
    const load = async () => {
      const url = API_ROOT + 'engines';
      try {
        const response = await fetch(url);
        const json = await response.json();

        // Map to engines
        const engines = json.map((data: Partial<Engine>) => ({
          id: data.id || '',
          name: data.name || '',
          min_score: data.min_score || 0,
          params: data.params || ([] as EngineParam[]),
          highlightExactWords: true,
        }));

        // store
        setAllEngines(engines);
        setError('');
      } catch (err) {
        console.error(err);
        setError('Could not load engines');
      }
    };

    load();
  }, []);

  // Available Engines
  const [engines, setEngines] = useState<Engine[]>([]);

  // Get available engines for active dataset
  useEffect(() => {
    if (dataset && allEngines.length > 0) {
      setEngines(
        allEngines.filter((engine: Engine) =>
          dataset.available_engines.includes(engine.id)
        )
      );
    }
  }, [dataset, allEngines]);

  return [engines, error];
};

export default useEngines;
