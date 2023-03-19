export interface Dataset {
  id: string;
  name: string;
  source_url: string;
  object_count: number;
  min_date: string;
  max_date: string;
  params: DatasetParam[];
  available_engines: string[];
  static_field_descriptions: StaticFieldDescriptions;
}

export interface StaticFieldDescriptions {
  keywords?: string;
  start_date?: string;
  end_date?: string;
}

export interface DatasetParam {
  id: string;
  label: string;
  description: string;
  control: string;
  options: Map<string, string>;
}
