import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import firebase from 'firebase/app'
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AuthService {
  private user: Observable<firebase.User>;
  private userDetails: firebase.User = null;
  private token: string;

  constructor(public _firebaseAuth: AngularFireAuth, public router: Router, private http: HttpClient) {
    this.user = _firebaseAuth.authState;
    console.log(this.user)
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
    console.log('email: '+ user)
    console.log('password: '+ password)
    return this.http.get<any>('assets/json/loginResponse.json');
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
}
