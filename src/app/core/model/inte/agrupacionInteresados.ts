import { TipoBase } from "../tc/tipoBase";

export class AgrupacionInteresados {
    id?: number;    
    grupoInteresadoTipo?: TipoBase;    
    nombre?: string;
    comienzoVidaUtilVersion?: Date;   
     
}

export class AgrupacionInteresadosFiltrado extends AgrupacionInteresados{
    comienzoVidaUtilVersionStartDate?: Date;    
    comienzoVidaUtilVersionEndDate?: Date;   
    fechaUltimaModificacionStartDate?: Date;
    fechaUltimaModificacionEndDate?: Date;
    autorUltimaModificacion?: string;
}


