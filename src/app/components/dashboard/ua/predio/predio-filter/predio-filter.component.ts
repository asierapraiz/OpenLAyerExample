import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TipoBaseService } from 'src/app/core/service/tc/tipoBase.service';
import { FormControl, FormGroup } from '@angular/forms';
import { TerrenoService } from '../../../../../core/service/ue/terreno.service';
import { Predio} from 'src/app/core/model/ua/predio';
import { TipoBase } from 'src/app/core/model/tc/tipoBase';
import { OptionsPage } from '../../../../../core/model/server/options-page';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { MatSort } from '@angular/material/sort';




@Component({
  selector: 'app-predio-filter',
  templateUrl: './predio-filter.component.html',
  styleUrls: ['./predio-filter.component.scss']
})
export class PredioFilterComponent implements OnInit {


  public claseSuelosTipos: TipoBase[] = [];
  public condicionPredioTipos: TipoBase[] = [];
  public categoriaSuelosTipos: TipoBase[] = [];
  public relacionSuperficieTipos: TipoBase[] = [];
  public estadosPredioTipos: TipoBase[] = [];
  public prediosTipos: TipoBase[] = [];
  public destEconomicasTipos: TipoBase[]=[];


  paginator!: MatPaginator;
  sort!: MatSort;
  formGroup: FormGroup = new FormGroup({});
  predio!: Predio;
  @Output() propagar = new EventEmitter<Predio>();
  @Output() propagarLimpiarFiltros = new EventEmitter();

  subscriptions: Subscription[] = [];
  
  departamentos=['05', '12'];
  municipios = ['044','1'];
  


  constructor(
    private tipoBaseService: TipoBaseService,    
    private terrenoService: TerrenoService,
  ) { }

  ngOnInit(): void {


    this.formGroup = new FormGroup({
      departamento: new FormControl('', []),
      municipio: new FormControl('', []), 
      numeroPredial: new FormControl('', []), 
      operacion: new FormControl('', []),
      claseSueloTipo: new FormControl('', []),
      condicionPredioTipo: new FormControl('', []),
      categoriaSueloTipo: new FormControl('', []), 
      destinacionEconomicaTipo: new FormControl('', []), 
      predioTipo: new FormControl('', []),
      estadoPredio: new FormControl('', []),      
      formControlName: new FormControl('',[]),
      fechaCapturaStartDate: new FormControl('',[]),
      fechaCapturaEndDate: new FormControl('',[]),
      fechaUltimaModificacionStartDate: new FormControl('',[]),
      fechaUltimaModificacionEndDate: new FormControl('',[]),
      autorUltimaModificacion: new FormControl('', [],)
    });

    const options =  new OptionsPage();
    options.size=20;

    this.getAllClaseSueloTipo(options);    
    this.getAllCondicionTipo(options);
    this.getAllCategoriaSueloTipo(options);    
    this.getAllPredioTipo(options);
    this.getAllDestEconomicaTipo(options);
    this.getAllEstadoPredioTipo(options);
    
  } 
  ngAfterViewInit(){
    this.formGroup.reset({});
  }  

  getAllDestEconomicaTipo(options: any) {    
    const subscription = this.tipoBaseService.findAll('destinacioneconomica', options )
    .subscribe(response => {
      this.destEconomicasTipos = response.content as TipoBase[];         
    })
    this.subscriptions.push(subscription);
  } 

  getAllPredioTipo(options: any) {    
    const subscription = this.tipoBaseService.findAll('predio', options )
    .subscribe(response => {
      this.prediosTipos = response.content as TipoBase[];          
    })
    this.subscriptions.push(subscription);
  } 

  getAllCondicionTipo(options: any) {    
    const subscription = this.tipoBaseService.findAll('condicionpredio', options )
    .subscribe(response => {
      this.condicionPredioTipos = response.content as TipoBase[];         
    })
    this.subscriptions.push(subscription);
  } 

  getAllClaseSueloTipo(options: any) {    
    const subscription = this.tipoBaseService.findAll('clasesuelo', options )
    .subscribe(response => {
      this.claseSuelosTipos = response.content as TipoBase[];            
    })
    this.subscriptions.push(subscription);
  } 

  getAllCategoriaSueloTipo(options: any) {    
    const subscription = this.tipoBaseService.findAll('categoriasuelo', options )
    .subscribe(response => {
      this.categoriaSuelosTipos = response.content as TipoBase[];         
    })
    this.subscriptions.push(subscription);
  } 

  getAllDestEconomicoTipo(options: any) {    
    const subscription = this.tipoBaseService.findAll('destinacioneconomica', options )
    .subscribe(response => {
      this.destEconomicasTipos = response.content as TipoBase[];         
    })
    this.subscriptions.push(subscription);
  } 

  getAllEstadoPredioTipo(options: any) {    
    const subscription = this.tipoBaseService.findAll('estadopredio', options )
    .subscribe(response => {
      this.estadosPredioTipos = response.content as TipoBase[];         
    })
    this.subscriptions.push(subscription);
  }

  filtrar() {   
    this.propagar.emit(this.getData());
  }
  limpiarFiltros() {
    this.formGroup.reset({});    
    //console.log("Controls=>", this.formGroup.controls);  
    this.propagar.emit(this.getData());
  }


  private getData(): any {
    var obj: any = {};      
    Object.keys(this.formGroup.controls).forEach(key => {
      this.formGroup.controls[key].value!=null?obj[key]=this.formGroup.controls[key].value:"";      
    });      
    console.log(obj);
    return obj;
  }


  
}

