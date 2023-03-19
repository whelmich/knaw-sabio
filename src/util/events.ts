import {
  EVENT_ADD_OBJECT_KEYWORD,
  EVENT_HIGHLIGHT_WORD,
  EVENT_SELECT_OBJECT,
} from '../config/constants';
import { EventAddObjectKeyword } from '../interfaces/Events';
import { ResultObject } from '../interfaces/Result';

export const setHighlightWord = (highlightWord: string) => {
  const event = new CustomEvent<{ highlightWord: string }>(
    EVENT_HIGHLIGHT_WORD,
    {
      detail: { highlightWord },
    } as CustomEventInit
  );
  window.dispatchEvent(event);
};

export const setSelectedObject = (object: ResultObject | null) => {
  const event = new CustomEvent<{ object: ResultObject | null }>(
    EVENT_SELECT_OBJECT,
    {
      detail: { object },
    } as CustomEventInit
  );
  window.dispatchEvent(event);
};

export const addQueryKeyword = (keyword: string) => {
  const event = new CustomEvent<EventAddObjectKeyword>(
    EVENT_ADD_OBJECT_KEYWORD,
    {
      detail: { keyword },
    } as CustomEventInit
  );
  window.dispatchEvent(event);
};
