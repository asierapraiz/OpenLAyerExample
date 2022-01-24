import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Page } from '../../model/server/page';
import { Observable } from 'rxjs';
import { Predio, PredioDto } from '../../model/ua/predio';
import { OptionsPage } from '../../model/server/options-page';
import { Terreno } from '../../model/ue/terreno';
import { Interesado } from '../../model/inte/interesado';


@Injectable({
  providedIn: 'root'
})
export class PredioService {

  private url = `${environment.urlApi}/predio`;

  constructor(
    private httpClient: HttpClient
  ) {
  }

  create(predio: Predio, terrenoId: number): Observable<Predio> { 
      
    return this.httpClient.post<Predio>(
      `${this.url}/${terrenoId}`, predio, {
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

  findAll(options?: OptionsPage): Observable<Page<Predio>> {    
    return this.httpClient.get<Page<Predio>>(
      `${this.url}/list${options ? options.toApi() : ''}`, {
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          authorization: localStorage.authorization,
        })
      }
    );
  }

  findById(predioId: Object): Observable<Page<Predio>> {          
    return this.httpClient.get<Page<Predio>>(
      `${this.url}/${predioId}`, {
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          authorization: localStorage.authorization,
        })
      }
    );
  }  

  filter(options: OptionsPage, predio: Predio): Observable<Page<Predio>> {        
    return this.httpClient.post<Page<Predio>>(
      `${this.url}/list${options? options.toApi(): ''}`, predio, {
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          authorization: localStorage.authorization,
        })
      }
    );
  }

  update(predio: Predio): Observable<Predio> {     
    return this.httpClient.put<Predio>(
      `${this.url}`, predio, {
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          authorization: localStorage.authorization,
        })
      }
    );
  }
  
  findTerrenoByPredioId(options?: OptionsPage, id?: number): Observable<Page<Terreno>> {          
    return this.httpClient.get<Page<Terreno>>(
      `${this.url}/${id}/terreno${options ? options.toApi() : ''}`, {
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          authorization: localStorage.authorization,
        })
      }
    );
  } 

  findAllByInteresadoId(interesadoId?: number, options?: OptionsPage): Observable<Page<PredioDto>> {         
    return this.httpClient.get<Page<PredioDto>>(
      `${this.url}/listt/${interesadoId}${options? options.toApi(): ''}`, {
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          authorization: localStorage.authorization,
        })
      }
    );
  }

  getAllPrediosOfTerreno(id: number): Observable<Page<Predio>> {          
    return this.httpClient.get<Page<Predio>>(
      `${this.url}/terreno/${id}/predio/list`, {
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          authorization: localStorage.authorization,
        })
      }
    );
  }

  getAllPrediosOfConstruccion(id: number): Observable<Page<Predio>> {          
    return this.httpClient.get<Page<Predio>>(
      `${this.url}/construccion/${id}/predio/list`, {
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          authorization: localStorage.authorization,
        })
      }
    );
  }

  findInteresadosByPredioId(options?: OptionsPage, id?: number): Observable<Page<Interesado>> {      
    return this.httpClient.get<Page<Interesado>>(
      `${this.url}/${id}/interesados${options ? options.toApi() : ''}`, {
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          authorization: localStorage.authorization,
        })
      }
    );
  }


}



