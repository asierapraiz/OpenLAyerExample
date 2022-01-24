import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { DerechoDTO, DerechoFiltradoDTO } from 'src/app/core/model/rrr/derecho';
import { OptionsPage } from 'src/app/core/model/server/options-page';
import { TipoBase } from 'src/app/core/model/tc/tipoBase';
import { DerechoService } from 'src/app/core/service/rrr/derecho.service';
import { TipoBaseService } from 'src/app/core/service/tc/tipoBase.service';

@Component({
  selector: 'app-derechos-filter',
  templateUrl: './derechos-filter.component.html',
  styleUrls: ['./derechos-filter.component.scss']
})
export class DerechosFilterComponent implements OnInit {

  paginator!: MatPaginator;
  sort!: MatSort;
  formGroup: FormGroup = new FormGroup({});

  public derechos: any[] = [];
  public derechostipos: any[] = [];
  public predios: any[] = [];
  public interesados: any[] = [];
  public agrupacioninteresados: any[]=[];

  subscriptions: Subscription[] = [];

  @Output()
  propagar = new EventEmitter<DerechoFiltradoDTO>();
  @Output()
  propagarLimpiarFiltros = new EventEmitter();

  constructor(
    private tipoBaseService: TipoBaseService,
    private derechoService: DerechoService
  ) { }

  ngOnInit(): void {

    this.formGroup = new FormGroup({
     /*  id: new FormControl('', []), */
      derechoTipoId: new FormControl('', []), 
      fraccionDerecho: new FormControl('', [Validators.min(0), Validators.max(1)]), 
      fechaInicioTenencia: new FormControl('', []),
      descripcion: new FormControl('', []),
      interesadoId: new FormControl('', []),
      predioId: new FormControl('', []), 
      agrupacionInteresadoId: new FormControl('', []), 
      fechaInicioTenenciaStartDate: new FormControl('', []),
      fechaInicioTenenciaEndDate: new FormControl('', []),
      fechaUltimaModificacionStartDate: new FormControl('',[]),
      fechaUltimaModificacionEndDate: new FormControl('',[]),
    });
    
    const options =  new OptionsPage();
    options.size=20;

    /* this.getAllDerechos(options); */
    this.getAllDerechosTipos();
    this.getAllPredios();
    this.getAllInteresados();
    this.getAllAgrupacionInteresados();
  }

  ngAfterViewInit(){
    this.formGroup.reset({});
  }  

  filtrar() {   
    const datos=this.getData();
    this.propagar.emit(datos);
  }

  limpiarFiltros() {
    this.formGroup.reset({});    
    this.propagar.emit(this.getData());
  }

  private getData(): any {
    var obj: any = {};      
    Object.keys(this.formGroup.controls).forEach(key => {
      this.formGroup.controls[key].value!=null?obj[key]=this.formGroup.controls[key].value:"";      
    });     
    return obj;
  }

  getAllDerechos(options?: any){
    const subscription = this.tipoBaseService.findAllnoTipo('derecho', options )
    .subscribe(response => {
      this.derechos = response.content as TipoBase[];         
    })
    this.subscriptions.push(subscription);
  }
  getAllDerechosTipos(options?: any){
    const subscription = this.tipoBaseService.findAll('derechotipo', options )
    .subscribe(response => {
      this.derechostipos = response.content as TipoBase[];         
    })
    this.subscriptions.push(subscription);
  }
  getAllPredios(options?: any){
    const subscription = this.tipoBaseService.findAllnoTipo('predio', options )
    .subscribe(response => {
      this.predios = response.content as TipoBase[];         
    })
    this.subscriptions.push(subscription);
  }
  getAllInteresados(options?: any){
    const subscription = this.tipoBaseService.findAllnoTipo('interesado', options )
    .subscribe(response => {
      this.interesados = response.content as TipoBase[];         
    })
    this.subscriptions.push(subscription);
  }
  
  getAllAgrupacionInteresados(options?: any){
        const subscription = this.tipoBaseService.findAllnoTipo('agrupacionInteresados', options )
    .subscribe(response => {
      this.agrupacioninteresados = response.content as TipoBase[];         
    })
    this.subscriptions.push(subscription);
  }
}
