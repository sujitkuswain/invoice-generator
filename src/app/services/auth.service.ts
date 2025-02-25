import { User } from './../models/user.model';
import { inject, Injectable, signal } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  signOut,
  user,
} from '@angular/fire/auth';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  fireAuth = inject(Auth);
  user$ = user(this.fireAuth);
  currUserSig = signal<User | null | undefined>(undefined);

  constructor() {}

  login(email: string, password: string): Observable<void> {
    const promise = signInWithEmailAndPassword(
      this.fireAuth,
      email,
      password
    ).then((res) => {
      res.user?.getIdToken().then((token) => {
        localStorage.setItem('userToken', token);
      });

      localStorage.setItem('user', JSON.stringify(res.user));

      this.currUserSig.set({
        email: res.user?.email!,
        userName: res.user?.displayName!,
      });
    });

    return from(promise);
  }

  logout(): Observable<void> {
    const promise = signOut(this.fireAuth);

    return from(promise);
  }
}
