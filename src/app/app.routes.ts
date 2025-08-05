import { Routes } from '@angular/router';
import { ContactsPageComponent } from './features/contacts-page/contacts-page.component';

export const routes: Routes = [
  {
    path: '',
    component: ContactsPageComponent, // TODO: add "home" component
  },
  {
    path: 'contacts',
    component: ContactsPageComponent,
  },
];
