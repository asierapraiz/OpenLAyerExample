import { Component, OnInit } from '@angular/core';
import { CargaCsvService } from 'src/app/core/service/carga/cargaCsv.service';
import { saveAs } from 'file-saver';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GLOBAL_CONSTANTS } from '../../../../../shared/utils/global-constants';




@Component({
  selector: 'app-carga-interesados',
  templateUrl: './carga-interesados.component.html',
  styleUrls: ['./carga-interesados.component.scss']
})
export class CargaInteresadosComponent implements OnInit {

 
  constructor(
    private cargaCsvService: CargaCsvService,
    private snackBar: MatSnackBar
  ) { }

  archivo: File | undefined;
  nombre: String | undefined ;
  mensaje?: String;
  error?: any;
  public destinos: any[] = [{nombre:"Interesados", path:"/interesado/validarCsvInteresados"},{nombre:"Agrupación Interesados", path:"/agrupacionInteresados/validarCsvAgrupaciones"}];
  nombredestino?: String;
  showSpinner: Boolean = false;

  ngOnInit(): void {}


  enviar(){ 
    this.showSpinner=true;   
    this.cargaCsvService.validarCsv(this.archivo, this.nombredestino)
    .subscribe(
      (response) => { 
        this.showSpinner=false;       
        console.log("response => ", response.message); 
        this.mensaje = response.message;
        this.error = undefined;
        this.archivo = undefined;
        this.nombredestino = undefined;
        this.openSnackBar('Datos guardados correctamente.', '', 'alert');
      },
      (error) =>{
        this.showSpinner=false;        
        const size =error.error.size;
        if(size==26)this.error = "Las cabeceras no son correctas.";
        if(size==28)this.error = "El formato de archivo no es el correcto.";
        if(size>=29){
          this.error = "Se ha producido un error, no se ha podido guardar los datos. Revise el archivo log.";
          this.gestionardescarga(error.error, 'cargacsv_log');
        }
        if(!this.error){
          this.error = "Se ha producido un error, no se ha podido guardar los datos.";
        }
        this.mensaje = undefined;
        this.archivo = undefined;
        this.nombre = undefined;
        this.nombredestino = undefined;
      }
    );
  }

  selectFile(event?:any){
    this.archivo=event.target.files[0];    
    this.nombre=this.archivo?.name;    
    this.mensaje = undefined;
    this.error = undefined;
  }

  gestionardescarga(response: any, nombrefichero: string){
    const blob: Blob = new Blob([response],{type:''});
    saveAs(blob, nombrefichero);
  }

  openSnackBar(message: string, action: string, className: string) {
    this.snackBar.open(message, action, {
      duration: GLOBAL_CONSTANTS.alertDuration,
      panelClass: ['success-snackbar']
    });
  }

}

