import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './services/theme.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'invoice-generator';

  themeService = inject(ThemeService);

  authService = inject(AuthService);

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  ngOnInit(): void {
    document.body.classList.add(`${this.themeService.currentTheme}-theme`);
    this.authService.user$.subscribe((user) => {
      if (user) {
        this.authService.currUserSig.set({
          email: user?.email!,
          userName: user?.displayName!,
        });
      } else {
        this.authService.currUserSig.set(null);
      }
    });
  }
}
