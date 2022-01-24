import { Multipolygon } from '../geometry/multipolygon';
import { TipoBase } from '../tc/tipoBase';

export interface Construccion {
    id?: number;
    identificador: string;
    construccionTipo: TipoBase;
    dominioConstruccionTipo: TipoBase;
    numeroPisos: number;
    numeroSotanos: number;
    anioConstruccion: number;
    areaConstruccion: number;
    observaciones: string;
    dimensionTipo: TipoBase;
    relacionSuperficieTipo: TipoBase;
    geometria: Multipolygon[];
    extDireccionId?: number;
    fechaCarga: Date;

}

export interface ConstruccionDto extends Construccion{
    terrenoId: number;
    predioId :number;
}
export interface ConstruccionFilter {
    id?: number;
    identificador?: string;
    construccionTipo?: TipoBase;
    dominioConstruccionTipo?: TipoBase;
    numeroPisos?: number;
    numeroSotanos?: number;
    anioConstruccion?: number;
    areaConstruccion?: number;
    observaciones?: string;
    dimensionTipo?: TipoBase;
    relacionSuperficieTipo?: TipoBase;
    fechaUltimaModificacion?: Date,
    autorUltimaModificacion?: string,
}

