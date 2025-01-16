import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'invoice-generator';
  translationService = inject(TranslateService);

  constructor() {
    this.translationService.setDefaultLang('en');
  }
  switchLanguage(language: string) {
    this.translationService.use(language);
  }
}
