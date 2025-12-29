import { Component, effect } from '@angular/core';
import { TranslationService } from '../../services/translation';

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {
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
