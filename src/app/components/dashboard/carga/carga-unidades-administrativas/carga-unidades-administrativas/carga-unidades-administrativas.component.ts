
import { Component, OnInit } from '@angular/core';
import { CargaService } from 'src/app/core/service/carga/carga.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-carga-unidades-administrativas',
  templateUrl: './carga-unidades-administrativas.component.html',
  styleUrls: ['./carga-unidades-administrativas.component.scss']
})
export class CargaUnidadesAdministrativasComponent implements OnInit {

  constructor(
    private cargaUnidadesEspacialesService: CargaService,
  ) { }

  archivo: File | undefined;
  nombre: String | undefined ;
  mensaje?: String;
  error?: any;
  public destinos: any[] = [{nombre:"Predios", path:"/predio/validarCsvPredios"},];
  nombredestino?: String;
  showSpinner: Boolean = false;

  ngOnInit(): void {
  }

  enviar(){
    this.showSpinner=true;
    this.cargaUnidadesEspacialesService.validarCsv(this.archivo, this.nombredestino)
    .subscribe(
      () => {
        this.showSpinner=false;
        this.mensaje = "Registros guardados correctamente";
        this.error = undefined;
        this.archivo = undefined;
        this.nombre = undefined;
        this.nombredestino = undefined;
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
}