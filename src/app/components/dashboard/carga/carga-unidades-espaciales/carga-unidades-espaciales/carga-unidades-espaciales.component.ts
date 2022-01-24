import { Component, OnInit } from '@angular/core';
import { CargaService } from 'src/app/core/service/carga/carga.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-carga-unidades-espaciales',
  templateUrl: './carga-unidades-espaciales.component.html',
  styleUrls: ['./carga-unidades-espaciales.component.scss']
})
export class CargaUnidadesEspacialesComponent implements OnInit {

  constructor(
    private cargaCsvService: CargaService,
  ) { }

  archivo: File | undefined;
  nombre: String | undefined ;
  mensaje?: String;
  error?: any;
  nombredestino?: String;
  showSpinner: Boolean = false;

  public destinos: any[] = [
    {nombre:"Terrenos", path:"/terreno/validarCsvTerrenos"},
    //{nombre:"Construcciones", path:"/construccion/validarCsvConstrucciones"},
    {nombre:"Unidades de construcción", path:"/unidadconstruccion/validarCsvUnidades"},
  ];

  ngOnInit(): void {
  }

  enviar(){
    this.showSpinner=true;
    this.cargaCsvService.validarCsv(this.archivo, this.nombredestino)
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
          this.error = "Se ha producido un error, no se ha podido realizar el guardado. Revise el archivo log.";
          this.gestionardescarga(error.error, 'cargacsv_log');
        }
        if(!this.error){
          this.error = "Se ha producido un error, no se ha podido realizar el guardado.";
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