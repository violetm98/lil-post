import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  NgZone,
} from '@angular/core';
import { Comment } from 'src/app/models/comment.model';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { commentDialogComponent } from '../comment-dialog/comment-dialog.component';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import pluralize from 'pluralize';
import { CommentService } from 'src/app/services/comment.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css'],
})
export class CommentComponent implements OnInit {
  @Input() parentComment: any | null;
  @Input() childComments: any[];
  @Input() currentUserId: string;
  @Input() postID: string;
  @Input() parentID: string;
  createdAt: string = '';
  canDelete: boolean;
  canReply: boolean;
  result: any;
  show: boolean = false;
  replyCount: string;
  // countEmitter = new BehaviorSubject<string | null>('');
  // countEmitter$: Observable<any> = this.countEmitter.asObservable();
  count: number;
  @Output() deleteComment = new EventEmitter<string>();
  @Output() addComment = new EventEmitter<{
    body: string;
    parentID: string | null;
    postID: string;
  }>();

  constructor(
    public dialog: MatDialog,
    private commentService: CommentService
  ) // private cd: ChangeDetectorRef,
  // private ngZone: NgZone
  {}

  ngOnInit(): void {
    // console.log(this.childComments);
    // console.log(this.parentComment);
    this.count = this.childComments ? this.childComments.length : 0;

    // if (this.parentComment.parentID) {
    //   this.getChildCount(this.parentComment.parentID).subscribe({
    //     next: (res: any) => {
    //       this.count = res.count;
    //       console.log(this.count);
    //     },
    //   });
    // }
    this.replyCount = pluralize('reply', this.count, true);
    // this.countEmitter.next(this.replyCount);
    // this.countEmitter$ = this.countEmitter.asObservable();

    if (this.parentComment.author._id === this.currentUserId) {
      this.canDelete = true;
    } else {
      this.canDelete = false;
    }
  }

  //when click, open reply dialog
  openReplyDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '800px';
    if (this.parentComment.parentID != null) {
      let name = this.parentComment.author.username;
      dialogConfig.data = {
        description: `Replying @${name}: `,
      };
    } else {
      dialogConfig.data = {
        description: '',
      };
    }

    const dialogRef = this.dialog.open(commentDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result) {
        //
        if (this.parentID && this.parentComment._id !== this.parentID) {
          this.addComment.emit({
            body: result.body,
            parentID: this.parentID,
            postID: this.postID,
          });
        } else {
          this.addComment.emit({
            body: result.body,
            parentID: this.parentComment._id,
            postID: this.postID,
          });
        }

        this.count++;

        // console.log(this.count);
        this.replyCount = pluralize('reply', this.count, true);
      }
    });
  }

  //when click, open delete dialog
  openDeleteDialog(commentID: string) {
    const dialogRef = this.dialog.open(DeleteDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'delete') {
        this.deleteComment.emit(commentID);
      }
    });
  }

  //when click, show or hide the reply section
  toggleReplies() {
    this.show = !this.show;
  }

  getChildCount(commentID: string) {
    return this.commentService.getReplyCount(commentID);
  }
}
