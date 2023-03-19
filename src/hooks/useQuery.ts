import { useEffect, useRef, useState } from 'react';
import { Dataset } from '../interfaces/Dataset';
import { Engine } from '../interfaces/Engine';
import { Query } from '../interfaces/Query';
import useAutoClear from './useAutoClear';
import { defaultTerms } from '../config/dictionary';

type QueryHook = (props: {
  engines: Engine[];
  dataset: Dataset | null;
  param: string;
}) => [Query | null, string];

export const useQuery: QueryHook = ({ engines, dataset, param }) => {
  // Error
  const [error, setError] = useAutoClear({});

  // Store last Query
  const lastQuery = useRef<Query | null>(null);
  const lastQueryStr = useRef(param);

  // Query
  const [query, setQuery] = useState<Query | null>(null);

  // Update query
  useEffect(() => {
    // require dataset and engines
    if (dataset === null || engines.length === 0) {
      return;
    }

    if (param) {
      // Load from param
      if (
        lastQuery.current === null ||
        (lastQueryStr.current !== undefined && lastQueryStr.current !== param)
      ) {
        try {
          lastQuery.current = urlDecodeQuery(param);
          setQuery(lastQuery.current);
        } catch (e) {
          setError('Invalid query from url');
        }
      }
      lastQueryStr.current = param;
    } else {
      // Create initial query
      lastQuery.current = null; // dataset ? createInitialQuery(dataset, engines) : null;
      setQuery(lastQuery.current);
    }
  }, [param, engines, dataset, setError]);

  return [query, error];
};

export const urlDecodeQuery = (param: string): Query =>
  param ? JSON.parse(decodeURIComponent(param)) : null;

export const createInitialQuery = (
  dataset: Dataset,
  engines: Engine[]
): Query => {
  const q: Query = {
    // object
    objectKeywords: '',
    objectStartDate: '',
    objectEndDate: '',
    objectParams: dataset.params.map((param) => ({ id: param.id, value: '' })),

    // engine
    engineId: engines[0].id,
    engineMinScore: engines[0].min_score,
    engineMaxScore: 1,
    engineParams:
      engines && engines.length > 0
        ? engines[0].params.map((param) => ({
            id: param.id,
            value: param.default,
          }))
        : [],

    // vocabulary
    vocabularyTerms: defaultTerms,
  };

  return q;
};

export default useQuery;
