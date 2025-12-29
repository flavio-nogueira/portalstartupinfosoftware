import { Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from '../services/translation';

@Pipe({
  name: 'translate',
  pure: false
})
export class TranslatePipe implements PipeTransform {
  constructor(private translationService: TranslationService) {}

  transform(key: string): string {
    return this.translationService.t(key);
  }
}
