import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Page } from '../../model/server/page';
import { Observable } from 'rxjs';
import { Predio } from '../../model/ua/predio';
import { OptionsPage } from '../../model/server/options-page';
import { Interesado } from '../../model/inte/interesado';
import { UePredio } from '../../model/rel/uePredio';
import { AgrupacionInteresados } from '../../model/inte/agrupacionInteresados';



@Injectable({
  providedIn: 'root'
})
export class PredioInteresadoService {

  private url = `${environment.urlApi}/prediointeresado`;

  constructor(private httpClient: HttpClient) { }

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

  findInteresadosByPredioId(filtros: Object): Observable<Page<AgrupacionInteresados>> { 
           
    return this.httpClient.post<Page<AgrupacionInteresados>>(
      `${this.url}/predio/by/interesadoId`, filtros, {
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          authorization: localStorage.authorization,
        })
      }
    );
  } 
}
