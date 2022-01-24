export interface GeoJSON {
  type: string;
  crs: CRS;
  features: Feature[];
}

export interface CRS {
  type: string;
  properties: Properties;
}

export interface Properties {
  name: string;
}

export interface Feature {
  type: string;
  geometry: Geometry;
}

export interface Geometry {
  type: string;
  coordinates: Array<Array<number[]>>;
}
