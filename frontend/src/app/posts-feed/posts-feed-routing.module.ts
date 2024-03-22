import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostsFeedComponent } from './posts-feed.component';
import { PostDetailComponent } from './post-detail/post-detail.component';

const routes: Routes = [
  // { path: '', component: PostsFeedComponent },
  { path: 'likes/:id', component: PostsFeedComponent },

  { path: 'detail/:id', component: PostDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostsFeedRoutingModule {}
