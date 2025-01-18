import { Injectable, Signal, WritableSignal, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private themeSignal: WritableSignal<string> = signal('light');

  get theme$(): Signal<string> {
    return this.themeSignal.asReadonly();
  }

  get currentTheme(): string {
    return this.themeSignal();
  }

  toggleTheme(): void {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.themeSignal.set(newTheme);

    // Update the body class when theme changes
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(`${newTheme}-theme`);
  }
}
