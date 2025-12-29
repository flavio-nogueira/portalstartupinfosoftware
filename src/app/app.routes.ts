import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { LandingPage } from './components/landing-page/landing-page';
import { MobilePage } from './components/mobile-page/mobile-page';
import { About } from './components/about/about';
import { PrivacyPolicy } from './components/privacy-policy/privacy-policy';
import { TermsOfUse } from './components/terms-of-use/terms-of-use';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'about', component: About },
  { path: 'landing-page', component: LandingPage },
  { path: 'mobile', component: MobilePage },
  { path: 'privacy-policy', component: PrivacyPolicy },
  { path: 'terms-of-use', component: TermsOfUse },
  { path: '**', redirectTo: '' }
];
