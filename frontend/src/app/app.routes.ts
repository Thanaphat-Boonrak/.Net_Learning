import { Routes } from '@angular/router';
import { HomePage } from '../features/home-page/home-page';
import { MemberList } from '../features/members/member-list/member-list';
import { MemberDetail } from '../features/members/member-detail/member-detail';
import { authGuard } from '../core/guards/auth-guard';
import { TestErrors } from '../features/test-errors/test-errors';
import { NotFound } from '../shared/errors/not-found/not-found';
import { ServerError } from '../shared/errors/server-error/server-error';
import { MemberProfile } from '../features/members/member-profile/member-profile';
import { MemberPhoto } from '../features/members/member-photo/member-photo';
import { MemberMessage } from '../features/members/member-message/member-message';
import { Messages } from '../features/messages/messages';
import { Lists } from '../features/lists/lists';
import { memberResolver } from '../features/members/member-resolver';
import { preventSaveUnchangeGuard } from '../core/guards/prevent-save-unchange-guard';

export const routes: Routes = [
  { path: '', component: HomePage },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [authGuard],
    children: [
      { path: 'members', component: MemberList },
      {
        path: 'members/:id',
        component: MemberDetail,

        resolve: { member: memberResolver },
        runGuardsAndResolvers: 'paramsChange',
        children: [
          { path: '', redirectTo: 'profile', pathMatch: 'full' },
          {
            path: 'profile',
            component: MemberProfile,
            title: 'Profile',
            canDeactivate: [preventSaveUnchangeGuard],
          },
          { path: 'photo', component: MemberPhoto, title: 'Photo' },
          { path: 'message', component: MemberMessage, title: 'Message' },
        ],
      },
      { path: 'lists', component: Lists },
      { path: 'messages', component: Messages },
    ],
  },
  { path: 'errors', component: TestErrors },
  { path: 'server-error', component: ServerError },
  { path: '**', component: NotFound },
];
