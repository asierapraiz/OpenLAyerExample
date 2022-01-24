import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { TipoBaseService } from 'src/app/core/service/tc/tipoBase.service';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AgrupacionInteresados } from 'src/app/core/model/inte/agrupacionInteresados';
import { TipoBase } from 'src/app/core/model/tc/tipoBase';
import { OptionsPage } from '../../../../../core/model/server/options-page';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AgrupacionInteresadosService } from 'src/app/core/service/inte/agrupacion-interesado.service';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-add-update-agrupacion-interesados',
  templateUrl: './add-update-agrupacion-interesados.component.html',
  styleUrls: ['./add-update-agrupacion-interesados.component.scss']
})
export class AddUpdateAgrupacionInteresadosComponent implements OnInit {



  public grupoInteresadoTipos: TipoBase[] = [];
  title!: string;
  subtitle!: string;
  formGroup: FormGroup = new FormGroup({});
  @Output()  refrescarLista = new EventEmitter();
  subscriptions: Subscription[] = [];
  agrupacionInteresados!: AgrupacionInteresados;
  predioId!: any;



  constructor(
    private tipoBaseService: TipoBaseService,
    protected matDialogRef: MatDialogRef<AddUpdateAgrupacionInteresadosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private agrupacionInteresadosService: AgrupacionInteresadosService,
    public dialogo: MatDialog
  ) { }

  ngOnInit(): void {

    this.agrupacionInteresados = this.data['agrupacion'];    
    this.agrupacionInteresados?.id != null ? this.editarAgrupacionInteresado() : this.crearAgrupacionInteresado();


    this.formGroup = new FormGroup({
      grupoInteresadoTipo: new FormControl(this.agrupacionInteresados?.grupoInteresadoTipo?.descripcion, [Validators.required]),
      nombre: new FormControl(this.agrupacionInteresados?.nombre, [Validators.required])
    });

    const options = new OptionsPage();
    options.size = 20;

    this.getAllAgrupacionInteresadosTipo(options);

  }


  crearAgrupacionInteresado() {    
    this.title = "Nueva agrupación de intresados";
    this.agrupacionInteresados = new AgrupacionInteresados();
  }

  editarAgrupacionInteresado() {
    this.title = "Interesado Id : " + this.agrupacionInteresados.id;
  }

  closeModal(agrupacionInteresados?: AgrupacionInteresados): void {

    //console.log("this predio =>",this.predio);
    //console.log("getData()=>",this.getData());

    let formData = this.getData();
    let originalData: AgrupacionInteresados = this.agrupacionInteresados;
    delete formData.fechaCaptura;


    let isEqual = JSON.stringify(originalData) === JSON.stringify(formData);
    console.log("is equal==>", isEqual);

    if (isEqual) {
      this.matDialogRef.close(agrupacionInteresados);
    } else {
      this.mostrarDialogo('Hay cambios  que se perderán');
    }
  }

  mostrarDialogo(message: string): void {
    const dialogRef = this.dialogo
      .open(ConfirmDialogComponent, {
        data: { pageValue: message }
      })
    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed', result);             
      result.data ? this.matDialogRef.close() : "";
    });
  }


  getAllAgrupacionInteresadosTipo(options: any) {
    const subscription = this.tipoBaseService.findAll('agrupacionteresadostipo', options)
      .subscribe(response => {
        this.grupoInteresadoTipos = response.content as TipoBase[];
      })
    this.subscriptions.push(subscription);
  }


  private getData(): any {

    var obj: any = {};
    Object.keys(this.formGroup.controls).forEach(key => {
      this.formGroup.controls[key].value != null ? obj[key] = this.formGroup.controls[key].value : "";
    });

    const agrupacionInteresadoTipo: any = this.grupoInteresadoTipos.find(x => x.descripcion === this.formGroup.controls.grupoInteresadoTipo.value);
    obj.grupoInteresadoTipo = agrupacionInteresadoTipo;
    /*
    let agrupacion = {
      grupoInteresadoTipo: agrupacionInteresadoTipo,
      nombre: this.formGroup.controls.nombre.value
    }*/
    this.isSaveOrUpdate() ? "" : obj.comienzoVidaUtilVersion = new Date();
    return obj;
  }

  saveOrUpdate(): void {
    let a = this.isSaveOrUpdate();    
    const observable$ = this.isSaveOrUpdate() ? this.agrupacionInteresadosService.update(this.getData()) :
      this.agrupacionInteresadosService.create(this.getData());
    this.subscriptions.push(
      observable$.subscribe(
        (agrupacionInteresados) => {
          this.matDialogRef.close(agrupacionInteresados);
          this.refrescarLista.emit();
        },
        () => alert(this.isSaveOrUpdate() ? 'Error al actualizar' : 'Error al guardar')
      )
    );
  }

  isSaveOrUpdate(): boolean {
    return Boolean(this.agrupacionInteresados?.id);
  }


}

