import { useEffect, useState } from 'react';
import { API_ROOT } from '../config/constants';
import { Dataset } from '../interfaces/Dataset';

type DatasetsHook = () => [datasets: Dataset[], error: string];

export const useDatasets: DatasetsHook = () => {
  const [value, setValue] = useState<Dataset[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // load datasets from API
    const load = async () => {
      const url = API_ROOT + 'datasets';
      try {
        const response = await fetch(url);
        const json = await response.json();
        setValue(json);
        setError('');
      } catch (err) {
        console.error(err);
        setError('Could not load datasets');
      }
    };

    load();
  }, []);

  return [value, error];
};

export default useDatasets;
