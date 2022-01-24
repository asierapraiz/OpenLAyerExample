import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, Output, EventEmitter } from '@angular/core';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import XYZ from 'ol/source/XYZ';
import * as Proj from 'ol/proj';
import {
  defaults as defaultControls,
  Control
} from 'ol/control';
import { GeoJSON } from 'ol/format';
import { Extent } from 'ol/extent';
import { GeometryStyle } from '../../../core/util/geometry-style';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import { Draw, Modify, Snap } from 'ol/interaction';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import GeometryType from 'ol/geom/GeometryType';
import { LinearRing, MultiPolygon, Polygon, SimpleGeometry } from 'ol/geom';
import { MapService } from 'src/app/core/service/map/map.service';
import { Feature } from 'ol';
import MousePosition from 'ol/control/MousePosition';
import { createStringXY, Coordinate } from 'ol/coordinate';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SettingsService } from 'src/app/core/service/settings/settings.service';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { GLOBAL_CONSTANTS } from 'src/app/shared/utils/global-constants';



export const DEFAULT_HEIGHT = '450px';
export const DEFAULT_WIDTH = '100%';
export const DEFAULT_ZOOM = 20;
export const DEFAULT_LAT = 0;
export const DEFAULT_LON = 0;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {


  lat: number = DEFAULT_LAT;
  lon: number = DEFAULT_LON;
  zoom: number = DEFAULT_ZOOM;
  minZoom!: number;
  actualZoom!: number;
  width: string | number = DEFAULT_WIDTH;
  height: string | number = DEFAULT_HEIGHT;

  subscriptions: Subscription[] = [];


  target: string = 'map-' + Math.random().toString(36).substring(2);

  @Output() changedEmit = new EventEmitter();

  raster = new TileLayer({ source: new OSM(), });
  terrenoLayer = new VectorLayer();
  construccionLayer = new VectorLayer();
  unidadesLayer = new VectorLayer();
  source = new VectorSource();
  geometrySource = new VectorSource();


  /*
  vector = new VectorLayer({
    source: this.source,
    style: new Style({
      fill: new Fill({
        color: 'rgba(255, 255, 255, 0.2)',
      }),
      stroke: new Stroke({
        color: '#ffcc33',
        width: 2,
      }),
      image: new CircleStyle({
        radius: 7,
        fill: new Fill({
          color: '#ffcc33',
        }),
      }),
    }),
  });*/


  modify!: any;
  map: Map;
  typeSelect: GeometryType = GeometryType.POLYGON;
  draw: any;
  snap: any;
  isDrawing = false;
  polygonList: any[] = [];
  drawLayer: VectorLayer;
  selected: any;
  hover: any = null;
  baseLayer: VectorLayer = new VectorLayer();
  mousePositionControl!: MousePosition;
  visibleLayers: any = new Set();
  path: string;
  




  private mapEl!: HTMLElement;

  constructor(
    private activatedRoute: ActivatedRoute,
    private settingsService: SettingsService,
    private snackBar: MatSnackBar,
    private elementRef: ElementRef,
    private mapService: MapService) { }

  ngOnInit(): void {

    this.path = this.activatedRoute.snapshot.data.title;
    console.log("map, path=>", this.path);

    this.getZoom();

    /////////////////////////////////////////////////////////////////////Modificar las capas visibles
    let showLayers$ = this.mapService.showLAyers$.subscribe(

      (layers) => {

        this.terrenoLayer.setVisible(false);
        this.construccionLayer.setVisible(false);
        this.unidadesLayer.setVisible(false);
        this.baseLayer.setVisible(false);

        this.visibleLayers.clear();
        layers.forEach((element: any) => {
          this.visibleLayers.add(element);
        });
        this.visibleLayers.forEach((capa: any) => {
          switch (capa) {
            case 'capaBase':
              this.baseLayer.setVisible(true);
              break;
            case 'Terrenos':
              this.terrenoLayer.setVisible(true);
              break;
            case 'Construcciones':
              this.construccionLayer.setVisible(true);
              break;
            case 'Unidades':
              this.unidadesLayer.setVisible(true);
              break;
          }
        });
        console.log("capas en capas.comp =>", this.visibleLayers);
      }
    )
  }

  ngAfterViewInit(): void {
    this.mapEl = this.elementRef.nativeElement.querySelector('#' + this.target);
    this.setSize();

    this.mousePositionControl = new MousePosition({
      coordinateFormat: createStringXY(4),
      projection: 'EPSG:4326',
      className: 'custom-mouse-position',
      target: this.elementRef.nativeElement.querySelector('#mouse-position'),
    });
    this.raster = new TileLayer({
      source: new OSM(),
    });

    this.map = new Map({
      target: this.target,
      layers: [this.raster],
      view: new View({
        center: Proj.fromLonLat([this.lon, this.lat]),
        zoom: this.zoom
      }),
      controls: defaultControls({ attribution: false, zoom: false }).extend([this.mousePositionControl])
    });

    this.modify = new Modify({ source: this.source });
    this.map.addInteraction(this.modify);

    var t = this;
    /*
      this.map.on('pointermove', function (e) {
        if (t.hover!== null) {
          t.hover.setStyle(undefined);
          t.hover = null;
        }

        t.map.forEachFeatureAtPixel(e.pixel, function (f: any) {
          t.hover = f;
          f.setStyle(highlightStyle);
          return true;
        });
      });
    */
    this.map.on('singleclick', function (layer) {

      if (t.isDrawing) {
        return;
      }
      /*if (t.selected !== null) {
        t.selected.setStyle(undefined);
        t.selected = null;
      }*/

      t.baseLayer.getSource().forEachFeature(function (feature) {
        feature.getId() == t.selected.id ? feature.setStyle(undefined) : '';
      });

      t.map.forEachFeatureAtPixel(layer.pixel, function (f: any) {
        t.selected = f;
        console.log("id:", f['id_']);
        f.setStyle(highlightStyle);
        t.mapService.setRowHighlight(t.selected.id_);
        return true;
      });
      
    });


    this.map.on("moveend", function (e) {
      t.actualZoom = t.map.getView().getZoom() as number;
      if (t.actualZoom > t.minZoom) {
        t.changedEmit.emit();
      }
    });

  }//Fin de ngAfterViewInit

  ngOnDestroy(): void {
    this.subscriptions.forEach(x => x.unsubscribe());
  }

  private getZoom() {
    const subscription = this.settingsService.getZoom().subscribe(
      (response) => {
        this.minZoom = response.setting;
      },
      () => alert('Error al cargar el minZoom')
    );
    this.subscriptions.push(subscription);
  }


  getPolygonList() {
    return this.polygonList;
  }

  addInteractions() {
    this.isDrawing = true;
    this.draw = new Draw({
      source: this.source,
      type: this.typeSelect,
      geometryFunction: function (coordsOrig: any, geom) { // Controla que no se dibujen vértices dentro e otro polígono

        var coords: [][] = [];
        var mensaje = "";
        if (!geom) {
          geom = new Polygon([]);
        }
        coordsOrig.forEach((c: any) => {
          c.forEach((cc: any) => {
            coords.push(cc);
          });
        });

        if (coords.length > 1) {
          var ultimaCoord: number[] = coords[coords.length - 1];
          var penultimaCoord: number[] = coords[coords.length - 2];

          let minX = penultimaCoord[0] - 0.2;
          let minY = penultimaCoord[1] - 0.2;
          let maxX = penultimaCoord[0] + 0.2;
          let maxY = penultimaCoord[1] + 0.2;

          let extent: Extent = [minX, minY, maxX, maxY];

          let estaContenidoPorPoligono: Boolean = false;
          let estaFueraDelTerreno: Boolean = false;
          let estaFueraDeConstruccion: Boolean = false;





          //Si estamos en lapágina de terrenos...
          if (t.path == 'Terrenos') {
            t.geometrySource.forEachFeatureIntersectingExtent(extent, function (feature) {

              //Permite pintar sólo dentro de un terreno
              if (feature.getGeometry()?.intersectsCoordinate(penultimaCoord)) {
                estaContenidoPorPoligono = true;
              }
              //Permite pintar en el borde de otro polígono.
              var closest = feature.getGeometry()?.getClosestPoint(penultimaCoord);
              if (closest![0] == penultimaCoord[0] && closest![1] == penultimaCoord[1]) {
                estaContenidoPorPoligono = false;
              } else {
                mensaje = 'No se puede un terreno dentro de otro'
              }
            });
          }


          //Si estamos en la página de construcciones..
          if (t.path == 'Construcciones') {
            estaFueraDelTerreno = true;
            mensaje = 'No se puede crear una construccion fuera de un terreno';

            t.terrenoLayer.getSource().forEachFeatureIntersectingExtent(extent, function (feature) {

              //Permite pintar dentro de un terreno
              if (feature.getGeometry()?.intersectsCoordinate(penultimaCoord)) {
                estaFueraDelTerreno = false;
              }

              //Permite pintar en el borde del terreno
              var closest = feature.getGeometry()?.getClosestPoint(penultimaCoord);
              if (closest![0] != penultimaCoord[0] && closest![1] != penultimaCoord[1]) {
                estaContenidoPorPoligono = false;
              } else {
                mensaje = 'No se puede crear un terreno dentro de otro'
              }
            });
          }

          //Si estamos en la página de uidades de construcción...          
          if (t.path.includes('Unidades')) {
            estaFueraDeConstruccion = true;
            mensaje = 'No se puede crear una unidad de construcción fuera de una construcción.';

            t.construccionLayer.getSource()?.forEachFeatureIntersectingExtent(extent, function (feature) {

              //Permite pintar sólo dentro de una construcción
              if (feature.getGeometry()?.intersectsCoordinate(penultimaCoord)) {
                estaFueraDeConstruccion = false;
              }

            });
          }

          //Si cumple alguno de los límites no permite pintar y salta un mensaje de error
          if (estaContenidoPorPoligono || estaFueraDelTerreno || estaFueraDeConstruccion) {
            t.openSnackBar(mensaje, '', 'alert');
            coords.pop();
            coords.pop();
            coords.push(ultimaCoord as []);
            coordsOrig[0].pop();
            coordsOrig[0].pop();
            coordsOrig[0].push(ultimaCoord);
          }
          geom.setCoordinates([coords]);
        }
        return geom;
      }
    });

    this.map.addInteraction(this.draw);


    this.addSnapLayer();
    this.addDrawLayer();
    var t = this;

    this.draw.on('drawend', function (evt: any) {

      let coords = evt.feature.getGeometry().getCoordinates() as Coordinate[][];
      coords[0].push(coords[0][0]);

      t.polygonList.push(coords);
      t.mapService.addMultyPolygon(t.polygonList);

      var writer = new GeoJSON();

      var geoJsonStr = writer.writeGeometryObject(new MultiPolygon([coords]));

      t.isDrawing = false;
      t.drawLayer.getSource().clear();
      t.removeInteractions();
      t.mapService.addGeometria(geoJsonStr);
    });


  }

  removeInteractions() {
    this.isDrawing = false;
    this.map.removeInteraction(this.draw);
    this.map.removeInteraction(this.snap);
  }

  private setSize() {
    if (this.mapEl) {
      const styles = this.mapEl.style;
      styles.height = coerceCssPixelValue(this.height) || DEFAULT_HEIGHT;
      styles.width = coerceCssPixelValue(this.width) || DEFAULT_WIDTH;
    }
  }

  openSnackBar(message: string, action: string, className: string) {
    this.snackBar.open(message, action, {
      duration: GLOBAL_CONSTANTS.alertDuration,
      panelClass: [className]
    });
  }

  public setMarker(vector: VectorLayer) {
    this.map.addLayer(vector);
  }

  public setControl(control: Control) {
    this.map.addControl(control);
  }

  loadGeometrias(datasource: any, color: string, reSize?: Boolean): void {
    
    console.log("loadGeometrias");
    this.map.removeLayer(this.baseLayer);
    this.geometrySource = new VectorSource({
      features: new GeoJSON().readFeatures(
        {
          'type': 'FeatureCollection',
          'crs': {
            'type': 'name',
            'properties': {
              'name': 'EPSG:3857',
            },
          },
          'features': datasource.map((element: any) => {
            return {
              'type': 'Feature',
              'id': element.id,
              'geometry': element.geometria
            };
          })
        }
      ),
    });
    this.baseLayer = new VectorLayer({
      minZoom: this.minZoom,
      source: this.geometrySource,
      style: GeometryStyle.getStyle(color)
    });
    this.map.addLayer(this.baseLayer);
    let t = this;   

    if (reSize) {
      this.map.getView().fit(this.geometrySource.getExtent() as Extent);
      //this.actualZoom = this.map.getView().getZoom() as number;
    }


    if (this.selected) {
      let t = this;
      this.baseLayer.getSource().forEachFeature(function (feature) {
        feature.getId() == t.selected.id ? feature.setStyle(highlightStyle) : '';
      });
    }

  }



  loadTerrenos(datasource: any, color: string, reSize?: Boolean): void {
    console.log("loadTerrenos");

    this.map.removeLayer(this.terrenoLayer);    
    let source = new VectorSource({
      features: new GeoJSON().readFeatures(
        {
          'type': 'FeatureCollection',
          'crs': {
            'type': 'name',
            'properties': {
              'name': 'EPSG:3857',
            },
          },
          'features': datasource.map((element: any) => {
            return {
              'type': 'Feature',
              'id': element.id,
              'geometry': element.geometria
            };
          })
        }
      ),
    });
    this.terrenoLayer = new VectorLayer({
      minZoom: this.minZoom,
      source: source,
      style: GeometryStyle.getStyle(color)
    });
    this.terrenoLayer.set('name', 'terrenos')
    this.map.addLayer(this.terrenoLayer);
    if (reSize) {
      this.map.getView().fit(source.getExtent() as Extent);
      //this.actualZoom = this.map.getView().getZoom() as number;
    }
  }


  loadConstrucciones(datasource: any, color: string, reSize?: Boolean): void {
    console.log("loadConstrucciones");
    this.map.removeLayer(this.construccionLayer);
    let source = new VectorSource({
      features: new GeoJSON().readFeatures(
        {
          'type': 'FeatureCollection',
          'crs': {
            'type': 'name',
            'properties': {
              'name': 'EPSG:3857',
            },
          },
          'features': datasource.map((element: any) => {
            return {
              'type': 'Feature',
              'id': element.id,
              'geometry': element.geometria
            };
          })
        }
      ),
    });
    this.construccionLayer = new VectorLayer({
      minZoom: this.minZoom,
      source: source,
      style: GeometryStyle.getStyle(color)
    });
    this.construccionLayer.set('name', 'construcciones')
    this.map.addLayer(this.construccionLayer);
    if (reSize) {
      this.map.getView().fit(source.getExtent() as Extent);
    }
  }

  loadUnidades(datasource: any, color: string): void {
    this.map.removeLayer(this.unidadesLayer);
    const source = new VectorSource({
      features: new GeoJSON().readFeatures(
        {
          'type': 'FeatureCollection',
          'crs': {
            'type': 'name',
            'properties': {
              'name': 'EPSG:3857',
            },
          },
          'features': datasource.map((element: any) => {
            return {
              'type': 'Feature',
              'id': element.id,
              'geometry': element.geometria
            };
          })
        }
      ),
    });
    this.unidadesLayer = new VectorLayer({
      minZoom: this.minZoom,
      source: source,
      style: GeometryStyle.getStyle(color)
    });

    this.map.addLayer(this.unidadesLayer);
    this.map.getView().fit(source.getExtent() as Extent);

  }

  addSnapLayer() {

    if (this.baseLayer.getSource() != null) {
      this.snap = new Snap({ source: this.baseLayer.getSource() });
      this.map.addInteraction(this.snap);
    }

    if (this.terrenoLayer.getSource() != null) {
      this.snap = new Snap({ source: this.terrenoLayer.getSource() });
      this.map.addInteraction(this.snap);
    }

    if (this.construccionLayer.getSource() != null) {
      this.snap = new Snap({ source: this.construccionLayer.getSource() });
      this.map.addInteraction(this.snap);
    }
  }

  addDrawLayer() {
    this.isDrawing = true;
    this.drawLayer = new VectorLayer({
      source: this.source,
      style: new Style({
        fill: new Fill({
          color: 'rgba(255, 255, 255, 0.2)',
        }),
        stroke: new Stroke({
          color: '#faa861',
          width: 5,
        }),
        image: new CircleStyle({
          radius: 7,
          fill: new Fill({
            color: '#81c97f',
          }),
        }),
      }),
    });
    this.map.addLayer(this.drawLayer);
  }

  getExtent() {
    return this.map.getView().calculateExtent(this.map.getSize());
  }

  searchInMap(uEspacial: any, tipo: any) {

    this.selected = uEspacial;
    var geom = new GeoJSON().readGeometry(uEspacial.geometria);
    this.map.getView().fit(geom.getExtent());
    this.baseLayer.getSource().forEachFeature(function (feature) {
      feature.getId() == uEspacial.id ? feature.setStyle(highlightStyle) : feature.setStyle(GeometryStyle.getStyle(tipo));
    });
  }

  addDraw() {
    !this.isDrawing ? this.addInteractions() : this.removeInteractions();
  }

  clearPolygons() {
    /*
 this.map.getLayers().forEach(layer => {
   if (layer instanceof VectorLayer) {
     this.map.removeLayer(layer);
   }
 });*/
    this.polygonList = [];
    this.removeInteractions();

    var features = this.drawLayer.getSource().getFeatures();
    features.forEach((feature) => {
      this.drawLayer.getSource().removeFeature(feature);
    });

    this.map.removeLayer(this.drawLayer);
    // removes the last feature from the vector source.


  }

}

const cssUnitsPattern = /([A-Za-z%]+)$/;

function coerceCssPixelValue(value: any): string {
  if (value == null) {
    return '';
  }

  return cssUnitsPattern.test(value) ? value : `${value}px`;
}

const highlightStyle = new Style({
  fill: new Fill({
    color: 'rgba(255,255,255,0.7)',
  }),
  stroke: new Stroke({
    color: '#3399CC',
    width: 1,
  }),
});
