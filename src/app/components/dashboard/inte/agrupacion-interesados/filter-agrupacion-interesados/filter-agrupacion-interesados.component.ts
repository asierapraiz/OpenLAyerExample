import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AgrupacionInteresados } from 'src/app/core/model/inte/agrupacionInteresados'
import { TipoBase } from 'src/app/core/model/tc/tipoBase';
import { TipoBaseService } from 'src/app/core/service/tc/tipoBase.service';
import { OptionsPage } from '../../../../../core/model/server/options-page';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-filter-agrupacion-interesados',
  templateUrl: './filter-agrupacion-interesados.component.html',
  styleUrls: ['./filter-agrupacion-interesados.component.scss']
})
export class FilterAgrupacionInteresadosComponent implements OnInit {

  
  aiTipos: TipoBase[] =[];
  formGroup: FormGroup = new FormGroup({});
  AgrupacionInteresado!: AgrupacionInteresados;
  @Output()
  propagar = new EventEmitter<AgrupacionInteresados>();
  @Output()
  propagarLimpiarFiltros = new EventEmitter();

  subscriptions: Subscription[] = [];

  constructor( private tipoBaseService: TipoBaseService  ) { }

  ngOnInit(): void {
    

    this.formGroup = new FormGroup({
      grupoInteresadoTipo: new FormControl('', []),      
      nombre: new FormControl('', []),     
      fechaCapturaStartDate: new FormControl('',[]),
      fechaCapturaEndDate: new FormControl('',[]),
      fechaUltimaModificacionStartDate: new FormControl('',[]),
      fechaUltimaModificacionEndDate: new FormControl('',[]),
      autorUltimaModificacion: new FormControl('', [],)
    });

    const options =  new OptionsPage();
    options.size=20;

    this.getAllAgrupacionInteresadosTipo(options);   
    
  }

  getAllAgrupacionInteresadosTipo(options: any){
    const subscription = this.tipoBaseService.findAll('agrupacioninteresados', options )
    .subscribe(response => {
      this.aiTipos = response.content as TipoBase[];         
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
      this.formGroup.controls[key].value!=''?obj[key]=this.formGroup.controls[key].value.trim():null;      
    });          
    return obj;
  }

}
