import { Point } from './Point';

export type EventRendering = {
  rendering: boolean;
};

export type EventAddObjectKeyword = {
  keyword: string;
};

export type EventLoadingQuery = {
  loading: boolean;
};

export type MouseUpdateEvent = {
  position: Point;
  globalPosition: Point;
};
