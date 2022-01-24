import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Page } from '../../model/server/page';
import { Observable } from 'rxjs';
import { OptionsPage } from '../../model/server/options-page';
import {UnidadConstruccion, UnidadConstruccionFilter } from '../../model/ue/unidadConstruccion';
import { Extent } from 'ol/extent';
import { UnidadConstruccionDto } from '../../model/ue/unidadConstruccion';

@Injectable({
  providedIn: 'root'
})
export class UnidadConstruccionService {

  private url = `${environment.urlApi}/unidadconstruccion`;

  constructor(
    private httpClient: HttpClient
  ) {
  }

  create(unidad: UnidadConstruccionDto): Observable<UnidadConstruccion> {    
    return this.httpClient.post<UnidadConstruccion>(
      `${this.url}`, unidad, {
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          authorization: localStorage.authorization,
        })
      }
    );
  }

  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.url}/${id}`,
      {
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          authorization: localStorage.authorization,
        })
      }
    );
  }

  findAll(options?: OptionsPage): Observable<Page<UnidadConstruccion>> {    
    return this.httpClient.get<Page<UnidadConstruccion>>(
      `${this.url}/list${options ? options.toApi() : ''}`, {
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          authorization: localStorage.authorization,
        })
      }
    );
  }

  getAllWithExtent(options: OptionsPage, extent: Extent): Observable<Page<UnidadConstruccion>> {      
    return this.httpClient.post<Page<UnidadConstruccion>>(
      `${this.url}/extent/list${options? options.toApi(): ''}`, extent, {
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          authorization: localStorage.authorization,
        })
      }
    );
  }

  filter(options: OptionsPage, construccion: UnidadConstruccionFilter): Observable<Page<UnidadConstruccion>> {    
    return this.httpClient.post<Page<UnidadConstruccion>>(
      `${this.url}/list${options? options.toApi(): ''}`, construccion, {
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          authorization: localStorage.authorization,
        })
      }
    );
  }

  update(construccion: UnidadConstruccion): Observable<UnidadConstruccion> {    
    return this.httpClient.put<UnidadConstruccion>(
      `${this.url}`, construccion, {
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          authorization: localStorage.authorization,
        })
      }
    );
  }

  findUnidadesByConstruccionId(options?: OptionsPage, id?: number): Observable<Page<UnidadConstruccion>> {
          
    return this.httpClient.get<Page<UnidadConstruccion>>(
      `${this.url}/construccion/${id}/unidades/list${options ? options.toApi() : ''}`, {
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          authorization: localStorage.authorization,
        })
      }
    );
  }

}

