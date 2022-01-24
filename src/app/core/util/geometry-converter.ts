import { Polygon } from '../model/geometry/polygon';
import { Multipolygon } from '../model/geometry/multipolygon';
import { GeoJSON } from '../model/geometry/geojson';
import { Point } from '../model/geometry/point';

export class GeometryConverter {
  
/*
  static multipolygonsToGeoJSON(multipolygons: Multipolygon[]): GeoJSON {
    const polygons: Polygon[] = [];
    multipolygons.forEach(multipolygon => {
      multipolygon.poligonos.forEach(polygon => polygons.push(polygon));
    });
    return this.polygonsToGeoJSON(polygons);
  }

  static polygonsToGeoJSON(polygons: Polygon[]): GeoJSON {
    const coordinates = this.polygonsToCoordinates(polygons).map(
      points => {
        return {
          'type': 'Feature',
          'geometry': {
            'type': 'Polygon',
            'coordinates': [points]
          }
        };
      }
    );
    return {
      'type': 'FeatureCollection',
      'crs': {
        'type': 'name',
        'properties': {
          'name': 'EPSG:4326',
        },
      },
      'features': coordinates
    };
  }

  static multipolygonToCoordinates(multipolygon: Multipolygon) : number[][][]{
    return this.polygonsToCoordinates(multipolygon.poligonos);
  }

  static polygonsToCoordinates(polygons: Polygon[]): number[][][] {
    return polygons.map(
      polygon => polygon.puntos.map(point => [point.x, point.y]));
  }
  */
  
}
