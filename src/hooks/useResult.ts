import { useEffect, useState, useRef } from 'react';
import {
  API_ROOT,
  EVENT_LOADING_QUERY,
  MAX_NODES_TO_DISPLAY,
} from '../config/constants';

import { Dataset } from '../interfaces/Dataset';
import { EventLoadingQuery } from '../interfaces/Events';
import { Query } from '../interfaces/Query';
import { Result } from '../interfaces/Result';
import useAutoClear from './useAutoClear';

interface Params {
  [key: string]: string | number | boolean;
}

type ResultHook = (props: {
  dataset: Dataset | null;
  query: Query | null;
}) => [Result | null, boolean, string];

const UseResult: ResultHook = ({ dataset, query }) => {
  // Error
  const [error, setError] = useAutoClear({});

  // Loading
  const [loading, setLoading] = useState(false);

  // Last query
  const lastQuery = useRef<Query | null>(null);

  // Search Result
  const [result, setResult] = useState<Result | null>(null);

  // Set available engines for active dataset
  useEffect(() => {
    // Require dataset and query
    if (!dataset || !query) {
      return;
    }

    lastQuery.current = query;

    const controller = new AbortController();

    // load Result from API
    const load = async () => {
      // Get a list of (GET) parameters from the query
      const params: Params = {
        object_keywords: query.objectKeywords,
        object_start_date: query.objectStartDate,
        object_end_date: query.objectEndDate,

        engine_id: query.engineId,
        engine_min_score: query.engineMinScore,
        engine_max_score: query.engineMaxScore,

        vocabulary_terms: query.vocabularyTerms,
      };

      // Object params
      query.objectParams.forEach((param) => {
        params['object_param_' + param.id] = param.value;
      });

      // Engine params
      query.engineParams.forEach((param) => {
        params['engine_param_' + param.id] = param.value;
      });

      // Convert the parameters to a query string
      const paramString = Object.entries(params)
        .map(([key, value]) => key + '=' + encodeURIComponent(value))
        .join('&');

      const url =
        API_ROOT +
        'objects/' +
        encodeURIComponent(dataset.id) +
        '/search?' +
        paramString;

      try {
        const response = await fetch(url, { signal: controller.signal });
        const json = await response.json();
        if (json.attributes && json.results && Array.isArray(json.results)) {
          // Cap node return size
          if (json.results.length > MAX_NODES_TO_DISPLAY) {
            setResult({
              highlightExactWords:
                json.highlightExactWords !== undefined
                  ? json.highlightExactWords
                  : true,
              attributes: json.attributes,
              results: json.results.slice(0, MAX_NODES_TO_DISPLAY),
            });
            setError(
              'Too many results received. Only ' +
                MAX_NODES_TO_DISPLAY +
                ' nodes will be displayed. Please make your query more specific.'
            );
          } else {
            setResult(json);
          }
        } else {
          setError('Invalid data received from API');
        }
        setLoading(false);
      } catch (err) {
        // Empty result if the error is not an abort request message
        const isAbortError =
          err instanceof DOMException && err.name === 'AbortError';
        if (!isAbortError) {
          console.error(err);
          setResult(null);
        }
      }
    };

    load();
    setLoading(true);

    return () => {
      controller.abort();
    };
  }, [dataset, query, setError]);

  // send loading event
  useEffect(() => {
    const event = new CustomEvent<EventLoadingQuery>(EVENT_LOADING_QUERY, {
      detail: {
        loading,
      },
    });
    window.dispatchEvent(event);
  }, [loading]);

  return [result, loading, error];
};

export default UseResult;
