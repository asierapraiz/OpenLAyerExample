import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Page } from '../../model/server/page';
import { Observable } from 'rxjs';
import { Terreno, TerrenoFilter } from '../../model/ue/terreno';
import { OptionsPage } from '../../model/server/options-page';
import { optionsFromCapabilities } from 'ol/source/WMTS';
import { Predio } from '../../model/ua/predio';
import { Extent } from 'ol/extent';

@Injectable({
  providedIn: 'root'
})
export class TerrenoService {
  private url = `${environment.urlApi}/terreno`;

  constructor(
    private httpClient: HttpClient
  ) {
  }

  create(terrenoDto: Terreno): Observable<Terreno> {    
    return this.httpClient.post<Terreno>(
      `${this.url}`, terrenoDto, {
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          authorization: localStorage.authorization,
        })
      }
    );
  }

  delete(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.url}/${id}`,
      {
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          authorization: localStorage.authorization,
        })
      }
    );
  }

  findAll(options?: OptionsPage): Observable<Page<Terreno>> {
    return this.httpClient.get<Page<Terreno>>(
      `${this.url}/list${options ? options.toApi() : ''}`, {
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          authorization: localStorage.authorization,
        })
      }
    );
  }

  getAllWithExtent(options: OptionsPage, extent: Extent): Observable<Page<Terreno>> {      
    return this.httpClient.post<Page<Terreno>>(
      `${this.url}/extent/list${options? options.toApi(): ''}`, extent, {
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          authorization: localStorage.authorization,
        })
      }
    );
  }

  filter(options: OptionsPage, terrenoFilter: TerrenoFilter): Observable<Page<Terreno>> {    
    return this.httpClient.post<Page<Terreno>>(
      `${this.url}/list${options? options.toApi(): ''}`, terrenoFilter, {
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          authorization: localStorage.authorization,
        })
      }
    );
  }

  update(terrenoDto: Terreno): Observable<Terreno> {    
    return this.httpClient.put<Terreno>(
      `${this.url}`, terrenoDto, {
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          authorization: localStorage.authorization,
        })
      }
    );
  }

  findPrediosByTerrenoId(options?: OptionsPage, id?: number): Observable<Page<Predio>> {        
    return this.httpClient.get<Page<Predio>>(
      `${this.url}/${id}/predios${options ? options.toApi() : ''}`, {
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          authorization: localStorage.authorization,
        })
      }
    );
  }

  findTerrenoByConstruccionId(options?: OptionsPage, id?: number): Observable<Page<Terreno>> {        
    return this.httpClient.get<Page<Terreno>>(
      `${this.url}/construccion/${id}/terreno/list${options ? options.toApi() : ''}`, {
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          authorization: localStorage.authorization,
        })
      }
    );
  }

}
