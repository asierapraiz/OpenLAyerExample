import { Component, OnInit,AfterViewInit, Output, Input, EventEmitter } from '@angular/core';
import { RelacionSuperficieTipoService } from 'src/app/core/service/tc/relacion-superficie-tipo.service';
import { RelacionSuperficieTipo } from 'src/app/core/model/tc/relacion-superficie-tipo';
import { DimensionTipo } from 'src/app/core/model/tc/dimension';
import { DimensionTipoService } from 'src/app/core/service/tc/dimension-tipo.service';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TerrenoService } from '../../../../../core/service/ue/terreno.service';
import { Terreno, TerrenoFilter } from '../../../../../core/model/ue/terreno';

import { OptionsPage } from '../../../../../core/model/server/options-page';
import { Polygon } from '../../../../../core/model/geometry/polygon';





@Component({
  selector: 'app-terreno-filter',
  templateUrl: './terreno-filter.component.html',
  styleUrls: ['./terreno-filter.component.scss']
})
export class TerrenoFilterComponent implements OnInit, AfterViewInit {

  public relacionSuperficieTipos: RelacionSuperficieTipo[] = [];
  public dimensionTipos: DimensionTipo[] = [];
  formGroup!: FormGroup;
  terreno!: Terreno;
  @Output() filtrarEvent = new EventEmitter<TerrenoFilter>();
  @Output() limpiarFiltrosEvent = new EventEmitter();  
  @Input() filtrosTerreno!: TerrenoFilter;


  constructor(
    private dimensionTipoService: DimensionTipoService,
    private relacionSuperficieTipoService: RelacionSuperficieTipoService,
    private terrenoService: TerrenoService,
  ) { }

  ngOnInit(): void {

    this.formGroup = new FormGroup({
      id: new FormControl(this.filtrosTerreno?.id, []),
      areaTerreno: new FormControl(this.filtrosTerreno?.areaTerreno, [Validators.maxLength(2)]),
      localId: new FormControl(this.filtrosTerreno?.localId, []),
      dimensionTipo: new FormControl(this.filtrosTerreno.dimensionTipo?.descripcion, []), 
      relacionSuperficieTipo: new FormControl(this.filtrosTerreno.relacionSuperficieTipo?.descripcion, []) ,
      fechaCargaStartDate: new FormControl('',[]),
      fechaCargaEndDate: new FormControl('',[]),
      fechaUltimaModificacionStartDate: new FormControl('',[]),
      fechaUltimaModificacionEndDate: new FormControl('',[]),
      autorUltimaModificacion: new FormControl('', [],)       
    });

    this.getAllRelSuperficieTipo();
    this.getAllDimensionTipo();
  } 

  ngAfterViewInit(){
    //this.formGroup.reset({});       
  }


  getAllRelSuperficieTipo() {
    this.relacionSuperficieTipoService.findAll().subscribe((tipos: RelacionSuperficieTipo[]) => {
      this.relacionSuperficieTipos = tipos;
    });
  }

  getAllDimensionTipo() {
    this.dimensionTipoService.findAll().subscribe((tipos: DimensionTipo[]) => {
      this.dimensionTipos = tipos;
    });
  }

  filtrar() {
    this.filtrarEvent.emit(this.getData());
  }
  
  limpiarFiltros() {
    this.formGroup.reset({});
    console.log("Controls=>", this.formGroup.controls);
    this.limpiarFiltrosEvent.emit();
  }


  private getData(): any {
    var filtros: any = {};
    Object.keys(this.formGroup.controls).forEach(key => {
      this.formGroup.controls[key].value!=null?filtros[key]=this.formGroup.controls[key].value:null;  
      filtros[key]==""?delete filtros[key]:null;    
    });    
    
    return filtros;
  }
}
