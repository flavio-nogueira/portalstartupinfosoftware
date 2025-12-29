import { Component, effect } from '@angular/core';
import { TranslationService } from '../../services/translation';

@Component({
  selector: 'app-terms-of-use',
  imports: [],
  templateUrl: './terms-of-use.html',
  styleUrl: './terms-of-use.scss',
})
export class TermsOfUse {
  constructor(public translationService: TranslationService) {
    effect(() => {
      this.translationService.getCurrentLanguage();
      this.forceUpdate();
    });
  }

  t(key: string): string {
    return this.translationService.t(key);
  }

  private forceUpdate() {
    // Força atualização do componente
  }
}
