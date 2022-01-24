import { Component, OnInit,AfterViewInit, Output, Input, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ConstruccionFilter } from 'src/app/core/model/ue/construccion';
import { OptionsPage } from '../../../../../core/model/server/options-page';
import { TipoBase } from 'src/app/core/model/tc/tipoBase';
import { TipoBaseService } from 'src/app/core/service/tc/tipoBase.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-construccion-filter',
  templateUrl: './construccion-filter.component.html',
  styleUrls: ['./construccion-filter.component.scss']
})
export class ConstruccionFilterComponent implements OnInit {

  public relacionSuperficieTipos: TipoBase[] = [];
  public dimensionTipos: TipoBase[] = [];
  public dominiosConstruccionTipos: TipoBase[]=[]
  public construccionTipos: TipoBase[]=[];
 
  
  
  formGroup: FormGroup = new FormGroup({});  
  @Output() filtrarEvent = new EventEmitter<ConstruccionFilter>();
  @Output() limpiarFiltrosEvent = new EventEmitter();  
  @Input() filtrosConstruccion!: ConstruccionFilter;
  subscriptions: Subscription[] = [];


  constructor(
    private tipoBaseService: TipoBaseService  
  ) { }

  ngOnInit(): void {

    this.formGroup = new FormGroup({
      id: new FormControl(this.filtrosConstruccion?.id, []),
      construccionTipo: new FormControl(this.filtrosConstruccion?.construccionTipo?.descripcion, []),
      dominioConstruccionTipo: new FormControl(this.filtrosConstruccion.dominioConstruccionTipo?.descripcion, []), 
      dimensionTipo: new FormControl(this.filtrosConstruccion.dimensionTipo?.descripcion, []),      
      anioConstruccion: new FormControl(this.filtrosConstruccion?.anioConstruccion, []) ,
      areaConstruccion: new FormControl(this.filtrosConstruccion?.areaConstruccion, []), 
      observaciones: new FormControl(this.filtrosConstruccion?.observaciones, []),        
      relacionSuperficieTipo: new FormControl(this.filtrosConstruccion.relacionSuperficieTipo?.descripcion, []), 
      fechaCargaStartDate: new FormControl('',[]),
      fechaCargaEndDate: new FormControl('',[]),
      fechaUltimaModificacionStartDate: new FormControl('',[]),
      fechaUltimaModificacionEndDate: new FormControl('',[]),
      autorUltimaModificacion: new FormControl('', [],)  
    });

    const options =  new OptionsPage();
    options.size=20;

    this.getAllRelSuperficieTipo(options);
    this.getAllDimensionTipo(options);
    this.getAllDominioConstruccionTipo(options);
    this.getAllConstruccionTipo(options);     
  } 

  ngAfterViewInit(){
    //this.formGroup.reset({});       
  }

  getAllConstruccionTipo(options: any){
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

  getAllDominioConstruccionTipo(options: any){
    const subscription = this.tipoBaseService.findAll('dominioconstruccion', options).subscribe(response => {
      this.dominiosConstruccionTipos = response.content as TipoBase[]; 
    })       
  }


  emitFiltrar() {
    this.filtrarEvent.emit(this.getData());
  }

  limpiarFiltros() {
    this.formGroup.reset({});
    this.limpiarFiltrosEvent.emit();
  }


  private getData(): any {
    var filtros: any = {};
    Object.keys(this.formGroup.controls).forEach(key => {
      this.formGroup.controls[key].value!=null?filtros[key]=this.formGroup.controls[key].value:"";    
      filtros[key]==""?delete filtros[key]:null;  
    }); 
    
    return filtros;
  }
}
