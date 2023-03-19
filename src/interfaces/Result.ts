export interface Result {
  highlightExactWords: boolean;
  attributes: string[];
  results: ResultObject[];
}

export interface ResultObject {
  id: string;
  name: string;
  thumbnail_url: string;
  values: string[];
  x: number[];
  score: number;
  score_details: ScoreDetails;
}

export interface ScoreDetails {
  [key: string]: number;
}
