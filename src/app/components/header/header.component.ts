import { Component, inject } from '@angular/core';
import { LogoComponent } from '../logo/logo.component';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ThemeService } from '../../services/theme.service';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    LogoComponent,
    MatButtonModule,
    TranslateModule,
    CommonModule,
    MatTooltipModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  authService = inject(AuthService);
  router = inject(Router);

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
  translationService = inject(TranslateService);
  themeService = inject(ThemeService);

  constructor() {
    this.translationService.setDefaultLang('en');
    this.translationService.use('en');
  }

  switchLanguage(language: string) {
    this.translationService.use(language);
  }

  toggleTheme() {
    console.log('Toggling theme');
    console.log(`before: ${this.themeService.currentTheme}`);
    this.themeService.toggleTheme();
    console.log(`after: ${this.themeService.currentTheme}`);
  }

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
}
