import { Component, Inject,  OnInit, Output, EventEmitter, NgZone, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { UnidadConstruccion, UnidadConstruccionDto } from '../../../../../core/model/ue/unidadConstruccion'
import { ConstruccionService } from 'src/app/core/service/ue/construccion.service';
import { TipoBase } from 'src/app/core/model/tc/tipoBase';
import { TipoBaseService } from 'src/app/core/service/tc/tipoBase.service';
import { OptionsPage } from '../../../../../core/model/server/options-page';
import { take} from 'rxjs/operators';
import { CdkTextareaAutosize} from '@angular/cdk/text-field';
import { Router, ActivatedRoute } from '@angular/router';
import { UnidadConstruccionService } from 'src/app/core/service/ue/unidadDeConstruccion.service';
import { Multipolygon } from 'src/app/core/model/geometry/multipolygon';
import { UepredioService } from 'src/app/core/service/rel/uepredio.service';
import { Construccion } from 'src/app/core/model/ue/construccion';
import { UePredio } from 'src/app/core/model/rel/uePredio';
import { Predio } from 'src/app/core/model/ua/predio';
import { PredioService } from 'src/app/core/service/ua/predio.service';
import { CustomConfirmDialogComponent } from './../../../../../shared/components/custom-confirm-dialog/custom-confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';








@Component({
  selector: 'app-unidad-construccion-add-update',
  templateUrl: './unidad-construccion-add-update.component.html',
  styleUrls: ['./unidad-construccion-add-update.component.scss']
})
export class UnidadConstruccionAddUpdateComponent implements OnInit {


  @ViewChild('autosize') autosize!: CdkTextareaAutosize;

  public construccionTipos: TipoBase[] = [];
  public dominiosConstruccionTipos: TipoBase[] = [];
  public unidadConstruccionTipos: TipoBase[] = [];
  public construccionPlantaTipos: TipoBase[] = []
  public usoUnidadConstruccionTipos: TipoBase[] = [];
  public relacionSuperficieTipos: TipoBase[] = [];
  public dimensionTipos: TipoBase[] = [];
  public prediosOfTerreno: Predio[] = [];

  private subscriptions: Subscription[] = [];
  title!: any;  
  formGroup: FormGroup = new FormGroup({}); 
  terrenoId!: number;
  predioId!: number;
  construccionId!: number;
  unidadConstruccion!: UnidadConstruccion;
  polygonList: Multipolygon[]= this.data.multiPolygonList;
  geometria!: any;

  

  @Output() propagar = new EventEmitter<UnidadConstruccion>();  

  constructor(
    private predioService: PredioService,
    private uepredioService: UepredioService,
    private _ngZone: NgZone,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    protected matDialogRef: MatDialogRef<UnidadConstruccionAddUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private construccionService: ConstruccionService,
    private tipoBaseService: TipoBaseService,
    private service: UnidadConstruccionService,
    private route: Router
    
  ) {
  }

  
  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  ngOnInit(): void {   

    this.unidadConstruccion = this.data.unidadConstruccion; 
    this.geometria = this.data.geometria;    
    this.construccionId = this.data.construccionId;    
    

    //Edición
    this.unidadConstruccion!=null?this.getRelacionesDeLaUnidad():'';     

    this.unidadConstruccion?.id?
    this.title = `Actualizar unidad de construcción id:${this.unidadConstruccion.id}` :
    this.title = `Crear unidad de construcción en la construcción id:${this.construccionId}`;
      

    const options =  new OptionsPage();
    options.size=20;

    this.createFormGroup();
    this.getAllRelSuperficieTipo(options);
    this.getAllDimensionTipo(options);
    this.getAllDominioConstruccionTipo(options);
    this.getAllConstruccionTipo(options);
    this.getAllUnidadConstruccionTipo(options);
    this.getAllConstruccionPlantaTipo(options);
    this.getAllUsoUnidadConstruccionTipo(options);    
    this.getAllPrediosOfConstruccion(this.construccionId);

    //this.construccionId!=null?this.getAllPrediosOfConstruccion(this.terrenoId):'';    

  } 

  ngAfterViewInit(){
       
  }

  createFormGroup() {   
    this.formGroup = new FormGroup({
      identificador: new FormControl(this.unidadConstruccion?.identificador, []),
      predio: new FormControl(this.predioId, []),
      construccionTipo: new FormControl(this.unidadConstruccion?.construccionTipo?.descripcion, []), 
      dominioConstruccionTipo: new FormControl(this.unidadConstruccion?.dominioConstruccionTipo?.descripcion, []), 
      unidadConstruccionTipo: new FormControl(this.unidadConstruccion?.unidadConstruccionTipo?.descripcion, []),
      construccionPlantaTipo: new FormControl(this.unidadConstruccion?.construccionPlantaTipo?.descripcion, []),
      plantaUbicacion: new FormControl(this.unidadConstruccion?.plantaUbicacion, []),
      usoUnidadConstruccionTipo: new FormControl(this.unidadConstruccion?.usoUnidadConstruccionTipo?.descripcion, []),
      areaConstruida: new FormControl(this.unidadConstruccion?.areaConstruida, []),
      areaPrivadaConstruida: new FormControl(this.unidadConstruccion?.areaPrivadaConstruida, []),
      altura: new FormControl(this.unidadConstruccion?.areaPrivadaConstruida, []),
      observaciones: new FormControl(this.unidadConstruccion?.observaciones, []),
      dimensionTipo: new FormControl(this.unidadConstruccion?.dimensionTipo?.descripcion, []),
      relacionSuperficieTipo: new FormControl(this.unidadConstruccion?.relacionSuperficieTipo?.descripcion, []),
    });
  }


  getAllConstruccionTipo(options: any) {
    const subscription = this.tipoBaseService.findAll('construccion', options).subscribe(response => {
      this.construccionTipos = response.content as TipoBase[];
    })
    this.subscriptions.push(subscription);
  }
  getAllRelSuperficieTipo(options: any) {
    const subscription = this.tipoBaseService.findAll('relacionsuperficie', options).subscribe(response => {
      this.relacionSuperficieTipos = response.content as TipoBase[];
    })
    this.subscriptions.push(subscription);
  }
  getAllDimensionTipo(options: any) {
    const subscription = this.tipoBaseService.findAll('dimension', options).subscribe(response => {
      this.dimensionTipos = response.content as TipoBase[];
    })
    this.subscriptions.push(subscription);
  }
  getAllDominioConstruccionTipo(options: any) {
    const subscription = this.tipoBaseService.findAll('dominioconstruccion', options).subscribe(response => {
      this.dominiosConstruccionTipos = response.content as TipoBase[];
    })
    this.subscriptions.push(subscription);
  }

  getAllUnidadConstruccionTipo(options: any) {
    const subscription = this.tipoBaseService.findAll('unidadconstruccion', options).subscribe(response => {
      this.unidadConstruccionTipos = response.content as TipoBase[];
    })
    this.subscriptions.push(subscription);
  }
  getAllConstruccionPlantaTipo(options: any) {
    const subscription = this.tipoBaseService.findAll('construccionplanta', options).subscribe(response => {
      this.construccionPlantaTipos = response.content as TipoBase[];      
    })
    this.subscriptions.push(subscription);
  }
  getAllUsoUnidadConstruccionTipo(options: any) {
    const subscription = this.tipoBaseService.findAll('usounidadconstruccion', options).subscribe(response => {
      this.usoUnidadConstruccionTipos = response.content as TipoBase[];
    })
    this.subscriptions.push(subscription);
  } 

  getRelacionesDeLaUnidad() {       
    const subscription = this.uepredioService.filter({ "construccionId": this.construccionId }).pipe(
      map((page) => {
        return page.content.map(uepredioDto => {
          const uePredio: UePredio = {
            ...uepredioDto
          };
          return uePredio;
        });
      }),
    ).subscribe(
      uePredio => {
        this.terrenoId = uePredio[0].terrenoId;
        this.getAllPrediosOfConstruccion(this.terrenoId);
        this.predioId = uePredio[0].predioId;        
        this.formGroup.patchValue({
          predio: this.predioId});        
      },
      () => {
      }
    );
    this.subscriptions.push(subscription);
  }

  getAllPrediosOfConstruccion(id: number) {      
    const subscription = this.predioService.getAllPrediosOfConstruccion(id).pipe(
      map((page: any) => {
        return page.content.map((predioDto: any) => {
          const predio: any = {
            ...predioDto
          };
          return predio;
        });
      }),
    ).subscribe(
      (predios: Predio[]) => {
        
        //(Unique)=> Filtro por id único, ya que pueden llegar varios registros con el mismo id.
        //La tabla rel_uePredio, registra varias tuplas por terreno y preio, ya que puede haber varias construcciones y unidades de construccion, para el mismo predio y mismo terreno.
        this.prediosOfTerreno = Array.from(new Set(predios.map(a => a.id))).map(id => { return predios.find(a => a.id === id) }) as Predio[];
        

      },
      () => {
        //alert('No hay predios relacionadas con la construción.');
        this.openNoPredioAlert();
      }
    );
    this.subscriptions.push(subscription);
  }

  openNoPredioAlert() {
    let message = "No hay predios relacionadas con el terreno.Tendrás que crear uno.";
    let confirmBtnText = "Ir a predios";
    let closeBtnText = "Continuar";

    const data = { 'message': message, 'confirmBtnText': confirmBtnText, 'closeBtnText': closeBtnText };

    const config = {
      width: '400px',
      disableClose: false,
      data: data
    };

    const dialogRef = this.dialog.open(CustomConfirmDialogComponent, config);
    dialogRef.afterClosed().subscribe(result => {
      if (result.data) {
        this.closeModal();
        this.route.navigate([`dashboard/terreno/${this.terrenoId}/predio`]);

      }
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

  
  closeModal(unidadConstruccion?: UnidadConstruccion): void {
    this.matDialogRef.close(unidadConstruccion);
  }

  deletePoint(index: number) {
    (this.formGroup.controls.geometria as FormArray).removeAt(index);
  }

  saveOrUpdate(): void {
    const observable$ = this.isSaveOrUpdate() ? this.service.update(this.getData()) :
      this.service.create(this.getData());
    this.subscriptions.push(
      observable$.subscribe(
        (construccionDto) => this.closeModal(construccionDto),
        () => alert(this.isSaveOrUpdate() ? 'Error al actualizar' : 'Error al guardar')
      )
    );
  }

  private isSaveOrUpdate(): boolean {
    return Boolean(this.unidadConstruccion?.id);
  }

  private getData(): UnidadConstruccionDto {

    let dimensionTipo: any = this.dimensionTipos.find(x => x.descripcion === this.formGroup.controls.dimensionTipo.value);
    let construccionTipo: any = this.construccionTipos.find(x => x.descripcion === this.formGroup.controls.construccionTipo.value);
    let usoUnidadConstruccionTipo: any = this.unidadConstruccionTipos.find(x => x.descripcion === this.formGroup.controls.usoUnidadConstruccionTipo.value);
    let relacionSuperficieTipo: any = this.relacionSuperficieTipos.find(x => x.descripcion === this.formGroup.controls.relacionSuperficieTipo.value);
    let construccionPlantaTipo: any = this.construccionPlantaTipos.find(x => x.descripcion === this.formGroup.controls.construccionPlantaTipo.value);
    let unidadConstruccionTipo: any = this.unidadConstruccionTipos.find(x => x.descripcion === this.formGroup.controls.unidadConstruccionTipo.value);
    let dominioConstruccionTipo: any = this.dominiosConstruccionTipos.find(x => x.descripcion === this.formGroup.controls.dominioConstruccionTipo.value);
    
    let geometria;
    this.isSaveOrUpdate() ? geometria = this.unidadConstruccion.geometria : geometria = this.geometria;  
    

    return {
      geometria: geometria,
      id: this.unidadConstruccion?.id,     
      identificador: this.formGroup.controls.identificador.value,   
      construccionTipo: construccionTipo,
      dominioConstruccionTipo: dominioConstruccionTipo,
      unidadConstruccionTipo: unidadConstruccionTipo,
      construccionPlantaTipo: construccionPlantaTipo,
      plantaUbicacion: this.formGroup.controls.plantaUbicacion.value,  
      usoUnidadConstruccionTipo: usoUnidadConstruccionTipo,
      areaConstruida: this.formGroup.controls.areaConstruida.value, 
      areaPrivadaConstruida: this.formGroup.controls.areaPrivadaConstruida.value,
      altura: this.formGroup.controls.altura.value,
      observaciones: this.formGroup.controls.observaciones.value,
      dimensionTipo: dimensionTipo,
      relacionSuperficieTipo: relacionSuperficieTipo,      
      extDireccionId: this.construccionId,          
      fechaCaptura: this.unidadConstruccion ? this.unidadConstruccion.fechaCaptura : new Date(),     
      construccionId: this.construccionId,
      predioId: this.formGroup.controls.predio.value
    };    
  }

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable.pipe(take(1)).subscribe(() => this.autosize.resizeToFitContent(true));
  }
}


