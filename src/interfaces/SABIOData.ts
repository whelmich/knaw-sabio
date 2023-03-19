import { Dataset } from './Dataset';
import { Engine } from './Engine';

export interface SABIOData {
  datasets: Dataset[];
  dataset: Dataset;
  setDataset: React.Dispatch<React.SetStateAction<Dataset | null>>;
  availableEngines: Engine[];
  errors: string[];
}
