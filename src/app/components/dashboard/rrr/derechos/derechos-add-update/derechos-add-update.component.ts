import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Derecho, DerechoDTO } from 'src/app/core/model/rrr/derecho';
import { OptionsPage } from 'src/app/core/model/server/options-page';
import { DerechoService } from 'src/app/core/service/rrr/derecho.service';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';
import { DatePipe, formatDate } from '@angular/common'
import { TipoBaseService } from 'src/app/core/service/tc/tipoBase.service';
import { TipoBase } from 'src/app/core/model/tc/tipoBase';
import { Multipolygon } from 'src/app/core/model/geometry/multipolygon';
import { PredioService } from 'src/app/core/service/ua/predio.service';
import { InteresadoService } from 'src/app/core/service/inte/interesado.service';

@Component({
  selector: 'app-derechos-add-update',
  templateUrl: './derechos-add-update.component.html',
  styleUrls: ['./derechos-add-update.component.scss']
})
export class DerechosAddUpdateComponent implements OnInit {

  public derechoTipoId: any[] = [];
  public fraccionDerecho: any[] = [];
  public fechaInicioTenencia: any[] = [];
  public descripcion: any[] = [];
  public interesadoId: any[] = [];
  public predioId: any[] = [];
  public agrupacionInteresadoId: any[]=[];
  public crearPredioInteresado: boolean=false;

  formattedMessage!: string;
  original! : any;

  title!: any;  

  formGroup: FormGroup = new FormGroup({}); 
  
  @Output() propagar = new EventEmitter<Derecho>();

  public derechos: any[] = [];
  public derechostipos: any[] = [];
  public predios: any[] = [];
  public interesados: any[] = [];
  public agrupacioninteresados: any[]=[];

  subscriptions: Subscription[] = [];  
  public isSaveOrUpdate!: boolean;
  public disabled: boolean = true;

  public validatorInterAgru: boolean = true;


  constructor(
    private derechoService: DerechoService ,
    private predioService: PredioService,
    private interesadoService: InteresadoService, 
    protected matDialogRef: MatDialogRef<DerechosAddUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public derecho: DerechoDTO, 
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogo: MatDialog,
    private tipoBaseService: TipoBaseService,
    /* public datepipe: DatePipe */
  ) { }

  ngOnInit(): void { 
    this.getAllDerechosTipos();
    this.getAllInteresados();
    this.getAllAgrupacionInteresados();
    const interId=this.data.datos.interId?this.data.datos.interId:this.data.datos.interesadoId;
    this.getAllPrediosByInteresadoId(interId);
    if(this.data.datos.id){   
      this.isSaveOrUpdate=false;
      this.cargarDerecho();
    }
    else{
      this.isSaveOrUpdate=true;
      this.crearDerecho();
    }
    
    this.formGroup = new FormGroup({
      derechoTipoId: new FormControl(this.data.datos.derechoTipoId, [Validators.required,]),
      fraccionDerecho: new FormControl(this.data.datos.fraccionDerecho, [Validators.required, Validators.min(0), Validators.max(1)]), 
      fechaInicioTenencia: new FormControl(this.data.datos.fechaInicioTenencia, [Validators.required,]), 
      descripcion: new FormControl(this.data.datos.descripcion, [Validators.required, Validators.maxLength(254)]),
      interesadoId: new FormControl(this.data.datos.interesadoId?this.data.datos.interesadoId:null, []),
      predioId: new FormControl(this.data.datos.predioId, [Validators.required,]),
      agrupacionInteresadoId: new FormControl(this.data.datos.agrupacionInteresadoId?this.data.datos.agrupacionInteresadoId:null, [])
    });     
    const options = new OptionsPage();
    options.size=20; 
  }

  cargarDerecho(){
    this.title="Editar el Derecho " + this.data.datos.id;   
  }

  crearDerecho(){
    this.title="Crear derecho para el interesado: " + this.data.datos.interId;  
    this.derecho = new Derecho();  
  }

  checkValidator(){
    const editar=this.data.datos.interId?false:true;
    this.validatorInterAgru=true;
    if(editar){
      if((this.formGroup.value.interesadoId && this.formGroup.value.agrupacionInteresadoId) || (!this.formGroup.value.interesadoId && !this.formGroup.value.agrupacionInteresadoId)){
        this.validatorInterAgru=false;
      }
    }
    if(!editar){
      if((this.data.datos.interId && this.formGroup.value.agrupacionInteresadoId) || (!this.data.datos.interId && !this.formGroup.value.agrupacionInteresadoId)){
        this.validatorInterAgru=false;
      }
    }
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

  getAllPrediosByInteresadoId(interesadoId: number){
    if(interesadoId!=null){
      const subscription = this.predioService.findAllByInteresadoId(interesadoId )
      .subscribe(response => {
        if(response!=null){
          this.crearPredioInteresado=false;
          this.predios = response as unknown as TipoBase[]; 
        }else{
          this.crearPredioInteresado=true;
          this.getAllPredios();
        }
      })
      this.subscriptions.push(subscription);     
    }else{
      this.getAllPredios();
    }


  }

  getAllinteresadosByPredioId(predioId: number){
    if(this.formGroup.value.interesadoId==null){
      const subscription = this.interesadoService.findAllByPredioId(predioId )
      .subscribe(response => {
        if(!response){
          this.crearPredioInteresado=true;
          this.getAllInteresados();
        }
        else{
          this.crearPredioInteresado=false;
          this.interesados = response.content as unknown as TipoBase[]; 
        }
      })
      this.subscriptions.push(subscription);
    }
  }
  
  closeModal(derecho?: DerechoDTO,exito?: boolean): void {   
    let formData = this.getData();
    let originalData: Derecho = this.derecho;
    let isEqual = JSON.stringify(originalData) === JSON.stringify(formData);
    if(isEqual || exito){      
      this.matDialogRef.close(derecho);          
    }else{
      this.mostrarDialogo('Hay cambios  que se perderán');  
    }
  }
 
  mostrarDialogo(message: string): void {
    const dialogRef =  this.dialogo
      .open(ConfirmDialogComponent, {
        data: { pageValue: message }
      })
      dialogRef.afterClosed().subscribe(result => {       
        result.data?this.matDialogRef.close():"";
      });
  }

  saveOrUpdate(): void {
    if(this.crearPredioInteresado==true){
      const observable$=this.isSaveOrUpdate?this.derechoService.createwithrelation(this.getData()):this.derechoService.updatewithrelation(this.getData());      
      this.subscriptions.push(
        observable$.subscribe(
          (derecho) => this.closeModal(derecho, true),
          (error) => {
            alert(this.isSaveOrUpdate?'Error al guardar':'Error al actualizar');
          }
        )
      );
    }
    else{
      const observable$=this.isSaveOrUpdate?this.derechoService.create(this.getData()):this.derechoService.update(this.getData());      
      this.subscriptions.push(
        observable$.subscribe(
          (derecho) => this.closeModal(derecho, true),
          (error) => {
            alert(this.isSaveOrUpdate?'Error al guardar':'Error al actualizar');
          }
        )
      );
    }

  }

  private getData(): DerechoDTO {
    const derechoTipoId = this.formGroup.controls.derechoTipoId.value;
    const fraccionDerecho = this.formGroup.controls.fraccionDerecho.value;
    const fechaInicioTenencia = this.formGroup.controls.fechaInicioTenencia.value;
    const descripcion = this.formGroup.controls.descripcion.value;
    const predioId = this.formGroup.controls.predioId.value;
    const agrupacionInteresadoId = this.formGroup.controls.agrupacionInteresadoId.value;
    /* const interesadoId= this.data.datos.interId?this.data.datos.interId:this.formGroup.controls.interesadoId.value.id; */
    const interesadoId= this.data.datos.interId?this.data.datos.interId:this.formGroup.controls.interesadoId.value;
    const id = this.data.datos.id;
    return {
      id: id?id:null,
      /* derechoTipoId: derechoTipoId?derechoTipoId.id:null, */
      derechoTipoId: derechoTipoId,
      fraccionDerecho: fraccionDerecho,
      fechaInicioTenencia: fechaInicioTenencia,
      descripcion: descripcion,
      interesadoId: agrupacionInteresadoId?null:interesadoId,
      /* predioId: predioId?predioId.id:null, */
      predioId: predioId,
      /* agrupacionInteresadoId: agrupacionInteresadoId?agrupacionInteresadoId.id:null, */
      agrupacionInteresadoId: agrupacionInteresadoId,
    };
  } 
}
/*       this.derecho.fechaInicioTenencia =this.datepipe.transform(this.derecho.fechaInicioTenencia, 'yyyy-MM-dd');  */  

/*       const format = 'dd/MM/yyyy';
      const myDate = this.derecho.fechaInicioTenencia?this.derecho.fechaInicioTenencia: new Date();
      const locale = 'es';
      const formattedDate = formatDate(myDate, format, locale);
 */

      /*     const derechoTipoId: any  = this.derechoTipoId.find(x => x.derechoTipoId === this.formGroup.controls.derechoTipoId.value);
    const fraccionDerecho: any  = this.fraccionDerecho.find(x => x.descripcion === this.formGroup.controls.fraccionDerecho.value);
    const fechaInicioTenencia: any = this.fechaInicioTenencia.find(x => x.descripcion === this.formGroup.controls.fechaInicioTenencia.value);
    const descripcion: any = this.descripcion.find(x => x.descripcion === this.formGroup.controls.descripcion.value);
    const interesadoId: any = this.interesadoId.find(x => x.descripcion === this.formGroup.controls.interesadoId.value);
    const predioId: any = this.predioId.find(x => x.descripcion === this.formGroup.controls.predioId.value);
    const agrupacionInteresadoId: any = this.agrupacionInteresadoId.find(x => x.descripcion === this.formGroup.controls.agrupacionInteresadoId.value); */

    /*     console.log("getData =>",derechoTipoId,fraccionDerecho,fechaInicioTenencia); */

    /*     delete formData.fechaCaptura;
    delete originalData.fechaCaptura;
    delete originalData.fechaUltimaModificacion;   */

    /*     this.interesadoId = this.data['interesadoId'];     
    this.title = `Crear derecho para el interesado:${this.interesadoId}`; */

    /*     this.derecho?this.cargarDerecho():this.crearDerecho();    
    this.derecho?this.isSaveOrUpdate=false:this.isSaveOrUpdate=true;   */  