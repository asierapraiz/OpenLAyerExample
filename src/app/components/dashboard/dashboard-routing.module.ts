import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { TerrenoListComponent } from './ue/terreno/terreno-list/terreno-list.component';
import { PredioListComponent } from './ua/predio/predio-list/predio-list.component';
import { InteresadoListComponent } from './inte/interesado/interesado-list/interesado-list.component';
import { AgrupacionInteresadosListComponent } from './inte/agrupacion-interesados/agrupacion-interesados-list/agrupacion-interesados-list.component';
import { DASHBOARD_PATHS } from './../../core/util/dashboard.paths';
import { AddRemoveMiembrosComponent } from './inte/agrupacion-interesados/add-remove-miembros/add-remove-miembros.component';
import { ConstruccionListComponent } from './ue/construcciones/construccion-list/construccion-list.component';
import { UnidadConstruccionListComponent } from './ue/unidad-construccion/unidad-construccion-list/unidad-construccion-list.component';
import { DerechosListComponent } from './rrr/derechos/derechos-list/derechos-list.component';
import { CargaInteresadosComponent } from './carga/carga-interesados/carga-interesados/carga-interesados.component';
import { CargaUnidadesEspacialesComponent } from './carga/carga-unidades-espaciales/carga-unidades-espaciales/carga-unidades-espaciales.component';
import { CargaUnidadesAdministrativasComponent } from './carga/carga-unidades-administrativas/carga-unidades-administrativas/carga-unidades-administrativas.component';


const routes: Routes = [
    { path: '', component: DashboardComponent, children: [  
    
    //Terreno
    { path: '',   redirectTo: 'all/terreno', pathMatch: 'full' },   
    { path: 'all/terreno', component: TerrenoListComponent, data: DASHBOARD_PATHS.TERRENOS},
    { path: 'terreno/:terrenoId/terreno', 
    component: TerrenoListComponent, data: DASHBOARD_PATHS.TERRENO_ID},
    { path: 'terreno/:terrenoId/predio/:predioId/terreno', 
    component: TerrenoListComponent, data: DASHBOARD_PATHS.TERRENOS}, 
    { path: 'predio/:predioId/terreno', 
    component: TerrenoListComponent, data: DASHBOARD_PATHS.PREDIO_TERRENOS}, 
    { path: 'construccion/:construccionId/terreno', component: TerrenoListComponent, data: DASHBOARD_PATHS.CONSTRUCCION_TERRENO},
    { path: 'unidadesConstruccion/:unidadId/terreno', component: TerrenoListComponent, data: DASHBOARD_PATHS.UNIDADCONSTRUCCION_TERRENO},
    


    //CargasCsv 
    { path: 'carga-interesado', component: CargaInteresadosComponent, data: DASHBOARD_PATHS.CARGAINTERRESADO},   
    { path: 'cargaunidadesespaciales', component: CargaUnidadesEspacialesComponent, data: DASHBOARD_PATHS.CARGAUNIDADESESPACIALES}, 
    { path: 'cargaunidadesadministrativas', component: CargaUnidadesAdministrativasComponent, data: DASHBOARD_PATHS.CARGAUNIDADESADMINISTRATIVAS},



    //Construcción
    { path: 'all/construccion', component: ConstruccionListComponent, data: DASHBOARD_PATHS.CONSTRUCCIONES}, 
    { path: 'construccion/:construcionId/construccion', component: ConstruccionListComponent, data: DASHBOARD_PATHS.CONSTRUCCION_ID},
    { path: 'terreno/:terrenoId/construccion', component: ConstruccionListComponent, data: DASHBOARD_PATHS.TERRENO_CONSTRUCCIONES}, 
    { path: 'predio/:predioId/terreno/:terrenoId/construccion', component: ConstruccionListComponent, data: DASHBOARD_PATHS.PREDIO_TERRENO_CONSTRUCCIONES}, 
    { path: 'predio/:predioId/construccion', component: ConstruccionListComponent, data: DASHBOARD_PATHS.PREDIO_CONSTRUCCIONES},
    { path: 'terreno/:terrenoId/predio/:predioId/construccion', component: ConstruccionListComponent, 
    data: DASHBOARD_PATHS.TERRENO_PREDIO_CONSTRUCCIONES},      
    { path: 'unidadesConstruccion/:unidadId/construccion', component: ConstruccionListComponent, data: DASHBOARD_PATHS.UNIDADCONSTRUCCION_CONSTRUCCION},

    //UnidadConstrucción
    { path: 'terreno/:terrenoId/predio/:predioId/construccion/:construccionId/unidad-construccion', 
    component: UnidadConstruccionListComponent, data: DASHBOARD_PATHS.TERRENO_PREDIO_CONSTRUCCION_UNIDADCONSTRUCCION},
    { path: 'all/unidadesConstruccion', component: UnidadConstruccionListComponent, data: DASHBOARD_PATHS.UNIDADADCONSTRUCCION}, 
    { path: 'construccion/:construccionId/unidad-construccion', 
    component: UnidadConstruccionListComponent, data: DASHBOARD_PATHS.CONSTRUCCION_UNIDADCONSTRUCCION}, 
    { path: 'terreno/:terrenoId/construccion/:construccionId/unidad-construccion', 
    component: UnidadConstruccionListComponent, data: DASHBOARD_PATHS.TERRENO_CONSTRUCCION_UNIDADCONSTRUCCION},
    { path: 'predio/:predioId/terreno/:terrenoId/construccion/:construccionId/unidad-construccion', 
    component: UnidadConstruccionListComponent, data: DASHBOARD_PATHS.PREDIO_TERRENO_CONSTRUCCION_UNIDADCONSTRUCCION},
    { path: 'predio/:predioId/unidad-construccion', 
    component: UnidadConstruccionListComponent, data: DASHBOARD_PATHS.PREDIO_UNIDADCONSTRUCCION},

    

    
    
    //Servidumbres-todo    
    
    //Predio   
    { path: 'all/predio', component: PredioListComponent, data: DASHBOARD_PATHS.PREDIOS},
    { path: 'predio/:predioId/predio', component: PredioListComponent, data: DASHBOARD_PATHS.PREDIO_ID},
    { path: 'terreno/:terrenoId/predio', component: PredioListComponent, data: DASHBOARD_PATHS.TERRENO_PREDIOS},    
    { path: 'derecho/:derechoId/predio', component: PredioListComponent, data: DASHBOARD_PATHS.DERECHO_PREDIOS}, 
    { path: 'unidadesConstruccion/:unidadId/predio', component: PredioListComponent, data: DASHBOARD_PATHS.UNIDAD_PREDIOS}, 
    { path: 'construccion/:construccionId/predio', component: PredioListComponent, data: DASHBOARD_PATHS.CONSTRUCCION_PREDIO},
    { path: 'interesado/:interesadoId/predio', component: PredioListComponent, data: DASHBOARD_PATHS.INTERESADO_PREDIOS}, 
    


    //Interesado
    { path: 'interesado', component: InteresadoListComponent, data: DASHBOARD_PATHS.INTERESADOS},    
    { path: 'terreno/:terrenoId/predio/:predioId/interesado', 
    component: InteresadoListComponent, data: DASHBOARD_PATHS.TERRENO_PREDIO_INTERESADOS},
    { path: 'predio/:predioId/interesado', 
    component: InteresadoListComponent, data: DASHBOARD_PATHS.PREDIO_INTERESADOS},
    { path: 'terreno/:terrenoId/predio/:predioId/interesado/:interesadoId/agrupacion/:agrupacionId/miembro', 
    component: AddRemoveMiembrosComponent, data: DASHBOARD_PATHS.INTERESADO_AGRUPACION_INTERESADOS_MIEMBROS},    
    { path: 'derecho/:derechoId/interesado',component: InteresadoListComponent, data: DASHBOARD_PATHS.DERECHO_INTERESADOS},

    
    

    //Agrupación Interesado
    { path: 'terreno/:terrenoId/predio/:predioId/interesado/selecciona-agrupacion', 
    component: AgrupacionInteresadosListComponent, data: DASHBOARD_PATHS.TERRENO_PREDIO_INTERESADOS_SELECT_AGRUPACION_INTERESADOS},
    { path: 'derecho/:derechoId/agrupacion',component: InteresadoListComponent, data: DASHBOARD_PATHS.DERECHO_AGRUPACION_INTERESADOS},
    
    //Agrupación Interesado
    { path: 'predio/:predioId/interesado/selecciona-agrupacion', 
    component: AgrupacionInteresadosListComponent, data: DASHBOARD_PATHS.PREDIO_INTERESADOS_SELECT_AGRUPACION_INTERESADOS},
    { path: 'agrupacion-interesado', component: AgrupacionInteresadosListComponent,data: DASHBOARD_PATHS.AGRUPACION_INTERESADOS} ,
    { path: 'terreno/:terrenoId/predio/:predioId/interesado/:interesadoId/agrupacion', 
    component: AgrupacionInteresadosListComponent, data: DASHBOARD_PATHS.TERRENO_PREDIO_INTERESADO_AGRUPACION_INTERESADOS},
    { path: 'interesado/selecciona-agrupacion', 
    component: AgrupacionInteresadosListComponent, data: DASHBOARD_PATHS.INTERESADOS_SELECT_AGRUPACION_INTERESADOS},
    { path: 'interesado/:interesadoId/agrupacion', 
    component: AgrupacionInteresadosListComponent, data: DASHBOARD_PATHS.INTERESADOS_SELECT_AGRUPACION_INTERESADOS},
    { path: 'predio/:predioId/agrupacion', 
    component: AgrupacionInteresadosListComponent, data: DASHBOARD_PATHS.PREDIO_AGRUPACION_INTERESADOS},
    { path: 'terreno/:terrenoId/predio/:predioId/agrupacion', 
    component: AgrupacionInteresadosListComponent, data: DASHBOARD_PATHS.TERRENO_PREDIO_AGRUPACION_INTERESADOS},  
    { path: 'add-remove-miembros', component: AddRemoveMiembrosComponent},  
    { path: 'agrupacion-interesado/:agrupacionId/miembros', 
    component: AddRemoveMiembrosComponent, data: DASHBOARD_PATHS.AGRUPACION_INTERESADOS_MIEMBROS}, 

    //Derechos   
    { path: 'derecho', component: DerechosListComponent, data: DASHBOARD_PATHS.DERECHOS},
    { path: 'interesado/:interesadoId/derecho', component: DerechosListComponent, data: DASHBOARD_PATHS.INTERESADO_DERECHOS},
     
    ]  
  },
    
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
