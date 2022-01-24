import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Page } from '../../model/server/page';
import { Observable } from 'rxjs';
import { OptionsPage } from '../../model/server/options-page';
import { Interesado, InteresadoFiltrado } from './../../model/inte/interesado';

@Injectable({
  providedIn: 'root'
})
export class InteresadoService {

  private url = `${environment.urlApi}/interesado`;

  constructor(
    private httpClient: HttpClient
  ) {
  }

  create(interesado: Interesado): Observable<Interesado> {  
      
    return this.httpClient.post<Interesado>(
      `${this.url}`, interesado, {
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          authorization: localStorage.authorization,
        })
      }
    );
  }

  createWithGroupAndPredio(interesado: Interesado, agrupacionId: number, predioId: number): Observable<Interesado> {  
      
    return this.httpClient.post<Interesado>(
      `${this.url}/agrupacion/${agrupacionId}/predio/${predioId}`, interesado, {
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          authorization: localStorage.authorization,
        })
      }
    );
  }
  

  createWithPredio(interesado: Interesado, predioId: number): Observable<Interesado> {  
      
    return this.httpClient.post<Interesado>(
      `${this.url}/${predioId}`, interesado, {
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          authorization: localStorage.authorization,
        })
      }
    );
  }

  createWithGroup(interesado: Interesado, agrupacionId: number): Observable<Interesado> {  
      
    return this.httpClient.post<Interesado>(
      `${this.url}/agrupacion/${agrupacionId}`, interesado, {
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          authorization: localStorage.authorization,
        })
      }
    );
  }

  

  createGroupRelWithPredio(agrupacionId: number, predioId: number): Observable<Interesado> { 
        
    return this.httpClient.post<Interesado>(
      `${environment.urlApi}/agrupacionInteresados/${agrupacionId}/predio/${predioId}`, null, {
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

  deleteByPredioId(interesadoId: number, predioId: number): Observable<void> {

    return this.httpClient.delete<void>(`${this.url}/${interesadoId}/predio/${predioId}`,
      {
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          authorization: localStorage.authorization,
        })
      }
    );
  }

  findAll(options?: OptionsPage): Observable<Page<Interesado>> {
    return this.httpClient.get<Page<Interesado>>(
      `${this.url}/list${options ? options.toApi() : ''}`, {
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          authorization: localStorage.authorization,
        })
      }
    );
  }

  filter(options: OptionsPage, filtros: InteresadoFiltrado): Observable<Page<Interesado>> {       
    return this.httpClient.post<Page<Interesado>>(
      `${this.url}/list${options? options.toApi(): ''}`, filtros, {
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          authorization: localStorage.authorization,
        })
      }
    );
  }

  update(interesado: Interesado): Observable<Interesado> {  
    
    return this.httpClient.put<Interesado>(
      `${this.url}`, interesado, {
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          authorization: localStorage.authorization,
        })
      }
    );
  }

  findAllByPredioId(predioId?: number, options?: OptionsPage): Observable<Page<Interesado>> {    
    return this.httpClient.get<Page<Interesado>>(
      `${this.url}/listbypredio/${predioId}${options? options.toApi(): ''}`, {
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          authorization: localStorage.authorization,
        })
      }
    );
  }


}

