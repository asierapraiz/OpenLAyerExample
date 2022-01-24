import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {  UnidadConstruccionFilter } from 'src/app/core/model/ue/unidadConstruccion';
import { OptionsPage } from '../../../../../core/model/server/options-page';
import { TipoBase } from 'src/app/core/model/tc/tipoBase';
import { TipoBaseService } from 'src/app/core/service/tc/tipoBase.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-unidad-construccion-filter',
  templateUrl: './unidad-construccion-filter.component.html',
  styleUrls: ['./unidad-construccion-filter.component.scss']
})
export class UnidadConstruccionFilterComponent implements OnInit {

  public construccionTipos: TipoBase[] = [];
  public dominiosConstruccionTipos: TipoBase[] = [];
  public unidadConstruccionTipos: TipoBase[] = [];
  public construccionPlantaTipos: TipoBase[] = []
  public usoUnidadConstruccionTipos: TipoBase[] = [];
  public relacionSuperficieTipos: TipoBase[] = [];
  public dimensionTipos: TipoBase[] = []; 


  formGroup: FormGroup = new FormGroup({});  
  @Output() filtrarEvent = new EventEmitter<UnidadConstruccionFilter>();
  @Output() limpiarFiltrosEvent = new EventEmitter();
  @Input() filtrosUnidadConstruccion!: UnidadConstruccionFilter;
  subscriptions: Subscription[] = [];


  constructor(
    private tipoBaseService: TipoBaseService
  ) {}

  ngOnInit(): void {   

    this.formGroup = new FormGroup({
      id: new FormControl(this.filtrosUnidadConstruccion?.id, []),
      identificador: new FormControl(this.filtrosUnidadConstruccion?.identificador, []),
      construccionTipo: new FormControl(this.filtrosUnidadConstruccion?.construccionTipo?.descripcion, []),
      dominioConstruccionTipo: new FormControl(this.filtrosUnidadConstruccion.dominioConstruccionTipo?.descripcion, []),
      construccionPlantaTipo: new FormControl(this.filtrosUnidadConstruccion.construccionPlantaTipo?.descripcion, []),
      plantaUbicacion: new FormControl(this.filtrosUnidadConstruccion.plantaUbicacion, []),
      unidadConstruccionTipo: new FormControl(this.filtrosUnidadConstruccion.usoUnidadConstruccionTipo?.descripcion, []),
      areaConstruida: new FormControl(this.filtrosUnidadConstruccion.areaConstruida, []),
      areaPrivadaConstruida: new FormControl(this.filtrosUnidadConstruccion.areaPrivadaConstruida, []),
      altura: new FormControl(this.filtrosUnidadConstruccion.areaPrivadaConstruida, []),
      observaciones: new FormControl(this.filtrosUnidadConstruccion?.observaciones, []),
      dimensionTipo: new FormControl(this.filtrosUnidadConstruccion.dimensionTipo?.descripcion, []),
      relacionSuperficieTipo: new FormControl(this.filtrosUnidadConstruccion.relacionSuperficieTipo?.descripcion, []),
      fechaCapturaStartDate: new FormControl('',[]),
      fechaCapturaEndDate: new FormControl('',[]),
      fechaUltimaModificacionStartDate: new FormControl('',[]),
      fechaUltimaModificacionEndDate: new FormControl('',[]),
      autorUltimaModificacion: new FormControl('', [],)  
    });  

    const options = new OptionsPage();
    options.size = 20;

    this.getAllRelSuperficieTipo(options);
    this.getAllDimensionTipo(options);
    this.getAllDominioConstruccionTipo(options);
    this.getAllConstruccionTipo(options);
    this.getAllUnidadConstruccionTipo(options);
    this.getAllConstruccionPlantaTipo(options);
    this.getAllUsoUnidadConstruccionTipo(options);
  }

  ngAfterViewInit() {
    //this.formGroup.reset({});     
  }


  getAllConstruccionTipo(options: any) {
    const subscription = this.tipoBaseService.findAll('construccion', options).subscribe(response => {
      this.construccionTipos = response.content as TipoBase[];
    })    
  }
  getAllRelSuperficieTipo(options: any) {
    const subscription = this.tipoBaseService.findAll('relacionsuperficie', options).subscribe(response => {
      this.relacionSuperficieTipos = response.content as TipoBase[];
    })    
  }
  getAllDimensionTipo(options: any) {
    const subscription = this.tipoBaseService.findAll('dimension', options).subscribe(response => {
      this.dimensionTipos = response.content as TipoBase[];
    })   
  }
  getAllDominioConstruccionTipo(options: any) {
    const subscription = this.tipoBaseService.findAll('dominioconstruccion', options).subscribe(response => {
      this.dominiosConstruccionTipos = response.content as TipoBase[];
    })   
  }

  getAllUnidadConstruccionTipo(options: any) {
    const subscription = this.tipoBaseService.findAll('unidadconstruccion', options).subscribe(response => {
      this.unidadConstruccionTipos = response.content as TipoBase[];
    })    
  }
  getAllConstruccionPlantaTipo(options: any) {
    const subscription = this.tipoBaseService.findAll('construccionplanta', options).subscribe(response => {
      this.construccionPlantaTipos = response.content as TipoBase[];
    })    
  }
  getAllUsoUnidadConstruccionTipo(options: any) {
    const subscription = this.tipoBaseService.findAll('usounidadconstruccion', options).subscribe(response => {
      this.usoUnidadConstruccionTipos = response.content as TipoBase[];
    })    
  }

  filtrar() {
    this.filtrarEvent.emit(this.getData());
  }

  limpiarFiltros() {
    this.formGroup.reset({});
    this.limpiarFiltrosEvent.emit();
  }


  private getData(): any {
    var filtros: any = {};
    Object.keys(this.formGroup.controls).forEach(key => {
      this.formGroup.controls[key].value != null ? filtros[key] = this.formGroup.controls[key].value : "";
      filtros[key]==""?delete filtros[key]:null;  
    });    

    return filtros;
  }
}
