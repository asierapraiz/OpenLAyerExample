import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Construccion, ConstruccionDto } from 'src/app/core/model/ue/construccion';
import { UePredio } from 'src/app/core/model/rel/uePredio';
import { ConstruccionService } from 'src/app/core/service/ue/construccion.service';
import { TipoBase } from 'src/app/core/model/tc/tipoBase';
import { TipoBaseService } from 'src/app/core/service/tc/tipoBase.service';
import { OptionsPage } from '../../../../../core/model/server/options-page';
import { Multipolygon } from 'src/app/core/model/geometry/multipolygon';
import { Predio } from 'src/app/core/model/ua/predio';
import { PredioService } from 'src/app/core/service/ua/predio.service';
import { Terreno } from 'src/app/core/model/ue/terreno';
import { CustomConfirmDialogComponent } from './../../../../../shared/components/custom-confirm-dialog/custom-confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { UepredioService } from 'src/app/core/service/rel/uepredio.service';






@Component({
  selector: 'app-construccion-add-update',
  templateUrl: './construccion-add-update.component.html',
  styleUrls: ['./construccion-add-update.component.scss']
})
export class ConstruccionAddUpdateComponent implements OnInit {

  public relacionSuperficieTipos: TipoBase[] = [];
  public dimensionTipos: TipoBase[] = [];
  public dominioConstruccionTipos: TipoBase[] = []
  public construccionTipos: TipoBase[] = [];
  public prediosOfTerreno: Predio[] = [];

  private subscriptions: Subscription[] = [];
  title!: any;
  formGroup: FormGroup = new FormGroup({});

  polygonList: Multipolygon[] = this.data.multiPolygonList;
  construccion!: Construccion;
  geometria!: any;
  terrenoId!: number;
  predioId!: number;

  constructor(
    private uepredioService: UepredioService,
    private dialog: MatDialog,
    private predioService: PredioService,
    protected matDialogRef: MatDialogRef<ConstruccionAddUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private route: Router,
    private construccionService: ConstruccionService,
    private tipoBaseService: TipoBaseService,

  ) {
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  ngOnInit(): void {
    this.construccion = this.data.construccion;    
    this.geometria = this.data.geometria;
    this.terrenoId = this.data.terrenoId;
    

    //Edición
    this.construccion!=null?this.getRelacionesDeLaConstruccion():'';
    this.title = `Actualizar la construcción con id:${this.construccion.id}`;
    this.title = `Crear una construcción en el terreno id:${this.terrenoId}`;
      

    const options = new OptionsPage();
    options.size = 20;

    this.createFormGroup();
    this.getAllRelSuperficieTipo(options);
    this.getAllDimensionTipo(options);
    this.getAllDominioConstruccionTipo(options);
    this.getAllConstruccionTipo(options);

    this.terrenoId!=null?this.getAllPrediosOfTerreno(this.terrenoId):'';    
  }



  createFormGroup() {
    this.formGroup = new FormGroup({
      identificador: new FormControl(this.construccion?.identificador, [Validators.required, Validators.maxLength(2)]),
      predio: new FormControl(this.predioId, []),
      construccionTipo: new FormControl(this.construccion?.construccionTipo?.descripcion, []),
      dominioConstruccionTipo: new FormControl(this.construccion?.dominioConstruccionTipo?.descripcion, []),
      numeroPisos: new FormControl(this.construccion?.numeroPisos, [Validators.required]),
      numeroSotanos: new FormControl(this.construccion?.numeroSotanos, []),
      anioConstruccion: new FormControl(this.construccion?.anioConstruccion, []),
      areaConstruccion: new FormControl(this.construccion?.areaConstruccion, [Validators.required]),
      obervciones: new FormControl(this.construccion?.observaciones, []),
      dimensionTipo: new FormControl(this.construccion?.dimensionTipo?.descripcion, []),
      relacionSuperficieTipo: new FormControl(this.construccion?.relacionSuperficieTipo?.descripcion, []),
      observaciones: new FormControl(this.construccion?.observaciones, []),
    });
  }

  getRelacionesDeLaConstruccion() {       
    const subscription = this.uepredioService.filter({ "construccionId": this.construccion.id }).pipe(
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
        this.getAllPrediosOfTerreno(this.terrenoId);
        this.predioId = uePredio[0].predioId;        
        this.formGroup.patchValue({
          predio: this.predioId});        
      },
      () => {
      }
    );
    this.subscriptions.push(subscription);
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
      this.dominioConstruccionTipos = response.content as TipoBase[];
    })
    this.subscriptions.push(subscription);
  }

  getAllPrediosOfTerreno(id: number) {    
    const subscription = this.predioService.getAllPrediosOfTerreno(id).pipe(
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
        //alert('No hay predios relacionadas con el terreno.');
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


  getTitle(): string {
    return this.construccion?.id ? `Actualizar construcción id:${this.construccion.id}` : 'Añadir construcción';
  }

  closeModal(construccion?: Construccion): void {
    this.matDialogRef.close(construccion);
  }

  saveOrUpdate(): void {
    let selectedPredioId: any = this.prediosOfTerreno.find(x => x.id === this.formGroup.controls.predio.value);
    const observable$ = this.isSaveOrUpdate() ? this.construccionService.update(this.getData()) :
      this.construccionService.create(this.getData());
    this.subscriptions.push(
      observable$.subscribe(
        (construccionDto) => {
          this.closeModal(construccionDto);
          //this.getAllPrediosOfTerreno(this.terrenoId);
        },
        () => alert(this.isSaveOrUpdate() ? 'Error al actualizar' : 'Error al guardar')
      )
    );
  }

  private isSaveOrUpdate(): boolean {
    return Boolean(this.construccion?.id);
  }

  private getData(): ConstruccionDto {

    let dimensionTipo: any = this.dimensionTipos.find(x => x.descripcion === this.formGroup.controls.dimensionTipo.value);
    let construccionTipo: any = this.construccionTipos.find(x => x.descripcion === this.formGroup.controls.construccionTipo.value);
    let dominioConstruccionTipo: any = this.dominioConstruccionTipos.find(x => x.descripcion === this.formGroup.controls.dominioConstruccionTipo.value);
    let relacionSuperficieTipo: any = this.relacionSuperficieTipos.find(x => x.descripcion === this.formGroup.controls.relacionSuperficieTipo.value);

    let geometria;
    this.isSaveOrUpdate() ? geometria = this.construccion.geometria : geometria = this.geometria;  
    

    
    return {
      id: this.construccion?.id,
      geometria: geometria,
      identificador: this.formGroup.controls.identificador.value,
      construccionTipo: construccionTipo,
      dominioConstruccionTipo: dominioConstruccionTipo,
      numeroPisos: this.formGroup.controls.numeroPisos.value,
      numeroSotanos: this.formGroup.controls.numeroSotanos.value,
      anioConstruccion: this.formGroup.controls.anioConstruccion.value,
      areaConstruccion: this.formGroup.controls.areaConstruccion.value,
      dimensionTipo: dimensionTipo,
      relacionSuperficieTipo: relacionSuperficieTipo,
      observaciones: this.formGroup.controls.observaciones.value,
      fechaCarga: this.construccion ? this.construccion.fechaCarga : new Date(),
      terrenoId: this.terrenoId,
      predioId: this.formGroup.controls.predio.value
    };
  }
}

