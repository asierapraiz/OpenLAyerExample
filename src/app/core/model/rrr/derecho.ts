import { AgrupacionInteresados } from "../inte/agrupacionInteresados";
import { Interesado } from "../inte/interesado";
import { DerechoTipo } from "../tc/derechotipo";
import { Predio } from "../ua/predio";

export class Derecho {
    predio?: Predio;  
    interesado?: Interesado;
    descripcion?: string;
    derechoTipo?: DerechoTipo;
    fechaInicioTenencia?: Date;
    fechaUltimaModificacion?: Date;
    fraccionDerecho?: number;
    agrupacionInteresado?: AgrupacionInteresados;
    autorUltimaModificacion?: string
}

export class DerechoDTO {

    id?: number;
    derechoTipoId?: number;
    fraccionDerecho?: number;
    fechaInicioTenencia?: Date;
    descripcion?: string;
    interesadoId?: number;
    predioId?: number;
    agrupacionInteresadoId?: number;
    autorUltimaModificacion?: string;
}

export class DerechoFiltradoDTO extends DerechoDTO {

    fechaInicioTenenciaStartDate?: Date;    
    fechaInicioTenenciaEndDate?: Date;   
    fechaUltimaModificacionStartDate?: Date;
    fechaUltimaModificacionEndDate?: Date;
}

