export interface Query {
  // object
  objectKeywords: string;
  objectStartDate: string;
  objectEndDate: string;
  objectParams: Param[];

  // engine
  engineId: string;
  engineMinScore: number;
  engineMaxScore: number;
  engineParams: Param[];

  // vocabulary
  vocabularyTerms: string;
}

export interface Param {
  id: string;
  value: string;
}
