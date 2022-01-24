import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Page } from '../../model/server/page';
import { Observable } from 'rxjs';
import { OptionsPage } from '../../model/server/options-page';
import { Derecho, DerechoDTO, DerechoFiltradoDTO } from '../../model/rrr/derecho';


@Injectable({
  providedIn: 'root'
})
export class DerechoService {

  private url = `${environment.urlApi}/derecho`;

  constructor(
    private httpClient: HttpClient
  ) {
  }

  filter(options: OptionsPage, derecho: DerechoFiltradoDTO): Observable<Page<Derecho>> { 
    console.log("filter",derecho);       
    return this.httpClient.post<Page<Derecho>>(
      `${this.url}/list${options? options.toApi(): ''}`, derecho, {
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          authorization: localStorage.authorization,
        })
      }
    );
  }
  
  findAll(options?: OptionsPage): Observable<Page<Derecho>> {    
    return this.httpClient.get<Page<Derecho>>(
      `${this.url}/list${options ? options.toApi() : ''}`, {
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          authorization: localStorage.authorization,
        })
      }
    );
  }

  findAllByInteresadoId(options?: OptionsPage, interesadoId?: number): Observable<Page<Derecho>> {    
    return this.httpClient.get<Page<Derecho>>(
      `${this.url}/list/${interesadoId}${options ? options.toApi() : ''}`, {
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

  update(derecho: Derecho): Observable<Derecho> {   
    console.log("update derecho =>",derecho); 
    return this.httpClient.put<DerechoDTO>(
      `${this.url}`, derecho, {
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          authorization: localStorage.authorization,
        })
      }
    );
  }
  updatewithrelation(derecho: Derecho): Observable<Derecho> {   
    console.log("updatewithrelation derecho =>");   
    console.log(derecho); 
    return this.httpClient.put<DerechoDTO>(
      `${this.url}/relation`, derecho, {
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          authorization: localStorage.authorization,
        })
      }
    );
  }

  create(derecho: Derecho): Observable<Derecho> { 
    console.log("create derecho =>",derecho);   
    return this.httpClient.post<DerechoDTO>(
      `${this.url}`, derecho, {
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          authorization: localStorage.authorization,
        })
      }
    );
  }
  createwithrelation(derecho: Derecho): Observable<Derecho> { 
    console.log("createwithrelation derecho =>",derecho);   
    return this.httpClient.post<DerechoDTO>(
      `${this.url}/relation`, derecho, {
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          authorization: localStorage.authorization,
        })
      }
    );
  }


}

