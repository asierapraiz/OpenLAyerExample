import { Injectable, Output, EventEmitter } from '@angular/core';
import { Multipolygon } from '../../model/geometry/multipolygon';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  ////////////////////////////////////////////////////////////////
  private showLayersSource = new Subject<any>();
  showLAyers$ = this.showLayersSource.asObservable();

  showLAyers(layersList: string[]) {
    this.showLayersSource.next(layersList);
  }


  ////////////////////////////////////////////////////////////////
  private addMultiPolygonSource = new Subject<any>();
  addMultiPolygon$ = this.addMultiPolygonSource.asObservable();

  addMultyPolygon(multiPolygon: any) {
    this.addMultiPolygonSource.next(multiPolygon);
  }

  ////////////////////////////////////////////////////////////////
  private rowHighlightSource = new Subject<any>();
  setRowHighlight$ = this.rowHighlightSource.asObservable();

  setRowHighlight(featureId: any) {
    this.rowHighlightSource.next(featureId);
  }

  ////////////////////////////////////////////////////////////////
  private addGeometriaSource = new Subject<any>();
  addGeometria$ = this.addGeometriaSource.asObservable();

  addGeometria(feature: any) {
    this.addGeometriaSource.next(feature);
  }



}
