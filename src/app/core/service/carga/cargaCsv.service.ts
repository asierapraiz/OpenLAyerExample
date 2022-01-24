import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CargaCsvService {

  private url = `${environment.urlApi}`;

  constructor(
    private httpClient: HttpClient
  ) {
  }

  //path sería la url para cada controlador Ej: terreno/validarCsvTerrenos
  validarCsv(archivo: any, path: String): Observable<any> {    
    const formData: FormData = new FormData();
    formData.append("file",archivo);   
    formData.append("tipo", "interesado"); 
    return this.httpClient.post<any>(
      `${this.url}${path}`, 
      formData, {
        responseType: 'blob' as 'json',
          headers: new HttpHeaders({
            authorization: localStorage.authorization,
          })
      }
    );
  }
 
}
