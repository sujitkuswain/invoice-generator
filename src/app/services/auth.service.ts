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
    ).then(() => {});

    return from(promise);
  }

  logout(): Observable<void> {
    const promise = signOut(this.fireAuth);

    return from(promise);
  }
}
