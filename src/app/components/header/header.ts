import { Component, HostListener, effect, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslationService, Language } from '../../services/translation';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  isScrolled = false;
  menuOpen = false;
  langMenuOpen = false;
  currentLang = signal<Language>('pt');

  constructor(public translationService: TranslationService) {
    this.currentLang.set(this.translationService.getCurrentLanguage());

    effect(() => {
      this.currentLang.set(this.translationService.getCurrentLanguage());
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    this.langMenuOpen = false;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  toggleLangMenu() {
    this.langMenuOpen = !this.langMenuOpen;
  }

  setLanguage(lang: Language) {
    this.translationService.setLanguage(lang);
    this.currentLang.set(lang);
    this.langMenuOpen = false;
  }

  getCurrentLanguage() {
    return this.currentLang();
  }

  t(key: string): string {
    return this.translationService.t(key);
  }
}
