import { Routes } from '@angular/router';
import { ContactsPageComponent } from './features/contacts-page/contacts-page.component';
import { PrivacyPolicyPageComponent } from './features/privacy-policy-page/privacy-policy-page.component';
import { LegalNoticePageComponent } from './features/legal-notice-page/legal-notice-page.component';
import { HelpPageComponent } from './features/help-page/help-page.component';
import { BoardPageComponent } from './features/board-page/board-page.component';
import { AddTaskPageComponent } from './features/add-task-page/add-task-page.component';
import { SummaryComponent } from './features/summary/summary.component';
import { LogInPageComponent } from './features/log-in-page/log-in-page.component';

export const routes: Routes = [
  {
    path: '',
    component: LogInPageComponent, // TODO: add "home" component
  },
  {
    path: 'summary',
    component: SummaryComponent,
  },
  {
    path: 'board',
    component: BoardPageComponent,
  },
  {
    path: 'contacts',
    component: ContactsPageComponent,
  },
  {
    path: 'addTask',
    component: AddTaskPageComponent,
  },
  {
    path: 'privacy',
    component: PrivacyPolicyPageComponent,
  },
  {
    path: 'legal',
    component: LegalNoticePageComponent,
  },
  {
    path: 'help',
    component: HelpPageComponent,
  },
];
