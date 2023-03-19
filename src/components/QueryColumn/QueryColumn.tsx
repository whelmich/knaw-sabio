import React, {
  FunctionComponent,
  useEffect,
  useState,
  useCallback,
  memo,
} from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import classnames from 'clsx';

import { Dataset } from '../../interfaces/Dataset';
import { Engine } from '../../interfaces/Engine';
import { Query } from '../../interfaces/Query';

import ObjectQuery from '../ObjectQuery/ObjectQuery';
import EngineQuery from '../EngineQuery/EngineQuery';
import VocabularyQuery from '../VocabularyQuery/VocabularyQuery';

import './QueryColumn.scss';
import { COLUMN_WIDTH } from '../../config/constants';
import QueryColumnHeader from './QueryColumnHeader';

interface Props {
  loading: boolean;
  dataset: Dataset;
  engines: Engine[];
  query: Query;
  resetQuery: () => void;
  setQuery: (query: Query, delay?: number) => void;
  setEnginePopup: (engine: Engine | null) => void;
}

const QueryColumn: FunctionComponent<Props> = ({
  loading,
  dataset,
  engines,
  query,
  setQuery,
  resetQuery,
  setEnginePopup,
}) => {
  // Local query
  const [localQuery, setLocalQuery] = useState(query);

  // Update local query
  useEffect(() => {
    if (query !== null) {
      setLocalQuery(query);
    }
  }, [query]);

  // Update the query, both local and using the callback
  const updateQuery = useCallback(
    (query: Query) => {
      setLocalQuery(query);
      setQuery(query);
    },
    [setQuery]
  );

  return (
    <div className={classnames('QueryColumn', { loading })}>
      <QueryColumnHeader resetQuery={resetQuery} />
      <Scrollbars className="Scrollbar" style={{ width: COLUMN_WIDTH }}>
        <ObjectQuery
          dataset={dataset}
          query={localQuery}
          setQuery={updateQuery}
        />
        <EngineQuery
          engines={engines}
          query={localQuery}
          setQuery={updateQuery}
          setEnginePopup={setEnginePopup}
        />
        <VocabularyQuery query={localQuery} setQuery={updateQuery} />
      </Scrollbars>
    </div>
  );
};

export default memo(QueryColumn);
