import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'; // Use modular SDK
import { AuthService } from '../../services/auth.service';
import { user } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatButtonModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);

  login() {
    this.authService.login('test@mail.com', '123456').subscribe({
      next: () => {
        console.log('Logged in');
        this.router.navigate(['/invoice']);
      },
      error: (e) => {
        console.error(e);
      },
    });
  }

  ngOnInit(): void {
    if (this.authService.currUserSig() != null) {
      this.router.navigate(['/invoice']);
    }
  }
}
