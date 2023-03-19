import { useEffect, useState } from 'react';
import { API_ROOT } from '../config/constants';

import { ObjectDetails } from '../interfaces/ObjectDetails';

import useAutoClear from './useAutoClear';

type ObjectDetailsHook = (props: {
  datasetId: string;
  objectId: string;
}) => [ObjectDetails | null, string];

export const useObjectDetails: ObjectDetailsHook = ({
  datasetId,
  objectId,
}) => {
  const [error, setError] = useAutoClear({});

  const [object, setObject] = useState<ObjectDetails | null>(null);

  useEffect(() => {
    // require dataset id and object id
    if (!datasetId || !objectId) {
      return;
    }

    const controller = new AbortController();

    // load datasets from API
    const load = async () => {
      const url =
        API_ROOT +
        'objects/' +
        encodeURIComponent(datasetId) +
        '/details/' +
        encodeURIComponent(objectId);
      try {
        const response = await fetch(url, { signal: controller.signal });
        const json = await response.json();
        setObject(json);
        setError('');
      } catch (err) {
        console.error(err);
        setError(
          'Could not load object details:' +
            objectId +
            ', in dataset: ' +
            datasetId
        );
      }
    };

    load();

    return () => {
      controller.abort();
    };
  }, [datasetId, objectId, setError]);

  return [object, error];
};

export default useObjectDetails;
