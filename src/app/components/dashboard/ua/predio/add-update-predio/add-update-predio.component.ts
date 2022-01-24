import { Component, Inject,OnInit, Output, EventEmitter } from '@angular/core';
import { TipoBaseService } from 'src/app/core/service/tc/tipoBase.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Predio, PredioDto} from 'src/app/core/model/ua/predio';
import { TipoBase } from 'src/app/core/model/tc/tipoBase';
import { OptionsPage } from '../../../../../core/model/server/options-page';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PredioService } from 'src/app/core/service/ua/predio.service';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';




@Component({
  selector: 'app-add-update-predio',
  templateUrl: './add-update-predio.component.html',
  styleUrls: ['./add-update-predio.component.scss']
})
export class AddUpdatePredioComponent implements OnInit {


  public claseSuelosTipos: any[] = [];
  public condicionPredioTipos: any[] = [];
  public categoriaSuelosTipos: any[] = [];
  public relacionSuperficieTipos: any[] = [];
  public estadosPredioTipos: any[] = [];
  public prediosTipos: any[] = [];
  public destEconomicasTipos: any[]=[];
  formattedMessage!: string;
  original! : any;
  predio!: Predio;
  terrenoId!: number;
  subtitle!: string;


  title!: any;  
  formGroup: FormGroup = new FormGroup({}); 
  @Output()
  propagar = new EventEmitter<Predio>();
 

  subscriptions: Subscription[] = [];
  

  departamentos=['05', '12'];
  municipios = ['044','1'];
  public isSaveOrUpdate!: boolean;

  constructor(
    private tipoBaseService: TipoBaseService ,
    protected matDialogRef: MatDialogRef<AddUpdatePredioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private predioService: PredioService,
    public dialogo: MatDialog  
  ) { }

  ngOnInit(): void {

    
    this.terrenoId = this.data.terrenoId;    
    this.data.predio?this.editarPredio():this.creaPredio();    
      
    

    this.formGroup = new FormGroup({
      departamento: new FormControl(this.predio.departamento, []),
      municipio: new FormControl(this.predio.municipio, []), 
      numeroPredial: new FormControl(this.predio.numeroPredial, []), 
      operacion: new FormControl(this.predio.operacion, []),
      claseSueloTipo: new FormControl(this.predio.claseSueloTipo?.descripcion, []),
      condicionPredioTipo: new FormControl(this.predio.condicionPredioTipo?.descripcion, []),
      categoriaSueloTipo: new FormControl(this.predio.categoriaSueloTipo?.descripcion, []), 
      destinacionEconomicaTipo: new FormControl(this.predio.destinacionEconomicaTipo?.descripcion, []), 
      relacionSuperficieTipo: new FormControl(this.predio.relacionSuperficieTipo?.descripcion, []),
      predioTipo: new FormControl(this.predio.predioTipo?.descripcion, []),
      estadoPredio: new FormControl(this.predio.estadoPredio?.descripcion, []),
      
    });    


    const options = new OptionsPage();
    options.size=20;

    this.getAllClaseSueloTipo(options);    
    this.getAllCondicionTipo(options);
    this.getAllCategoriaSueloTipo(options);    
    this.getAllPredioTipo(options);
    this.getAllDestEconomicaTipo(options);
    this.getAllEstadoPredioTipo(options);
   
/*
    this.matDialogRef.backdropClick().subscribe(() => {
      this.closeModal();
   });*/
    
  } 
  ngAfterViewInit(){
    
  }  

  inputChanged(e: any){
    /*
    console.log(e.target.getAttribute('formControlName'))
    console.log(e.target.value)
    let obj: Predio = this.predio;
    let a = e.target.getAttribute('formControlName')
    let c = this.predio[a];
    if(e.taget.value!=this.predio[a]){}*/
  }

 

  saveOriginalValuesOfPredio(){
    setTimeout(()=>{                           
      this.original = this.getData();
  }, 2500);   
  
  }
  

  editarPredio(){
    this.title="Predio Id : " + this.data.predio.id;    
    this.isSaveOrUpdate=true;   
    this.predio = this.data.predio;
  }

  creaPredio(){
    this.title="Predio nuevo";
    this.terrenoId=this.data.terrenoId;
    this.subtitle=`TerrenoId:${this.terrenoId}`;
   
    this.predio = new Predio();   
  }

  closeModal(predio?: PredioDto): void {   

    //console.log("this predio =>",this.predio);
    //console.log("getData()=>",this.getData());
    
    let formData = this.getData();
    let originalData: Predio = this.predio;
    delete formData.fechaCaptura;
    delete originalData.fechaCaptura;
    delete originalData.fechaUltimaModificacion; 
    
    this.matDialogRef.close(predio);   
    
/*
    let isEqual = JSON.stringify(originalData) === JSON.stringify(formData);
    console.log("is equal==>",isEqual);
    
    if(isEqual){      
      this.matDialogRef.close(predio);          
    }else{
      this.mostrarDialogo('Hay cambios  que se perderán');  
    }*/
  }
 
  mostrarDialogo(message: string): void {
    const dialogRef =  this.dialogo
      .open(ConfirmDialogComponent, {
        data: { pageValue: message }
      })
      dialogRef.afterClosed().subscribe(result => {
        //console.log('The dialog was closed', result);             
        result.data?this.matDialogRef.close():"";
      });
  }

  saveOrUpdate(): void {        
    const observable$ = this.isSaveOrUpdate ? this.predioService.update(this.getData()) :
      this.predioService.create(this.getData(), this.terrenoId);      
    this.subscriptions.push(
      observable$.subscribe(
        (predio) => this.closeModal(predio),
        () => alert(this.isSaveOrUpdate? 'Error al actualizar' : 'Error al guardar')
      )
    );
  }

  getAllDestEconomicaTipo(options: OptionsPage) {    
        
    const subscription = this.tipoBaseService.findAll('destinacioneconomica',options)
    .subscribe(response => {
      this.destEconomicasTipos = response.content as TipoBase[];         
    })
    this.subscriptions.push(subscription);
  } 

  getAllPredioTipo(options: OptionsPage) {    
    const subscription = this.tipoBaseService.findAll('predio', options )
    .subscribe(response => {
      this.prediosTipos = response.content as TipoBase[];          
    })
    this.subscriptions.push(subscription);
  } 

  getAllCondicionTipo(options: OptionsPage) {    
    const subscription = this.tipoBaseService.findAll('condicionpredio', options )
    .subscribe(response => {
      this.condicionPredioTipos = response.content as TipoBase[];         
    })
    this.subscriptions.push(subscription);
  } 

  getAllClaseSueloTipo(options: OptionsPage) {    
    const subscription = this.tipoBaseService.findAll('clasesuelo', options )
    .subscribe(response => {
      this.claseSuelosTipos = response.content as TipoBase[];            
    })
    this.subscriptions.push(subscription);
  } 

  getAllCategoriaSueloTipo(options: OptionsPage) {    
    const subscription = this.tipoBaseService.findAll('categoriasuelo', options )
    .subscribe(response => {
      this.categoriaSuelosTipos = response.content as TipoBase[];         
    })
    this.subscriptions.push(subscription);
  } 

  getAllDestEconomicoTipo(options: OptionsPage) {    
    const subscription = this.tipoBaseService.findAll('destinacioneconomica', options )
    .subscribe(response => {
      this.destEconomicasTipos = response.content as TipoBase[];         
    })
    this.subscriptions.push(subscription);
  } 

  getAllEstadoPredioTipo(options: OptionsPage) {    
    const subscription = this.tipoBaseService.findAll('estadopredio', options )
    .subscribe(response => {
      this.estadosPredioTipos = response.content as TipoBase[];         
    })
    this.subscriptions.push(subscription);
  } 


  private getData(): PredioDto {

    const destinacionEconomicaTipo: any  = this.destEconomicasTipos.find(x => x.descripcion === this.formGroup.controls.destinacionEconomicaTipo.value);
    const categoriaSueloTipo: any  = this.categoriaSuelosTipos.find(x => x.descripcion === this.formGroup.controls.categoriaSueloTipo.value);
    const claseSueloTipo: any = this.claseSuelosTipos.find(x => x.descripcion === this.formGroup.controls.claseSueloTipo.value);
    const estadoPredio: any = this.estadosPredioTipos.find(x => x.descripcion === this.formGroup.controls.estadoPredio.value);
    const condicionPredioTipo: any = this.condicionPredioTipos.find(x => x.descripcion === this.formGroup.controls.condicionPredioTipo.value);
    const predioTipo: any = this.prediosTipos.find(x => x.descripcion === this.formGroup.controls.predioTipo.value);
    const fechaCaptura = this.isSaveOrUpdate ? this.predio.fechaCaptura : new Date();
    
    return {
      id: this.predio.id,
      departamento: this.formGroup.controls.departamento.value,
      municipio: this.formGroup.controls.municipio.value,
      operacion: this.formGroup.controls.operacion.value,
      numeroPredial: this.formGroup.controls.numeroPredial.value,
      predioTipo: predioTipo,
      condicionPredioTipo: condicionPredioTipo,
      estadoPredio: estadoPredio,
      claseSueloTipo: claseSueloTipo,     
      categoriaSueloTipo: categoriaSueloTipo,
      destinacionEconomicaTipo: destinacionEconomicaTipo,
      fechaCaptura: fechaCaptura
    };
  }  
}

