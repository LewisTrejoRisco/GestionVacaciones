import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import firebase from 'firebase/app'
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { OBTENERDATOS, URL_END_POINT_BASE } from 'app/shared/utilitarios/Constantes';
import { catchError } from "rxjs/operators";

@Injectable()
export class AuthService {
  private user: Observable<firebase.User>;
  private userDetails: firebase.User = null;
  private token: string;

  constructor(public _firebaseAuth: AngularFireAuth, public router: Router, private http: HttpClient) {
    this.user = _firebaseAuth.authState;
    this.user.subscribe(
      (user) => {
        if (user) {
          this.userDetails = user;
        }
        else {
          this.userDetails = null;
        }
      }
    );

  }

  signupUser(user: string, password: string) {
    //your code for signing up the new user
    // return this.http.get<any>('assets/json/loginResponse.json');
    return this.obtenerDatos(user.toUpperCase());
  }

  signinUser(email: string, password: string) {
    //your code for checking credentials and getting tokens for for signing in user
    console.log(this._firebaseAuth.signInWithEmailAndPassword(email, password))
    return this._firebaseAuth.signInWithEmailAndPassword(email, password)

  }

  logout() {
    this._firebaseAuth.signOut();
    this.router.navigate(['YOUR_LOGOUT_URL']);
  }

  isAuthenticated() {
    return true;
  }
  
  public guardarToken(accessToken: string): void {
      this.token = accessToken;
      sessionStorage.setItem('token', this.token);
  }

  public get userToken(): string {
      if (this.token != null) {
          return this.token;
      } else if (this.token == null && sessionStorage.getItem('token') != null) {
          this.token = sessionStorage.getItem('token');
          return this.token;
      }
      return null;
  }

  public cerrarSesion(): void {
      this.token = null;
      sessionStorage.clear();
  }
  

  public obtenerDatos(codiUsua: string) {
    console.log(URL_END_POINT_BASE + OBTENERDATOS + codiUsua)
        return this.http.get(URL_END_POINT_BASE + OBTENERDATOS + codiUsua)
        .pipe(catchError(e => {
            console.error(' Error al intentar listar. Msg: ' + e.error);
            return throwError(e);
        })
    );
}
}
