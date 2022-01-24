import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { TipoBase } from '../../model/tc/tipoBase'; 
import { Page } from '../../model/server/page';
import { OptionsPage } from '../../model/server/options-page';

@Injectable({
  providedIn: 'root'
})
export class TipoBaseService {

  private url = `${environment.urlApi}/tipo`;
  private urlnotipo = `${environment.urlApi}`;

  constructor(
    private httpClient: HttpClient
  ) {
  }

  findAll(tipo: string, options: OptionsPage): Observable<Page<TipoBase>> {
    return this.httpClient.get<Page<TipoBase>>(
      `${this.url}/${tipo}/list${options ? options.toApi() : ''}`, {
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          authorization: localStorage.authorization,
        })
      }
    );
  }

  findAllnoTipo(tipo: string, options: OptionsPage): Observable<Page<TipoBase>> {
    return this.httpClient.get<Page<TipoBase>>(
      `${this.urlnotipo}/${tipo}/list${options ? options.toApi() : ''}`, {
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          authorization: localStorage.authorization,
        })
      }
    );
  }

  findById(tipo: string, id: number): Observable<TipoBase> {      
    return this.httpClient.get<TipoBase>(`${this.url}/${tipo}/${id}`, {
      responseType: 'json',
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        authorization: localStorage.authorization,
      })
    });
  }
}

