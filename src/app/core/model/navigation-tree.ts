import { TerrenoFilterComponent } from "src/app/components/dashboard/ue/terreno/terreno-filter/terreno-filter.component";
import { AgrupacionInteresados } from "./inte/agrupacionInteresados";
import { Interesado } from "./inte/interesado";
import { PredioDto } from "./ua/predio";
import { Terreno } from "./ue/terreno";

export class NavigationTree {
    
    comeFrom!: string;
    terreno!: Terreno;
    terrenoFilter!: {};
    //terrenoId!: number;  
    predio!: PredioDto;
    //predioId!: number;
    predioFilter!: {};
    interesado!: Interesado;
    //interesadoId!: number;
    interesadoFilter!: {};   
    grupoInteresados!: AgrupacionInteresados;
    //grupoInteresadoId!: number;
    grupoInteresadosFilter!: {};      

}