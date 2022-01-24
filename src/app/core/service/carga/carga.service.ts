import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Page } from '../../model/server/page';
import { Observable } from 'rxjs';
import { Terreno, TerrenoFilter } from '../../model/ue/terreno';
import { OptionsPage } from '../../model/server/options-page';
import { optionsFromCapabilities } from 'ol/source/WMTS';
import { Predio } from '../../model/ua/predio';
import { Extent } from 'ol/extent';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CargaService {
  private url = `${environment.urlApi}`;

  constructor(
    private httpClient: HttpClient
  ) {
  }

  validarCsv(archivo: any, path:any): Observable<any> { 
    
    const url=this.url+path;
    const formData: FormData = new FormData();
    formData.append("file",archivo);
    return this.httpClient.post<any>(
      url, formData, {
        responseType: 'blob' as 'json',
          headers: new HttpHeaders({
            authorization: localStorage.authorization,
          })
      }
    );
  }
 
}