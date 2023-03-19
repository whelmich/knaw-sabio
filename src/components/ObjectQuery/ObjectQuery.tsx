import { FunctionComponent } from 'react';

import DatePicker from 'react-date-picker';
import { Query } from '../../interfaces/Query';
import { Dataset } from '../../interfaces/Dataset';

import ToggleBox from '../ToggleBox/ToggleBox';
import FormBox from '../FormBox/FormBox';
import AutoComplete from '../AutoComplete/AutoComplete';
import { API_ROOT } from '../../config/constants';

interface Props {
  dataset: Dataset;
  query: Query;
  setQuery: (query: Query) => void;
}
const ObjectQuery: FunctionComponent<Props> = ({
  dataset,
  query,
  setQuery,
}) => {
  // Convert object start date to Date object
  const objectStartDate: Date | null = query.objectStartDate
    ? new Date(query.objectStartDate)
    : null;
  // Convert object end date to Date object
  const objectEndDate: Date | null = query.objectEndDate
    ? new Date(query.objectEndDate)
    : null;

  const minDate = new Date(dataset.min_date ? dataset.min_date : '0000-01-01');
  const maxDate = dataset.max_date ? new Date(dataset.max_date) : new Date();

  return (
    <ToggleBox className="ObjectQuery" title="Object metadata">
      {/* Keywords */}
      <FormBox
        title="Keywords"
        description={
          dataset.static_field_descriptions.keywords ||
          'Search for keywords in object metadata'
        }
      >
        <input
          type="search"
          onChange={(e) => {
            setQuery({
              ...query,
              objectKeywords: e.target.value,
            });
          }}
          value={query.objectKeywords}
        />
      </FormBox>

      {/* Date range */}
      <div className="flex">
        {/* Start Date */}
        <FormBox
          title="Start date"
          description={
            dataset.static_field_descriptions.start_date ||
            'Start date of object time range'
          }
          className="no-padding-right "
        >
          <DatePicker
            openCalendarOnFocus={false}
            minDate={minDate}
            maxDate={maxDate}
            format="y/MM/dd"
            value={objectStartDate || minDate}
            onChange={(date: Date) => {
              setQuery({
                ...query,
                objectStartDate: date ? formatDate(date) : '',
              });
            }}
          />
        </FormBox>
        {/* End Date */}
        <FormBox
          title="End date"
          description={
            dataset.static_field_descriptions.end_date ||
            'End date of object time range'
          }
        >
          <DatePicker
            openCalendarOnFocus={false}
            minDate={minDate}
            maxDate={maxDate}
            format="y/MM/dd"
            value={objectEndDate || maxDate}
            onChange={(date: Date) => {
              setQuery({
                ...query,
                objectEndDate: date ? formatDate(date) : '',
              });
            }}
          />
        </FormBox>
      </div>

      {/* Dataset Params */}
      {dataset.params.map((param) => (
        <FormBox
          key={param.id}
          title={param.label}
          description={param.description}
        >
          <AutoComplete
            value={query.objectParams.reduce(
              (value, p) => (p.id === param.id ? p.value : value),
              ''
            )}
            onChange={(value) => {
              setQuery({
                ...query,
                objectParams: query.objectParams.map((p) =>
                  p.id === param.id ? { ...p, value } : p
                ),
              });
            }}
            url={
              API_ROOT +
              'datasets/' +
              encodeURIComponent(dataset.id) +
              '/autocomplete?param=' +
              encodeURIComponent(param.id) +
              '&keyword='
            }
          />
        </FormBox>
      ))}
    </ToggleBox>
  );
};

const formatDate = (date: Date | null): string => {
  if (date == null) {
    return '';
  }
  const offsetMs = date.getTimezoneOffset() * 60 * 1000;
  const msLocal = date.getTime() - offsetMs;
  const dateLocal = new Date(msLocal);
  const iso = dateLocal.toISOString();
  const isoLocal = iso.slice(0, 10);
  return isoLocal;
};

export default ObjectQuery;
