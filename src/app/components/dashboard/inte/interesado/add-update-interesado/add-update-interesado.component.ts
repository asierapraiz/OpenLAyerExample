import { Component, OnInit, Output, EventEmitter, Inject  } from '@angular/core';
import { TipoBaseService } from 'src/app/core/service/tc/tipoBase.service';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Interesado} from 'src/app/core/model/inte/interesado';
import { Predio } from 'src/app/core/model/ua/predio';
import { TipoBase } from 'src/app/core/model/tc/tipoBase';
import { OptionsPage } from '../../../../../core/model/server/options-page';
import { map, tap,  switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { InteresadoService } from 'src/app/core/service/inte/interesado.service';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';
import { AgrupacionInteresados } from 'src/app/core/model/inte/agrupacionInteresados';
import { PredioInteresadoService } from 'src/app/core/service/rel/predio-interesado.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GLOBAL_CONSTANTS } from 'src/app/shared/utils/global-constants';





@Component({
  selector: 'app-add-update-interesado',  
  templateUrl: './add-update-interesado.component.html',
  styleUrls: ['./add-update-interesado.component.scss']
})
export class AddUpdateInteresadoComponent implements OnInit {


  public interesadoTipos: TipoBase[] = [];
  public interesadoDocumentoTipos: TipoBase[] = [];
  public sexoTipos: TipoBase[] = [];
  public grupoEtnicoTipos: TipoBase[] = [];  
  

  title!: string;   
  subtitle!: string;  
  formGroup: FormGroup = new FormGroup({}); 
  @Output()  refrescarLista = new EventEmitter();
  @Output()  borrarAgrupacion = new EventEmitter();

  subscriptions: Subscription[] = [];  
  interesado!: Interesado;
  predioId!: number;
  agrupacionInteresados!: AgrupacionInteresados;
  
  


  constructor(    
   
    private snackBar: MatSnackBar,
    private predioInteresadoService: PredioInteresadoService,
    private tipoBaseService: TipoBaseService ,
    protected matDialogRef: MatDialogRef<AddUpdateInteresadoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,    
       
    private interesadoService: InteresadoService,
    public dialogo: MatDialog 
  ) { }

  ngOnInit(): void {    
  
    
    this.interesado = this.data['interesado'];    
    this.predioId = this.data['predioId'] ;
    this.agrupacionInteresados=this.data['agrupacion'];   
    
   
   
    
    this.interesado?this.editarInteresado():this.creaInteresado();         
        

    this.formGroup = new FormGroup({
      interesadoTipo: new FormControl(this.interesado?.interesadoTipo?.descripcion, []),
      interesadoDocumentoTipo: new FormControl(this.interesado?.interesadoDocumentoTipo?.descripcion, [Validators.required]),       
      documentoIdentidad: new FormControl(this.interesado?.documentoIdentidad, [Validators.required]), 
      primerNombre: new FormControl(this.interesado?.primerNombre, [Validators.required]),
      segundoNombre: new FormControl(this.interesado?.segundoNombre, []),
      primerApellido: new FormControl(this.interesado?.primerApellido,[Validators.required]),
      segundoApellido: new FormControl(this.interesado?.segundoApellido, [Validators.required]),
      sexoTipo: new FormControl(this.interesado?.sexoTipo?.descripcion, [Validators.required]), 
      grupoEtnicoTipo: new FormControl(this.interesado?.grupoEtnicoTipo?.descripcion, []), 
      razonSocial: new FormControl(this.interesado?.razonSocial, []),
      nombreRazonSocial: new FormControl(this.interesado?.nombre, [])    
    });

    

    const options =  new OptionsPage();
    options.size=20;

    this.getAllInteresadoTipo(options);   
    this.getAllInteresadoDocumentoTipo(options); 
    this.getAllSexoTipo(options); 
    this.getAllGrupoEtnicoTipo(options); 
  
    
  }    

  goToSelectAgrupacion(){   
    this.matDialogRef.close("goToSelectAgrupacion");
  }

  desenlazaAgrupacion(){
    this.agrupacionInteresados={}; 
    localStorage.removeItem('agrupacion-seleccionada'); 
    this.borrarAgrupacion.emit();  

  }

   creaInteresado(){        
    this.title="Interesado nuevo";    
    this.predioId?this.subtitle = "Relacionado con el predio :"+this.predioId:'';          
    this.interesado = new Interesado();   
  }

  editarInteresado(){
    this.title="Interesado Id : " + this.interesado.id;              
  }
  

  closeModal(interesado?: Interesado): void { 
    this.matDialogRef.close();
/*
  //console.log("this predio =>",this.predio);  
    //console.log("getData()=>",this.getData());

    let formData = this.getData();    
    let originalData: Interesado = this.interesado;
    delete formData.fechaCaptura; 
    
    console.log("originalData=>",JSON.stringify(originalData));
    console.log("--------");
    console.log("formData=>",JSON.stringify(formData));  
    

    let isEqual = JSON.stringify(originalData) === JSON.stringify(formData);
    console.log("is equal==>",isEqual);    
    
    if(isEqual){      
      this.matDialogRef.close(interesado);          
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

 
  private getData(): any {    

    const interesadoTipo: any  = this.interesadoTipos.find(x => x.descripcion === this.formGroup.controls.interesadoTipo.value);
    const interesadoDocumentoTipo: any  = this.interesadoDocumentoTipos.find(x => x.descripcion === this.formGroup.controls.interesadoDocumentoTipo.value);    
    const grupoEtnicoTipo: any = this.grupoEtnicoTipos.find(x => x.descripcion === this.formGroup.controls.grupoEtnicoTipo.value);
    const sexoTipo: any = this.sexoTipos.find(x => x.descripcion === this.formGroup.controls.sexoTipo.value);
    //const fechaCaptura = this.isSaveOrUpdate() ? this.interesado.fechaCaptura : new Date();
    

    return{
      id: this.interesado?.id,
      interesadoTipo: interesadoTipo,
      interesadoDocumentoTipo: interesadoDocumentoTipo, 
      documentoIdentidad: this.formGroup.controls.documentoIdentidad.value, 
      primerNombre: this.formGroup.controls.primerNombre.value,
      segundoNombre: this.formGroup.controls.segundoNombre.value,
      primerApellido: this.formGroup.controls.primerApellido.value,
      segundoApellido: this.formGroup.controls.segundoApellido.value,
      sexoTipo: sexoTipo, 
      grupoEtnicoTipo: grupoEtnicoTipo, 
      razonSocial:this.formGroup.controls.razonSocial.value,
      nombreRazonSocial: this.formGroup.controls.nombreRazonSocial.value,
      //fechaCaptura: fechaCaptura   
    }        
  
  }

  //Se guarda con predio y agrupacion

  saveWithPredioAndAgrupacion(){

    let agrupacionId = this.agrupacionInteresados?.id? this.agrupacionInteresados?.id: 0;    

    const observable$ = this.interesadoService.createWithGroupAndPredio(this.getData(), agrupacionId, this.predioId );
    this.subscriptions.push(
      observable$.subscribe(
        (interesado) => {
          this.matDialogRef.close(interesado);         
        },
        () => this.openSnackBar(`Error al guardar`, '', 'alert')
      )
    );
  }

  saveWithAgrupacion(){
    
    //1- El interesado como miembro de la agrupación   
    
    let agrupacionId = this.agrupacionInteresados?.id? this.agrupacionInteresados?.id: 0;    

    const observable$ = this.interesadoService.createWithGroup(this.getData(), agrupacionId );
    this.subscriptions.push(
      observable$.subscribe(
        (interesado) => {
          this.matDialogRef.close(interesado);                 
        },
        () => this.openSnackBar(`Error al guardar`, '', 'alert')      
      )
    );

   
   

  }

  savePredioAgrupacion(){       

     let id= this.agrupacionInteresados.id;
    const observable$ = this.interesadoService.createGroupRelWithPredio(id || 0, this.predioId || 0);
    this.subscriptions.push(
      observable$.subscribe(
        (interesado) => {          
          this.matDialogRef.close(interesado);
          this.refrescarLista.emit();
        },
        () => alert(this.isSaveOrUpdate() ? 'Error al actualizar' : 'Error al guardar')
      )
    );
  }

  saveOrUpdateWithPredio(): void {    

    const observable$ = this.isSaveOrUpdate()? this.interesadoService.update(this.getData()):
    this.interesadoService.createWithPredio(this.getData(), this.predioId || 0);      
    this.subscriptions.push(
      observable$.subscribe(
        (interesado) => {
          this.matDialogRef.close(interesado);
          let action;
          this.isSaveOrUpdate()? action = 'creado': action = 'actualizado';          
          this.openSnackBar(`El interesado con id:${interesado.id} se ha ${action} correctamente.`, '', 'alert');
          this.refrescarLista.emit();       
        },
        () => alert(this.isSaveOrUpdate()? 'Error al actualizar' : 'Error al guardar')
      )
    );
  }

  saveOrUpdate(){

    if(this.predioId && this.agrupacionInteresados){
      this.saveWithPredioAndAgrupacion();
    }
    if(this.predioId && !this.agrupacionInteresados){
      this.saveOrUpdateWithPredio();
    }

    if(!this.predioId && this.agrupacionInteresados){
      this.saveWithAgrupacion();
    }

    if(!this.predioId && !this.agrupacionInteresados){
      this.saveOrUpdateInteresado();
    }

  }

  saveOrUpdateInteresado(): void {    
     
    const observable$ = this.isSaveOrUpdate()? this.interesadoService.update(this.getData()):
    this.interesadoService.create(this.getData());      
    this.subscriptions.push(
      observable$.subscribe(
        (interesado) => {
          this.matDialogRef.close(interesado);  
          let action;
          this.isSaveOrUpdate()? action = 'actualizado': action = 'creado';         
          this.openSnackBar(`El interesado con id:${interesado.id} se ha ${action} correctamente.`, '', 'alert');
          this.refrescarLista.emit();       
        },
        () => alert(this.isSaveOrUpdate()? 'Error al actualizar' : 'Error al guardar')
      )
    );
  } 



  isSaveOrUpdate(): boolean {
    return Boolean(this.interesado?.id);
  }

  openSnackBar(message: string, action: string, className: string) {
    this.snackBar.open(message, action, {
      duration: GLOBAL_CONSTANTS.alertDuration,
      panelClass: [className]
    });
  }
  
}

