import { Fill, Stroke, Style } from 'ol/style';
import CircleStyle from 'ol/style/Circle';
import { MultiPoint } from 'ol/geom';
import { style } from '@angular/animations';


export class GeometryStyle {

  static getStyle(tipo: string): Style[] {    
    return [
      new Style({
        stroke: new Stroke({
          color: tipo,
          width: 1,
        }),
        fill: new Fill({
          color: 'rgba(0, 0, 255, 0.1)',
        }),
      }),
      new Style({
        image: new CircleStyle({
          radius: 1,
          fill: new Fill({
            color: 'orange',
          }),
        }),
        geometry: (feature: any) => {
          const coordinates = feature.getGeometry().getCoordinates()[0];
          return new MultiPoint(coordinates);
        },
      })
    ];
  }


  static enProcesoStyle(): Style[] {
    return [
      new Style({
        stroke: new Stroke({
          color: '#d16d1b',
          width: 1,
        }),
        fill: new Fill({
          color: '#e0932d',
        }),
      }),
      new Style({
        image: new CircleStyle({
          radius: 1,
          fill: new Fill({
            color: '#d98e38',
          }),
        }),
        geometry: (feature: any) => {
          const coordinates = feature.getGeometry().getCoordinates()[0];
          return new MultiPoint(coordinates);
        },
      })
    ];
  }

  static terminadoStyle(): Style[] {
    return [
      new Style({
        stroke: new Stroke({
          color: '#5c9172',
          width: 1,
        }),
        fill: new Fill({
          color: '#77c798',
        }),
      }),
      new Style({
        image: new CircleStyle({
          radius: 1,
          fill: new Fill({
            color: '#87c9ac',
          }),
        }),
        geometry: (feature: any) => {
          const coordinates = feature.getGeometry().getCoordinates()[0];
          return new MultiPoint(coordinates);
        },
      })
    ];
  }
}
