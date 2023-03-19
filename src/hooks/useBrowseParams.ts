import { useMemo } from 'react';
import { BrowseParams } from '../interfaces/BrowseParams';
import { useParams, useLocation } from 'react-router-dom';

type BrowseParamsHook = () => BrowseParams;

type WildCardParam = {
  '*'?: string;
};

export const useBrowseParams: BrowseParamsHook = () => {
  // Path params (legacy fallback)
  // Used as default values for the URL search params
  const allParams: string[] = ((useParams() as WildCardParam)['*'] || '')
    .split('/')
    .concat(['', '', '', '', '']);

  const pathParams: BrowseParams = {
    dataset: allParams[0],
    query: allParams[1],
    view: allParams[2],
    attribute: decodeURIComponent(allParams[3] || ''),
    selectedObject: decodeURIComponent(allParams[4] || ''),
  };

  // URL Search params
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);

  const params: BrowseParams = {
    dataset: parseString(queryParams.get('dataset'), pathParams.dataset),
    query: parseString(queryParams.get('query'), pathParams.query),
    view: parseString(queryParams.get('view'), pathParams.view),
    attribute: parseString(queryParams.get('attribute'), pathParams.attribute),
    selectedObject: parseString(
      queryParams.get('selectedObject'),
      pathParams.selectedObject
    ),
  };

  const browseParams = useMemo(() => {
    return {
      dataset: params.dataset,
      query: params.query,
      view: params.view,
      attribute: params.attribute,
      selectedObject: params.selectedObject,
    };
  }, [
    params.dataset,
    params.query,
    params.view,
    params.attribute,
    params.selectedObject,
  ]);

  return browseParams;
};

const parseString = (value: string | null, defaultValue = ''): string =>
  value !== null ? value : defaultValue;

export default useBrowseParams;
