import { Component, effect } from '@angular/core';
import { TranslationService } from '../../services/translation';

@Component({
  selector: 'app-privacy-policy',
  imports: [],
  templateUrl: './privacy-policy.html',
  styleUrl: './privacy-policy.scss',
})
export class PrivacyPolicy {
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
