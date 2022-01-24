import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ResponseLogin } from '../model/server/response-login';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import jwt_decode from 'jwt-decode';
import { IToken } from '../model/server/iToken';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private url = `${environment.urlApi}/login`;

  constructor(
    private httpClient: HttpClient
  ) {
  }

  login(email: string, password: string): Observable<void> {
    const loginData = {
      email,
      password
    };
    return this.httpClient.post<ResponseLogin>(this.url, loginData).pipe(
      map((res) => {
        const iToken = jwt_decode<IToken>(res.authorization);
        localStorage.setItem('authorization', res.authorization);
        localStorage.setItem('role', iToken.role);
        localStorage.setItem('id', String(iToken.id));
        localStorage.setItem('exp', String(iToken.exp));
        localStorage.setItem('sub', iToken.sub);
      })
    );
  }
}
