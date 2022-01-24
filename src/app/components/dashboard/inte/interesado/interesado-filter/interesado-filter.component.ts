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
  selector: 'app-interesado-filter',
  templateUrl: './interesado-filter.component.html',
  styleUrls: ['./interesado-filter.component.scss']
})
export class InteresadoFilterComponent implements OnInit {


  public interesadoTipos: TipoBase[] = [];
  public interesadoDocumentoTipos: TipoBase[] = [];
  public sexoTipos: TipoBase[] = [];
  public grupoEtnicoTipos: TipoBase[] = [];  
  

  paginator!: MatPaginator;
  sort!: MatSort;
  formGroup: FormGroup = new FormGroup({});
  predio!: Predio;
  @Output()
  propagar = new EventEmitter<Predio>();
  @Output()
  propagarLimpiarFiltros = new EventEmitter();

  subscriptions: Subscription[] = [];
  
  departamentos=['05', '12'];
  municipios = ['044','1'];
  


  constructor(
    private tipoBaseService: TipoBaseService,     
  ) { }

  ngOnInit(): void {


    this.formGroup = new FormGroup({
      interesadoTipo: new FormControl('', []),
      tipoDocumento: new FormControl('', []), 
      documentoIdentidad: new FormControl('', []), 
      primerNombre: new FormControl('', []),
      primerApellido: new FormControl('', []),
      segundoApellido: new FormControl('', []),
      sexoTipo: new FormControl('', []), 
      grupoEtnicoTipo: new FormControl('', []), 
      razonSocial: new FormControl('', []),
      nombreRazonSocial: new FormControl('', []),
      fechaCapturaStartDate: new FormControl('',[]),
      fechaCapturaEndDate: new FormControl('',[]),
      fechaUltimaModificacionStartDate: new FormControl('',[]),
      fechaUltimaModificacionEndDate: new FormControl('',[]),
      autorUltimaModificacion: new FormControl('', [],)
    });

    const options =  new OptionsPage();
    options.size=20;

    this.getAllInteresadoTipo(options);   
    this.getAllInteresadoDocumentoTipo(options); 
    this.getAllSexoTipo(options); 
    this.getAllGrupoEtnicoTipo(options);  
    
  } 
  ngAfterViewInit(){
    this.formGroup.reset({});
  }  

  getAllInteresadoTipo(options: any){
    const subscription = this.tipoBaseService.findAll('interesadotipo', options )
    .subscribe(response => {
      this.interesadoTipos = response.content as TipoBase[];         
    })
    this.subscriptions.push(subscription);
  }

  getAllInteresadoDocumentoTipo(options: any){
    const subscription = this.tipoBaseService.findAll('interesadoDocumentotipo', options )
    .subscribe(response => {
      this.interesadoDocumentoTipos = response.content as TipoBase[];         
    })
    this.subscriptions.push(subscription);
  }

  getAllSexoTipo(options: any){
    const subscription = this.tipoBaseService.findAll('sexotipo', options )
    .subscribe(response => {
      this.sexoTipos = response.content as TipoBase[];         
    })
    this.subscriptions.push(subscription);
  }

  getAllGrupoEtnicoTipo(options: any){
    const subscription = this.tipoBaseService.findAll('grupoetnico', options )
    .subscribe(response => {
      this.grupoEtnicoTipos = response.content as TipoBase[];         
    })
    this.subscriptions.push(subscription);
  }  

  filtrar() {   
    this.propagar.emit(this.getData());
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
  
}

