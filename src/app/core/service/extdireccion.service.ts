import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Page } from '../model/server/page';
import { Extdireccion } from '../model/extdireccion';
import { OptionsPage } from '../model/server/options-page';

@Injectable({
  providedIn: 'root'
})
export class ExtdireccionService {
  private url = `${environment.urlApi}/extdireccion`;

  constructor(
    private httpClient: HttpClient
  ) {
  }

  findAll(options: OptionsPage): Observable<Page<Extdireccion>> {
    return this.httpClient.get<Page<Extdireccion>>(
      `${this.url}/list${options ? options.toApi() : ''}`, {
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          authorization: localStorage.authorization,
        })
      }
    );
  }

  findById(id: number): Observable<Extdireccion> {
    return this.httpClient.get<Extdireccion>(`${this.url}/${id}`, {
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          authorization: localStorage.authorization,
        })
      }
    );
  }
}
