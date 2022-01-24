import VectorLayer from 'ol/layer/Vector';
import Map from 'ol/Map';

export class GeometryUtils {

  static clearPolygons(map: Map) {
    map.getLayers().forEach(layer => {
      if (layer instanceof VectorLayer) {
        map.removeLayer(layer);
      }
    });
  }
}
