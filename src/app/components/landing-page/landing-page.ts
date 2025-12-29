import { Component } from '@angular/core';
import { TranslationService } from '../../services/translation';

@Component({
  selector: 'app-landing-page',
  imports: [],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.scss',
})
export class LandingPage {
  constructor(public translationService: TranslationService) {}

  t(key: string): string {
    return this.translationService.t(key);
  }
}
