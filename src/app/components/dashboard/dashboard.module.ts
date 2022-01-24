import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { NavMenuComponent } from './templates/nav-menu/nav-menu.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { MapComponent } from './map/map.component';
import { TerrenoListComponent } from './ue/terreno/terreno-list/terreno-list.component';
import { AddUpdateTerrenoComponent } from './ue/terreno/add-update-terreno/add-update-terreno.component';
import { InfoPopupComponent } from './ue/terreno/info-popup/info-popup.component';
import { TerrenoFilterComponent } from './ue/terreno/terreno-filter/terreno-filter.component';
import { PredioListComponent } from './ua/predio/predio-list/predio-list.component';
import { PredioFilterComponent } from './ua/predio/predio-filter/predio-filter.component';
import { AddUpdatePredioComponent } from './ua/predio/add-update-predio/add-update-predio.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { NavegacionDialogComponent } from './navegacion-dialog/navegacion-dialog.component';
import { InteresadoListComponent } from './inte/interesado/interesado-list/interesado-list.component';
import { InteresadoFilterComponent } from './inte/interesado/interesado-filter/interesado-filter.component';
import { TableNavigationMenuComponent } from './table-navigation-menu/table-navigation-menu.component';
import { AddUpdateInteresadoComponent } from './inte/interesado/add-update-interesado/add-update-interesado.component';
import { AgrupacionInteresadosListComponent } from './inte/agrupacion-interesados/agrupacion-interesados-list/agrupacion-interesados-list.component';
import { AddUpdateAgrupacionInteresadosComponent } from './inte/agrupacion-interesados/add-update-agrupacion-interesados/add-update-agrupacion-interesados.component';
import { FilterAgrupacionInteresadosComponent } from './inte/agrupacion-interesados/filter-agrupacion-interesados/filter-agrupacion-interesados.component';
import { SharedComponentsModule } from './../../shared/components/shared-components.module';
import { BreadcrumbsComponent } from 'src/app/components/dashboard/breadcrumbs/breadcrumbs.component';
import { AddRemoveMiembrosComponent } from './inte/agrupacion-interesados/add-remove-miembros/add-remove-miembros.component';
import { ConstruccionListComponent } from './ue/construcciones/construccion-list/construccion-list.component';
import { ConstruccionFilterComponent } from './ue/construcciones/construccion-filter/construccion-filter.component';
import { ConstruccionAddUpdateComponent } from './ue/construcciones/construccion-add-update/construccion-add-update.component';
import { UnidadConstruccionListComponent } from './ue/unidad-construccion/unidad-construccion-list/unidad-construccion-list.component';
import { UnidadConstruccionFilterComponent } from './ue/unidad-construccion/unidad-construccion-filter/unidad-construccion-filter.component';
import { UnidadConstruccionAddUpdateComponent } from './ue/unidad-construccion/unidad-construccion-add-update/unidad-construccion-add-update.component';
import { InfoComponent } from './info/info.component';
import { DerechosListComponent } from './rrr/derechos/derechos-list/derechos-list.component';
import { DerechosFilterComponent } from './rrr/derechos/derechos-filter/derechos-filter.component';
import { DerechosAddUpdateComponent } from './rrr/derechos/derechos-add-update/derechos-add-update.component';
import { CapasComponent } from './capas/capas.component';
import { CargaUnidadesEspacialesComponent } from './carga/carga-unidades-espaciales/carga-unidades-espaciales/carga-unidades-espaciales.component';
import { CargaUnidadesAdministrativasComponent } from './carga/carga-unidades-administrativas/carga-unidades-administrativas/carga-unidades-administrativas.component';
import { CargaInteresadosComponent } from './carga/carga-interesados/carga-interesados/carga-interesados.component';



@NgModule({
  declarations: [
    DashboardComponent,      
    NavMenuComponent,      
    MapComponent,
    TerrenoListComponent,
    AddUpdateTerrenoComponent,   
    InfoPopupComponent,
    TerrenoFilterComponent,
    PredioListComponent,
    PredioFilterComponent,   
    AddUpdatePredioComponent, 
    ConfirmDialogComponent, 
    NavegacionDialogComponent, 
    InteresadoListComponent, 
    InteresadoFilterComponent, 
    TableNavigationMenuComponent,
    AddUpdateInteresadoComponent,
    AgrupacionInteresadosListComponent,
    AddUpdateAgrupacionInteresadosComponent,
    FilterAgrupacionInteresadosComponent,
    BreadcrumbsComponent,
    AddRemoveMiembrosComponent,    
    ConstruccionListComponent,
    ConstruccionFilterComponent,
    ConstruccionAddUpdateComponent,  
    UnidadConstruccionListComponent,
    UnidadConstruccionFilterComponent,
    UnidadConstruccionAddUpdateComponent,    
    InfoComponent,   
    DerechosListComponent,
    DerechosFilterComponent,
    DerechosAddUpdateComponent,
    CapasComponent,
    CargaUnidadesEspacialesComponent,
    CargaUnidadesAdministrativasComponent,
    CargaInteresadosComponent,
  ],
  imports: [
    MaterialModule,
    CommonModule,
    DashboardRoutingModule,     
    SharedComponentsModule
  ]
})
export class DashboardModule { }
