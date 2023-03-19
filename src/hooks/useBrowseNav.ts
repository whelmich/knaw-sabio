import { useEffect, useCallback, useRef } from 'react';
import debounce from 'debounce';
import { useNavigate } from 'react-router-dom';
import { createInitialQuery } from './useQuery';
import { Dataset } from '../interfaces/Dataset';
import { Result } from '../interfaces/Result';
import { Engine } from '../interfaces/Engine';
import { Query } from '../interfaces/Query';
import { ResultObject } from '../interfaces/Result';
import { BrowseParams } from '../interfaces/BrowseParams';
import {
  API_ROOT,
  EVENT_ADD_OBJECT_KEYWORD,
  INCLUDE_API_ROOT,
} from '../config/constants';

type BrowseNavHook = (props: {
  params: BrowseParams;
  dataset: Dataset | null;
  engines: Engine[];
  result: Result | null;
  view: string;
  resultLoading: boolean;
  attribute: number | null;
  selectedObject: ResultObject | null;
  query: Query | null;
}) => {
  setQuery: (query: Query) => void;
  setDataset: (dataset: Dataset) => void;
  setView: (view: string) => void;
  setAttribute: (attribute: number) => void;
  setSelectedObject: (object: ResultObject | null) => void;
  resetQuery: () => void;
};

export const useBrowseNav: BrowseNavHook = ({
  params,
  dataset,
  engines,
  query,
  result,
  view,
  attribute,
  selectedObject,
  resultLoading,
}) => {
  // Navigation
  const navigate = useNavigate();
  const lastDataset = useRef<Dataset | null>(null);

  // Update url without query
  useEffect(() => {
    if (!params.query && engines.length > 0 && dataset) {
      lastDataset.current = dataset;

      const newQuery = createInitialQuery(
        dataset,
        engines.filter((engine: Engine) =>
          dataset.available_engines.includes(engine.id)
        )
      );
      // keep some query params
      if (query !== null) {
        newQuery.objectKeywords = query.objectKeywords;
        newQuery.vocabularyTerms = query.vocabularyTerms;
        newQuery.engineMinScore = query.engineMinScore;
        newQuery.engineMaxScore = query.engineMaxScore;
      }

      navigate(
        getBrowseUrl({
          dataset,
          query: newQuery,
          view,
          attribute,
          selectedObject,
        }),
        { replace: true }
      );
    }
  }, [
    navigate,
    engines,
    dataset,
    params.query,
    query,
    view,
    attribute,
    selectedObject,
  ]);

  // Update url with invalid/missing selectedObject
  useEffect(() => {
    const updateSelectedUrl = () => {
      if (!resultLoading && params.selectedObject && result) {
        const selected = result.results.find(
          (object) => object.id === params.selectedObject
        );
        if (!selected) {
          console.warn(
            'The selected object (from url) could not be found in results'
          );
          navigate(getBrowseUrl({ dataset, query, view, attribute }), {
            replace: true,
          });
        }
      }
    };
    const timeout = window.setTimeout(updateSelectedUrl, 1000);
    return () => {
      window.clearTimeout(timeout);
    };
  }, [
    navigate,
    params.selectedObject,
    result,
    dataset,
    query,
    view,
    attribute,
    resultLoading,
  ]);

  // Update url without dataset
  useEffect(() => {
    if (!params.dataset && dataset) {
      lastDataset.current = null;
      navigate(getBrowseUrl({ dataset, query: null, view, attribute }), {
        replace: true,
      });
    }
  }, [navigate, params.dataset, dataset, view, attribute]);

  // Set dataset (updates the url)
  const setDataset = useCallback(
    (dataset: Dataset) => {
      navigate(getBrowseUrl({ dataset, query: null }), { replace: true });
    },
    [navigate]
  );

  // Set Query debounced (updates the url)
  const debouncedSetQuery = useRef<
    | ((() => void) & {
        clear(): void;
      } & {
        flush(): void;
      })
    | null
  >(null);

  const setQuery = useCallback(
    (query: Query, delay: number = 400) => {
      if (debouncedSetQuery.current) {
        debouncedSetQuery.current.clear();
      }
      // create debounce query call
      debouncedSetQuery.current = debounce(() => {
        navigate(
          getBrowseUrl({ dataset, query, view, attribute, selectedObject })
        );
      }, delay);

      debouncedSetQuery.current();
    },
    [navigate, dataset, view, attribute, selectedObject]
  );

  const resetQuery = useCallback(() => {
    dataset && setQuery(createInitialQuery(dataset, engines), 0);
  }, [dataset, engines, setQuery]);

  // Set view (updates the url)
  const setView = useCallback(
    (view: string) => {
      navigate(getBrowseUrl({ dataset, query, view, attribute }));
    },
    [navigate, dataset, query, attribute]
  );

  // Set attribute (updates the url)
  const setAttribute = useCallback(
    (attribute: number) => {
      navigate(
        getBrowseUrl({ dataset, query, view, attribute, selectedObject })
      );
    },
    [navigate, dataset, query, selectedObject, view]
  );

  // Set selected object (updates the url)
  const setSelectedObject = useCallback(
    (selectedObject: ResultObject | null) => {
      navigate(
        getBrowseUrl({
          dataset,
          query,
          view,
          attribute,
          selectedObject,
        })
      );
    },
    [navigate, dataset, query, view, attribute]
  );

  // Add Object Keyword listener
  useEffect(() => {
    const eventListener = ((e: CustomEvent) => {
      // get keyword
      const keyword: string | null =
        e.detail && e.detail.keyword ? (e.detail.keyword as string) : '';
      // combine with current object keywords
      const objectKeywords =
        (query && query.objectKeywords.length > 0
          ? query.objectKeywords.trim() + ', '
          : '') + keyword;

      // unique words
      const wordIndex: { [key: string]: boolean } = {};
      objectKeywords.split(', ').forEach((key) => {
        wordIndex[key] = true;
      });

      const newQuery: Query = Object.assign({}, query, {
        objectKeywords: Object.keys(wordIndex).join(', '),
      });
      setQuery(newQuery);
    }) as EventListener;

    window.addEventListener(EVENT_ADD_OBJECT_KEYWORD, eventListener);
    return () => {
      window.removeEventListener(EVENT_ADD_OBJECT_KEYWORD, eventListener);
    };
  }, [setQuery, query]);

  return {
    setQuery,
    resetQuery,
    setDataset,
    setView,
    setAttribute,
    setSelectedObject,
  };
};

interface BrowseUrl {
  dataset: Dataset | null;
  query: Query | null;
  view?: string | null;
  attribute?: number | null;
  selectedObject?: ResultObject | null;
}

const getBrowseUrl: (props: BrowseUrl) => string = ({
  dataset,
  query,
  view,
  attribute,
  selectedObject,
}) => {
  const queryParams: BrowseParams = {
    dataset: dataset ? dataset.id : '',
    query: query ? JSON.stringify(query) : '',
    view: view || '',
    attribute: attribute ? attribute.toString() : '',
    selectedObject: selectedObject?.id || '',
  };

  // Remove empty keys
  Object.keys(queryParams).forEach((key) => {
    if (queryParams[key as keyof BrowseParams] === '') {
      delete queryParams[key as keyof BrowseParams];
    }
  });

  const params = new URLSearchParams(queryParams as Record<string, string>);

  if (INCLUDE_API_ROOT) {
    params.set('api', API_ROOT);
  }

  return '/browse?' + params.toString();
};

export default useBrowseNav;
