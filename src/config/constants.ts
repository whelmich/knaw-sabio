const getAPIRoot = (): string => {
  // Get API root from 'api' get param (?api=https://example.com)
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const apiParam = urlParams.get('api');
  if (apiParam) {
    console.log('Using API: ', apiParam);
    return apiParam;
  }

  // Default from ENV
  return process.env.REACT_APP_API_ROOT || '';
};

// Config
export const API_ROOT = getAPIRoot();
export const INCLUDE_API_ROOT =
  process.env.REACT_APP_INCLUDE_API_ROOT === 'true';

// Views
export const VIEW_SCATTERPLOT = 'scatterplot';

// Views combined
export const VIEWS = [VIEW_SCATTERPLOT];

// Dimensions
export const HEADER_HEIGHT = 60;
export const COLUMN_HEADER_HEIGHT = 50;
export const CONTAINER_OFFSET_X = 15;
export const CONTAINER_OFFSET_Y = -15;
export const COLUMN_WIDTH = 345;
export const VIEWPORT_MARGIN = 40;

// Events
export const EVENT_RESET_VIEWPORT = 'sabio_reset_viewport';
export const EVENT_SELECT_OBJECT = 'sabio_select_object';
export const EVENT_HIGHLIGHT_WORD = 'sabio_highlight_word';
export const EVENT_ADD_OBJECT_KEYWORD = 'sabio_add_query_keyword';
export const EVENT_LOADING_QUERY = 'sabio_loading_query';
export const EVENT_RENDERING = 'sabio_rendering';
export const EVENT_UPDATE_MOUSE = 'sabio_update_mouse';

// Limits
export const MANY_NODES_NO_ANIMATION = 25000;
export const MAX_NODES_TO_DISPLAY = 100000;

// Content
export const SABIO_PROJECT_URL =
  'https://www.cultural-ai.nl/projects/post-2-4c8dm';
