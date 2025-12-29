import { Component, inject } from '@angular/core';
import { TranslationService } from '../../services/translation';

@Component({
  selector: 'app-mobile-page',
  imports: [],
  templateUrl: './mobile-page.html',
  styleUrl: './mobile-page.scss',
})
export class MobilePage {
  private translationService = inject(TranslationService);

  t(key: string): string {
    return this.translationService.t(key);
  }
}
