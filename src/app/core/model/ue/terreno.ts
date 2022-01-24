import { Multipolygon } from '../geometry/multipolygon';
import { DimensionTipo } from '../tc/dimension';
import { Extdireccion } from '../extdireccion';
import { RelacionSuperficieTipo } from '../tc/relacion-superficie-tipo';
import { TipoBase } from '../tc/tipoBase';
import { Polygon } from 'ol/geom';

export interface Terreno {
  id: number;
  areaTerreno: number;
  geometria: string;
  dimensionTipo: TipoBase;
  relacionSuperficieTipo: TipoBase;
  fechaCarga: Date;
  fechaUltimaModificacion?: DataView,
  autorUltimaModificacion?: string,
  localId: string;
  extDireccionId: number;
}


export interface TerrenoFilter {
  id?: number;
  areaTerreno?: number;  
  dimensionTipo?: DimensionTipo;
  relacionSuperficieTipo?: RelacionSuperficieTipo;
  fechaCarga?: Date;
  fechaUltimaModificacion?: Date,
  autorUltimaModificacion?: string,
  localId?: string;
 
  
}