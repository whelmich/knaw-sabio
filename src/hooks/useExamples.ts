import { useEffect, useState } from 'react';
import { Example } from '../interfaces/Example';
import { API_ROOT } from '../config/constants';

type ExamplesHook = () => Example[] | null;

export const useExamples: ExamplesHook = () => {
  const [examples, setExamples] = useState<Example[] | null>(null);

  // load Engines from API once
  useEffect(() => {
    const load = async () => {
      const url = API_ROOT + 'examples';
      try {
        const response = await fetch(url);
        const json = await response.json();
        setExamples(json.examples);
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, []);

  return examples;
};

export default useExamples;
