import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../../model/user.model';
import {Observable, Subscription} from 'rxjs';
import { environment } from '../../../../environments/environment';
import { tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

const options = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  public getUser(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/user/me`, options);
  }

  public getAllUser(): Observable<User[]> {
    // TODO: implement
    return this.http.get<User[]>(`${environment.apiUrl}/user/`, options);
  }

  public userSignUp(user: any): Observable<{ token: string }> {
    return this.http
      .post<{ token: string }>(
        `${environment.apiUrl}/user/signup`,
        user,
        options
      )
      .pipe(
        tap(() => {
          this.userLogIn(user);
        })
      );
  }

  public userLogIn(user: any): Observable<{ token: string }> {
    return this.http
      .post<{ token: string }>(
        `${environment.apiUrl}/user/login`,
        user,
        options
      )
      .pipe(
        tap((res) => {
          localStorage.setItem('access_token', res.token);
        })
      );
  }

  public userEdit(user: any): Observable<User> {
    return this.http
      .post<User>(
        `${environment.apiUrl}/user/edit`,
        user,
        options
      )
  }

  public recoverPassword(email: string) {
    return this.http.post(
      `${environment.apiUrl}/user/recover`,
      { email: email },
      options
    );
  }

  public resetPassword(password: string, token: string) {
    return this.http.post(
      `${environment.apiUrl}/user/reset/${token}`,
      { password: password },
      options
    );
  }

  public logout(): void {
    localStorage.removeItem('access_token');
  }

  public get loggedIn(): boolean {
    const token = localStorage.getItem('access_token');
    const helper = new JwtHelperService();
    return token ? !helper.isTokenExpired(token) : false;
  }

  public get token() {
    return localStorage.getItem('access_token');
  }
}
