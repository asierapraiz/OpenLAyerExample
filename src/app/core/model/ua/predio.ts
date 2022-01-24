import { TipoBase } from "../tc/tipoBase";

export class PredioDto {
    id?: number;
    departamento?: string;
    municipio?: string;
    operacion?: string;
    numeroPredial?: string;
    fechaCaptura?: Date;
    predioTipo?: TipoBase;
    condicionPredioTipo?: TipoBase;
    estadoPredio?: TipoBase;
    claseSueloTipo?: TipoBase;    
    categoriaSueloTipo?: TipoBase;
    destinacionEconomicaTipo?:TipoBase;    
    relacionSuperficieTipo?: TipoBase;   
}

export class Predio {

    id?: number;
    departamento?: string;
    autorUltimaModificacion?: string;
    municipio?: string;
    operacion?: string;
    numeroPredial?: string;
    fechaCaptura?: Date;
    fechaUltimaModificacion?: Date;
    predioTipo?: TipoBase;
    condicionPredioTipo?: TipoBase;
    estadoPredio?: TipoBase;
    claseSueloTipo?: TipoBase;
    extdireccionId?: number ;
    categoriaSueloTipo?: TipoBase;
    destinacionEconomicaTipo?:TipoBase;    
    relacionSuperficieTipo?: TipoBase;    

}
