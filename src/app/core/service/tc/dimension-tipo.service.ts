import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { DimensionTipo } from '../../model/tc/dimension';
import { Page } from '../../model/server/page';
import { OptionsPage } from '../../model/server/options-page';

@Injectable({
  providedIn: 'root'
})
export class DimensionTipoService {
  private url = `${environment.urlApi}/tipo/dimension`;

  constructor(
    private httpClient: HttpClient
  ) {
  }

  findAll(): Observable<DimensionTipo[]> {
    return this.httpClient.get<DimensionTipo[]>(
      `${this.url}/all`, {
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          authorization: localStorage.authorization,
        })
      }
    ).pipe(
      map((response: any)=>{        
        return response as DimensionTipo[];
      })      
    );
  }

  findAllPage(options: OptionsPage): Observable<Page<DimensionTipo>> {
    return this.httpClient.get<Page<DimensionTipo>>(
      `${this.url}/list${options ? options.toApi() : ''}`, {
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          authorization: localStorage.authorization,
        })
      }
    );
  }

  findById(id: number): Observable<DimensionTipo> {    
    return this.httpClient.get<DimensionTipo>(`${this.url}/${id}`, {
      responseType: 'json',
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        authorization: localStorage.authorization,
      })
    });
  }
}
