import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Page } from '../../model/server/page';
import { Observable } from 'rxjs';
import { Construccion, ConstruccionFilter ,ConstruccionDto} from '../../model/ue/construccion';
import { OptionsPage } from '../../model/server/options-page';
import { Extent } from 'ol/extent';

@Injectable({
  providedIn: 'root'
})
export class ConstruccionService {

  private url = `${environment.urlApi}/construccion`;

  constructor(
    private httpClient: HttpClient
  ) {
  }

  create(construccion: ConstruccionDto): Observable<Construccion> {     
    return this.httpClient.post<Construccion>(
      `${this.url}`, construccion, {
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          authorization: localStorage.authorization,
        })
      }
    );
  }

  update(construccion: ConstruccionDto): Observable<Construccion> {       

    return this.httpClient.put<Construccion>(      
      `${this.url}`, construccion, {
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

  findAll(options?: OptionsPage): Observable<Page<Construccion>> {    
    return this.httpClient.get<Page<Construccion>>(
      `${this.url}/list${options ? options.toApi() : ''}`, {
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          authorization: localStorage.authorization,
        })
      }
    );
  }

  getAllWithExtent(options: OptionsPage, extent: Extent): Observable<Page<Construccion>> {      
    return this.httpClient.post<Page<Construccion>>(
      `${this.url}/extent/list${options? options.toApi(): ''}`, extent, {
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          authorization: localStorage.authorization,
        })
      }
    );
  }

  filter(options: OptionsPage, construccion: ConstruccionFilter): Observable<Page<Construccion>> {    
    return this.httpClient.post<Page<Construccion>>(
      `${this.url}/list${options? options.toApi(): ''}`, construccion, {
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          authorization: localStorage.authorization,
        })
      }
    );
  }

  

  findConstruccionesByTerrenoId(options?: OptionsPage, terrenoId?: number): Observable<Page<Construccion>> {           
    return this.httpClient.get<Page<Construccion>>(
      `${this.url}/terreno/${terrenoId}/construccion/list${options ? options.toApi() : ''}`, {
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          authorization: localStorage.authorization,
        })
      }
    );
  }

  findConstruccionesByPredioId(options?: OptionsPage, predioId?: number): Observable<Page<Construccion>> {     
          
    return this.httpClient.get<Page<Construccion>>(
      `${this.url}/predio/${predioId}/construcciones${options? options.toApi(): ''}`, {
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          authorization: localStorage.authorization,
        })
      }
    );
  }

}

