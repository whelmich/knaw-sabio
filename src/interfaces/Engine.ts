export interface Engine {
  id: string;
  name: string;
  min_score: number;
  params: EngineParam[];
}

export interface EngineParam {
  id: string;
  label: string;
  description: string;
  control: string;
  default: string;
  options: Map<string, string>;
}
