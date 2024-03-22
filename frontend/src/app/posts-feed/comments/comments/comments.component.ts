import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { CommentService } from 'src/app/services/comment.service';
import { UserService } from 'src/app/services/user.service';
import { Comment } from 'src/app/models/comment.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css'],
})
export class CommentsComponent implements OnInit {
  @Input() postID: string;
  @Input() currentUserId: string;
  avatar: any;
  data: any;
  comments: any[] = [];
  parentComments: Comment[] = [];
  commentForm: FormGroup;
  replyCount: number;

  constructor(
    private commentService: CommentService,
    private userService: UserService,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef
  ) {
    this.commentForm = this.fb.group({
      body: ['', [Validators.required, Validators.maxLength(200)]],
    });
  }

  ngOnInit(): void {
    this.getCurrentUser().subscribe({
      next: (res: any) => {
        console.log(res);
        this.data = res.userRes;
        this.avatar = this.data.profileImgURL;
      },
    });
    this.getComments(this.postID).subscribe({
      next: (res) => {
        this.data = res;
        this.comments = this.data.list;

        console.log(this.comments);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getCurrentUser() {
    return this.userService.getUser();
  }
  getComments(postID: string) {
    return this.commentService.getComments(postID);
  }

  addComment({
    body,
    parentID,
    postID,
  }: {
    body: string;
    parentID: string | null;
    postID: string;
  }) {
    this.commentService.addComment(body, parentID, postID).subscribe({
      next: (res) => {
        this.data = res;
        this.data = this.data.commentDetail;
        this.comments = [...this.comments, this.data];

        this.commentForm.reset();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getParentComments() {
    return this.comments.filter((comment) => comment.parentID === null);
  }

  getChildComments(parentID: string) {
    //console.log('getting child comments');
    return this.comments.filter((comment) => comment.parentID === parentID);
  }

  deleteComment(commentID: string) {
    this.commentService.deleteComment(commentID).subscribe({
      next: () => {
        this.comments = this.comments.filter(
          (comment) => comment._id !== commentID
        );

        console.log('after deleting comment', this.comments);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
