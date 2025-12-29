import { Injectable, signal } from '@angular/core';
import { translations } from '../translations/translations';

export type Language = 'pt' | 'es' | 'en';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLanguage = signal<Language>('pt');

  constructor() {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && ['pt', 'es', 'en'].includes(savedLang)) {
      this.currentLanguage.set(savedLang);
    }
  }

  getCurrentLanguage() {
    return this.currentLanguage();
  }

  setLanguage(lang: Language) {
    this.currentLanguage.set(lang);
    localStorage.setItem('language', lang);
  }

  translate(key: string): string {
    const lang = this.currentLanguage();
    const keys = key.split('.');
    let value: any = translations[lang];

    for (const k of keys) {
      value = value?.[k];
    }

    return value || key;
  }

  t(key: string): string {
    return this.translate(key);
  }
}
