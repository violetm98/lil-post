import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostsFeedRoutingModule } from './posts-feed-routing.module';

import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxMasonryModule } from 'ngx-masonry';
import { MatDialogModule } from '@angular/material/dialog';

import { PostsFeedComponent } from './posts-feed.component';
import { LikeComponent } from './like/like.component';
import { BookmarkComponent } from './bookmark/bookmark.component';
import { CommentComponent } from './comments//comment/comment.component';
import { PostCardComponent } from './post-card/post-card.component';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { ActionBarComponent } from './action-bar/action-bar.component';
import { CommentsComponent } from './comments/comments/comments.component';
import { commentDialogComponent } from './comments/comment-dialog/comment-dialog.component';
import { DeleteDialogComponent } from './comments/delete-dialog/delete-dialog.component';

@NgModule({
  declarations: [
    PostsFeedComponent,
    LikeComponent,
    BookmarkComponent,
    CommentComponent,
    PostCardComponent,
    PostDetailComponent,
    ActionBarComponent,
    CommentsComponent,
    commentDialogComponent,
    DeleteDialogComponent,
  ],
  //entryComponents: [commentDialogComponent],
  imports: [
    CommonModule,
    PostsFeedRoutingModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    FlexLayoutModule,
    NgxMasonryModule,
    ReactiveFormsModule,
    MatDialogModule,
  ],
  exports: [PostsFeedComponent], //export this component so it can be used in profile component
})
export class PostsFeedModule {}
