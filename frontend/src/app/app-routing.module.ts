import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';

import { SignupComponent } from './auth/signup/signup.component';
import { PostsFeedComponent } from './posts-feed/posts-feed.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { CreatePostComponent } from './create-post/create-post.component';
import { ProfileComponent } from './profile/profile.component';
import { SettingsComponent } from './settings/settings.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  // { path: 'posts', component: PostsFeedComponent },

  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: PostsFeedComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'addnew', component: CreatePostComponent, canActivate: [AuthGuard] },
  {
    path: 'u/:id',
    component: ProfileComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: PostsFeedComponent },
      { path: 'posts', component: PostsFeedComponent },
      { path: 'likes', component: PostsFeedComponent },
      { path: 'bookmarks', component: PostsFeedComponent },
    ],
  },

  // {
  //   path: 'profile',
  //   component: ProfileComponent,
  //   canActivate: [AuthGuard],
  //   children: [
  //     { path: '', component: PostsFeedComponent },
  //     { path: 'posts', component: PostsFeedComponent },
  //     { path: 'likes', component: PostsFeedComponent },
  //     { path: 'bookmarks', component: PostsFeedComponent },
  //   ],
  // },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },

  {
    path: 'post',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./posts-feed/posts-feed.module').then((m) => m.PostsFeedModule),
  },

  { path: '**', component: PageNotFoundComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
