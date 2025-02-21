import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'; // Use modular SDK
import { AuthService } from '../../services/auth.service';
import { user } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { merge } from 'rxjs';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatButtonModule,
    CommonModule,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);

  loginForm: FormGroup;
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);

  fb = inject(FormBuilder);
  errorMessage = signal('');

  constructor() {
    this.loginForm = this.fb.group({
      email: this.email,
      password: this.password,
    });

    merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }

  login() {
    if (this.loginForm.invalid) {
      this.errorMessage.set('Invalid inputs');
      return;
    }

    this.authService.login(this.email.value!, this.password.value!).subscribe({
      //'test@mail.com', '123456'
      next: () => {
        console.log('Logged in');
        this.router.navigate(['/invoice']);
      },
      error: (e) => {
        console.error(e);
        this.errorMessage.set('Invalid credentials');
      },
    });
  }

  updateErrorMessage() {
    if (this.email.hasError('required')) {
      this.errorMessage.set('You must enter a value');
    } else if (this.email.hasError('email')) {
      this.errorMessage.set('Not a valid email');
    } else {
      this.errorMessage.set('');
    }
  }

  ngOnInit(): void {
    if (this.authService.currUserSig() != null) {
      this.router.navigate(['/invoice']);
    }
  }
}
