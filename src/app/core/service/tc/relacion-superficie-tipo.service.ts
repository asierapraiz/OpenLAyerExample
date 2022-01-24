import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Page } from '../../model/server/page';
import { RelacionSuperficieTipo } from '../../model/tc/relacion-superficie-tipo';
import { OptionsPage } from '../../model/server/options-page';

@Injectable({
  providedIn: 'root'
})
export class RelacionSuperficieTipoService {
  private url = `${environment.urlApi}/tipo/relacionsuperficie`;

  constructor(
    private httpClient: HttpClient
  ) {
  }

  findAllPage(options: OptionsPage): Observable<Page<RelacionSuperficieTipo>> {
    return this.httpClient.get<Page<RelacionSuperficieTipo>>(
      `${this.url}/list${options ? options.toApi() : ''}`, {
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          authorization: localStorage.authorization,
        })
      }
    )
  }

  findAll(): Observable<RelacionSuperficieTipo[]> {
    return this.httpClient.get<RelacionSuperficieTipo[]>(
      `${this.url}/all`, {
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          authorization: localStorage.authorization,
        })
      }
    ).pipe(
      map((response: any)=>{        
        return response as RelacionSuperficieTipo[];
      })      
    );
  }

  findById(id: number): Observable<RelacionSuperficieTipo> {
    return this.httpClient.get<RelacionSuperficieTipo>(`${this.url}/${id}`, {
      responseType: 'json',
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        authorization: localStorage.authorization,
      })
    });
  }
}
