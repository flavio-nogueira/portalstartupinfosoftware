import { Component, effect } from '@angular/core';
import { TranslationService } from '../../services/translation';

@Component({
  selector: 'app-hero',
  imports: [],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {
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
