import { TipoBase } from "../tc/tipoBase";

export class Interesado {
    id?: number;    
    interesadoTipo?: TipoBase;
    interesadoDocumentoTipo?: TipoBase;
    documentoIdentidad?: string;
    primerNombre?: string;
    segundoNombre?: string;
    primerApellido?: string;
    segundoApellido?: string;
    sexoTipo?: TipoBase;
    grupoEtnicoTipo?: TipoBase;
    grupoEtnicoTipo2?: TipoBase;
    razonSocial?: string;
    nombre?: string;
    autorizacionNotificacionCorreo?: boolean;
    //fechaCaptura?: Date;  
}

export class InteresadoFiltrado extends Interesado{
    //fechaCapturaStartDate?: Date;    
    //fechaCapturaEndDate?: Date;   
    fechaUltimaModificacionStartDate?: Date;
    fechaUltimaModificacionEndDate?: Date;
    autorUltimaModificacion?: string;
}


