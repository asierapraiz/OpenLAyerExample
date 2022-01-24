import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private url = `${environment.urlApi}/setting`;

  constructor(private httpClient: HttpClient) { }

  
  getZoom(): Observable<any> {
    return this.httpClient.get<any>(
      `${this.url}/maphurricane.terrenos_nivel_zoom`, {
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          authorization: localStorage.authorization,
        })
      }
    );
  }
}
