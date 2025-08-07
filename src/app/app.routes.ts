import { Routes } from '@angular/router';
import { ContactsPageComponent } from './features/contacts-page/contacts-page.component';
import { PrivacyPolicyPageComponent } from './features/privacy-policy-page/privacy-policy-page.component';
import { LegalNoticePageComponent } from './features/legal-notice-page/legal-notice-page.component';

export const routes: Routes = [
  {
    path: '',
    component: ContactsPageComponent, // TODO: add "home" component
  },
  {
    path: 'contacts',
    component: ContactsPageComponent,
  },
  {
    path: 'privacy',
    component: PrivacyPolicyPageComponent,
  },
  {
    path: 'legal',
    component: LegalNoticePageComponent,
  },
];
