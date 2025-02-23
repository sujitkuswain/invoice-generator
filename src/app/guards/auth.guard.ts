import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class authGuard implements CanActivate {
  private auth = inject(Auth);
  private router = inject(Router);

  async canActivate(): Promise<boolean> {
    const user = this.auth.currentUser;
    if (user || localStorage.getItem('user') != null) {
      return true;
    } else {
      this.router.navigate(['/']); // Redirect if not logged in
      return false;
    }
  }
}
