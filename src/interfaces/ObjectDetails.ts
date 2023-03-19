export interface ObjectDetails {
  id: string;
  name: string;
  description: string;
  thumbnail_url: string;
  image_url: string;
  source_url: string;
  attributes: Attributes;
}

export interface Attributes {
  [key: string]: string;
}
