import { useMemo, useState } from 'react';
import { Dataset } from '../interfaces/Dataset';

type DatasetHook = (props: {
  datasets: Dataset[];
  param: string;
}) => [Dataset | null, string];

export const useDataset: DatasetHook = ({ datasets, param }) => {
  const [error, setError] = useState('');

  const dataset = useMemo(() => {
    const datasetId = param ? param : datasets.length > 0 ? datasets[0].id : '';
    const dataset = datasets.find((dataset) => dataset.id === datasetId);

    if (datasets.length > 0 && !dataset) {
      setError('Could not find dataset: ' + param);
    } else {
      setError('');
    }

    return dataset ? dataset : null;
  }, [datasets, param]);

  return [dataset, error];
};

export default useDataset;
