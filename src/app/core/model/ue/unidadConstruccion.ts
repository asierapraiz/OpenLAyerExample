import { Multipolygon } from '../geometry/multipolygon';
import { TipoBase } from '../tc/tipoBase';

export interface UnidadConstruccion {
    id?: number;
    identificador: string;
    dominioConstruccionTipo: TipoBase;
    construccionTipo: TipoBase;
    unidadConstruccionTipo: TipoBase;
    construccionPlantaTipo: TipoBase; 
    plantaUbicacion: number,
    usoUnidadConstruccionTipo: TipoBase; 
    areaConstruida: number;
    areaPrivadaConstruida: number;
    altura: number;    
    observaciones: string;
    dimensionTipo: TipoBase;
    relacionSuperficieTipo: TipoBase;
    geometria: Multipolygon[];
    construccionId: number;
    extDireccionId?: number;
    fechaCaptura: Date;
}

export interface UnidadConstruccionDto extends UnidadConstruccion{
    construccionId: number;
    predioId :number;
}

export interface UnidadConstruccionFilter {
    id?: number;
    identificador?: string;
    dominioConstruccionTipo?: TipoBase;
    construccionTipo?: TipoBase;
    unidadConstruccionTipo?: TipoBase;
    construccionPlantaTipo?: TipoBase; 
    plantaUbicacion?: number,
    usoUnidadConstruccionTipo?: TipoBase; 
    areaConstruida?: number;
    areaPrivadaConstruida?: number;
    altura?: number;    
    observaciones?: string;
    dimensionTipo?: TipoBase;
    relacionSuperficieTipo?: TipoBase;
    geometria?: Multipolygon;
    construccionId?: number;
    extDireccionId?: number;
    fechaCaptura?: Date;
}

