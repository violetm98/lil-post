import { Component, Input, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { CommentService } from 'src/app/services/comment.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { commentDialogComponent } from '../comments/comment-dialog/comment-dialog.component';
import { LikeService } from 'src/app/services/like.service';

@Component({
  selector: 'app-action-bar',
  templateUrl: './action-bar.component.html',
  styleUrls: ['./action-bar.component.css'],
})
export class ActionBarComponent implements OnInit {
  @Input() postID: any;
  //@Input() activeRoute: any;

  userID: any = localStorage.getItem('uid');
  likeCount: any;
  isLiked: boolean;
  bookmarkCount: any;
  isBookmarked: boolean = false;
  likeIcon: string = 'favorite_border';
  bookmarkIcon: string = 'bookmark_border';
  count: any;
  show: boolean = false;

  constructor(
    private likeService: LikeService,
    private commentService: CommentService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.getlikeCount().subscribe({
      next: (res) => {
        this.likeCount = res;
        this.likeCount = this.likeCount.likesCount;
        console.log(this.likeCount);
      },
      error: (err) => {
        console.log(err);
      },
    });
    this.getlikeStatus().subscribe({
      next: (res: any) => {
        this.count = res.likesCount;
        if (this.count == 0) {
          this.isLiked = false;
          this.likeIcon = 'favorite_border';
        } else if (this.count == 1) {
          this.isLiked = true;
          this.likeIcon = 'favorite';
        }
      },
      error: (err) => {
        console.log(err);
      },
    });

    console.log(this.postID);
  }

  toggleLikeState() {
    if (this.isLiked == false) {
      this.isLiked = true;
      this.likeIcon = 'favorite';
      this.likeCount++;
      this.addLike();
    } else if (this.isLiked == true) {
      this.isLiked = false;
      this.likeIcon = 'favorite_border';
      this.likeCount--;
      this.deleteLike();
    }
  }

  toggleBookmarkState() {
    if (this.isBookmarked == false) {
      this.isBookmarked = true;
      this.bookmarkIcon = 'bookmark';
    } else {
      this.isBookmarked = false;
      this.bookmarkIcon = 'bookmark_outlined';
    }
  }
  getlikeStatus() {
    return this.likeService.getlikeStatus(this.postID);
  }

  getlikeCount() {
    return this.likeService.getlikesCount(this.postID);
  }

  addLike() {
    this.likeService.addLike(this.postID, { userID: this.userID }).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  deleteLike() {
    this.likeService.deleteLike(this.postID).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  onClick() {}

  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '800px';
    dialogConfig.data = {
      description: '',
    };

    const dialogRef = this.dialog.open(commentDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        let body = result.body;
        this.saveComment(body, null).subscribe({
          next: (res) => {
            console.log(res);
          },
          error: (err) => {
            console.log(err);
          },
        });
      }
    });
  }

  saveComment(body: string, parentID: string | null) {
    return this.commentService.addComment(body, parentID, this.postID);
  }
}
