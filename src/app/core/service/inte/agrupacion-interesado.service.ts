import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Page } from '../../model/server/page';
import { Observable } from 'rxjs';
import { OptionsPage } from '../../model/server/options-page';
import { AgrupacionInteresados, AgrupacionInteresadosFiltrado } from './../../model/inte/agrupacionInteresados';
import { Interesado } from '../../model/inte/interesado';
import { MiembroAgrupacion } from '../../model/rel/miembroAgrupacion';


@Injectable({
  providedIn: 'root'
})
export class AgrupacionInteresadosService {


  private url = `${environment.urlApi}/agrupacionInteresados`;

  constructor(
    private httpClient: HttpClient
  ) {
  }

  create(agrupacionInteresados: AgrupacionInteresados): Observable<AgrupacionInteresados> {
    return this.httpClient.post<AgrupacionInteresados>(
      `${this.url}`, agrupacionInteresados, {
      responseType: 'json',
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        authorization: localStorage.authorization,
      })
    }
    );
  }

  createMiembroAgrupacion(miembroAgrupacion: MiembroAgrupacion): Observable<any> {
    return this.httpClient.post<any>(
      `${environment.urlApi}/miembroagrupacion`, miembroAgrupacion, {
      responseType: 'json',
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        authorization: localStorage.authorization,
      })
    }
    );
  }

  delete(id?: number): Observable<void> {
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
  

  removeMiembroFromAgrupacion(interesadoId: number, agrupacionId: number){    
    return this.httpClient.post<Interesado>(
      `${this.url}/${agrupacionId}/interesado/${interesadoId}/remove`, null, {
      responseType: 'json',
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        authorization: localStorage.authorization,
      })
    }
    );
  }

  


  findAll(options?: OptionsPage): Observable<Page<AgrupacionInteresados>> {
    return this.httpClient.get<Page<AgrupacionInteresados>>(
      `${this.url}/list${options ? options.toApi() : ''}`, {
      responseType: 'json',
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        authorization: localStorage.authorization,
      })
    }
    );
  }

  filter(options: OptionsPage, filtros: AgrupacionInteresadosFiltrado): Observable<Page<AgrupacionInteresados>> {
    return this.httpClient.post<Page<AgrupacionInteresados>>(
      `${this.url}/list${options ? options.toApi() : ''}`, filtros, {
      responseType: 'json',
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        authorization: localStorage.authorization,
      })
    }
    );
  }

  update(agrupacionInteresados: AgrupacionInteresados): Observable<AgrupacionInteresados> {
    return this.httpClient.put<AgrupacionInteresados>(
      `${this.url}`, agrupacionInteresados, {
      responseType: 'json',
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        authorization: localStorage.authorization,
      })
    }
    );
  }

  findInteresadosByAgrupacionId(options?: OptionsPage, agrupacionId?: number): Observable<Page<Interesado>> {
    
    return this.httpClient.get<Page<Interesado>>(
      `${this.url}/${agrupacionId}/interesados${options ? options.toApi() : ''}`, {
      responseType: 'json',
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        authorization: localStorage.authorization,
      })
    }
    );
  }

}





