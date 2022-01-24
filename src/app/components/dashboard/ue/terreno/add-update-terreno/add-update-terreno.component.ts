import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Terreno } from '../../../../../core/model/ue/terreno';
import { Subscription } from 'rxjs';
import { TerrenoService } from '../../../../../core/service/ue/terreno.service';
import { DimensionTipoService } from 'src/app/core/service/tc/dimension-tipo.service';
import { RelacionSuperficieTipoService } from 'src/app/core/service/tc/relacion-superficie-tipo.service';
import { RelacionSuperficieTipo } from 'src/app/core/model/tc/relacion-superficie-tipo';
import { DimensionTipo } from 'src/app/core/model/tc/dimension';
import { Multipolygon } from 'src/app/core/model/geometry/multipolygon';
import { MapService } from 'src/app/core/service/map/map.service';



@Component({
  selector: 'app-add-update-terreno',
  templateUrl: './add-update-terreno.component.html',
  styleUrls: ['./add-update-terreno.component.scss']
})
export class AddUpdateTerrenoComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];
  formGroup: FormGroup = new FormGroup({});

  public relacionSuperficieTipos: RelacionSuperficieTipo[] = [];
  public dimensionTipos: DimensionTipo[] = [];


  terreno!: Terreno;
  polygonList: Multipolygon= this.data.multiPolygonList;
  geometria!: any;


  constructor(
    private mapService: MapService,
    protected matDialogRef: MatDialogRef<AddUpdateTerrenoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private terrenoService: TerrenoService,
    private dimensionTipoService: DimensionTipoService,
    private relacionSuperficieTipoService: RelacionSuperficieTipoService
  ) {
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  ngOnInit(): void {    
    this.terreno = this.data.terreno;    
    this.geometria = this.data.geometria;
    


    this.createFormGroup();
    this.getAllRelSuperficieTipo();
    this.getAllDimensionTipo();
    this.getFormValidationErrors();

    /*    
    const points: Point[] = [];
    this.terreno?.geometria.poligonos.forEach(poligono => {
    poligono.puntos.forEach(point => points.push(point));
    });
    points.splice(-1, 1);
    */

  }//Fin de ngOnInit

  createFormGroup() {

    this.formGroup = new FormGroup({
      areaTerreno: new FormControl(this.terreno?.areaTerreno, [Validators.required, Validators.min(0)]),
      dimensionTipo: new FormControl(this.terreno?.dimensionTipo?.descripcion, []),
      relacionSuperficieTipo: new FormControl(this.terreno?.relacionSuperficieTipo?.descripcion, []),
      localId: new FormControl(this.terreno?.localId, [Validators.required]),
      /*       
      extDireccionId: new FormControl(this.terreno?.extDireccion)
       */
    });
  }

  getFormValidationErrors() {

    //console.log('%c ==>> Validation Errors: ', 'color: red; font-weight: bold; font-size:25px;');

    let totalErrors = 0;

    Object.keys(this.formGroup.controls).forEach(key => {
      const controlErrors: any = this.formGroup.get(key)?.errors;
      if (controlErrors != null) {
        totalErrors++;
        Object.keys(controlErrors).forEach(keyError => {
          console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
        });
      }
    });
    console.log('Number of errors: ', totalErrors);
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
  
/*
  createItem(): void {
    this.geometria.push(new FormGroup({
      x: new FormControl(0, [Validators.required]),
      y: new FormControl(0, [Validators.required]),
    }));
  }*/

  getTitle(): string {
    return this.terreno?.id ? 'Actualizar Terreno' : 'Añadir terreno';
  }

  closeModal(terreno?: Terreno): void {
    this.matDialogRef.close(terreno);
  }

  saveOrUpdate(): void {
    const observable$ = this.isSaveOrUpdate() ? this.terrenoService.update(this.getData()) :
      this.terrenoService.create(this.getData());
    this.subscriptions.push(
      observable$.subscribe(
        (terrenoDto) => {
          this.closeModal(terrenoDto);           
        },        
        () => alert(this.isSaveOrUpdate() ? 'Error al actualizar' : 'Error al guardar')
      )
    );
  }

  private isSaveOrUpdate(): boolean {
    return Boolean(this.terreno?.id);
  }

  private getData(): Terreno {

    let dimensionTipo: any  = this.dimensionTipos.find(x => x.descripcion === this.formGroup.controls.dimensionTipo.value);
    let relacionSuperficieTipo: any  = this.relacionSuperficieTipos.find(x => x.descripcion === this.formGroup.controls.relacionSuperficieTipo.value);

    let geometria;
    this.isSaveOrUpdate()?geometria=this.terreno.geometria: geometria=this.geometria;

    /*
    const points = this.formGroup.controls.geometria.value;
    points.push(points[0]);
    const polygon: Polygon = { puntos: points };*/

    
    return {
      id: this.terreno?.id,
      localId: this.formGroup.controls.localId.value,
      geometria: geometria,
      areaTerreno: this.formGroup.controls.areaTerreno.value,
      extDireccionId: this.terreno?.extDireccionId,
      dimensionTipo: dimensionTipo,
      relacionSuperficieTipo: relacionSuperficieTipo,
      fechaCarga: this.terreno ? this.terreno.fechaCarga : new Date()      
    };
  }
}
