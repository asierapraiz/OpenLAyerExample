import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Page } from '../../model/server/page';
import { Observable } from 'rxjs';
import { Predio } from '../../model/ua/predio';
import { OptionsPage } from '../../model/server/options-page';
import { Terreno } from '../../model/ue/terreno';
import { Interesado } from '../../model/inte/interesado';
import { UePredio } from '../../model/rel/uePredio';
import { UnidadConstruccion } from '../../model/ue/unidadConstruccion';
import { AgrupacionInteresados } from '../../model/inte/agrupacionInteresados';

@Injectable({
  providedIn: 'root'
})
export class UepredioService {

  private url = `${environment.urlApi}/uepredio`;

  constructor( private httpClient: HttpClient) { }  
  

  filter(filtros: Object): Observable<Page<UePredio>> {  
      
    return this.httpClient.post<Page<UePredio>>(
      `${this.url}/list`, filtros, {
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          authorization: localStorage.authorization,
        })
      }
    );
  }  

  

  getTerrnoByConstruccionId(filtros: Object): Observable<Page<Terreno>> {        
    return this.httpClient.post<Page<Terreno>>(
      `${this.url}/terreno/by/construccionId`, filtros, {
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          authorization: localStorage.authorization,
        })
      }
    );
  }  

  findPrediosByUnidadId(filtros: Object): Observable<Page<Predio>> {          
    return this.httpClient.post<Page<Predio>>(
      `${this.url}/predio/by/unidadId`, filtros, {
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          authorization: localStorage.authorization,
        })
      }
    );
  }  

  findConstruccionesByUnidadId(filtros: Object): Observable<Page<Predio>> {          
    return this.httpClient.post<Page<Predio>>(
      `${this.url}/construccion/by/unidadId`, filtros, {
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          authorization: localStorage.authorization,
        })
      }
    );
  }   

  findTerrenoByConstruccionId(filtros: Object): Observable<Page<Terreno>> {          
    return this.httpClient.post<Page<Terreno>>(
      `${this.url}/terreno/by/construccionId`, filtros, {
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          authorization: localStorage.authorization,
        })
      }
    );
  } 

  findTerrenoByPredioId(filtros: Object): Observable<Page<Terreno>> {          
    return this.httpClient.post<Page<Terreno>>(
      `${this.url}/terreno/by/predioId`, filtros, {
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          authorization: localStorage.authorization,
        })
      }
    );
  } 

  findTerrenoByUnidadId(filtros: Object): Observable<Page<Terreno>> {         
    return this.httpClient.post<Page<Terreno>>(
      `${this.url}/terreno/by/unidadId`, filtros, {
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          authorization: localStorage.authorization,
        })
      }
    );
  } 

  findPrediosByConstruccionId(filtros: Object): Observable<Page<Predio>> {          
    return this.httpClient.post<Page<Predio>>(
      `${this.url}/predio/by/construccionId`, filtros, {
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          authorization: localStorage.authorization,
        })
      }
    );
  } 

  findUnidadByPredioId(filtros: Object): Observable<Page<UnidadConstruccion>> {          
    return this.httpClient.post<Page<UnidadConstruccion>>(
      `${this.url}/unidad/by/predioId`, filtros, {
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          authorization: localStorage.authorization,
        })
      }
    );
  } 

  findAgrupacionByPredioId(filtros: Object): Observable<Page<AgrupacionInteresados>> {          
    return this.httpClient.post<Page<AgrupacionInteresados>>(
      `${this.url}/agrupacion/by/predioId`, filtros, {
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          authorization: localStorage.authorization,
        })
      }
    );
  } 
}
