import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommentService } from 'src/app/services/comment.service';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';
import { PostsFeedComponent } from '../posts-feed.component';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.css'],
})
export class PostCardComponent implements OnInit {
  @Input() post: any; //for 'home' route and 'profile' route
  @Input() likepost: any; // for 'profile/likes' route
  @Input() bookmarkpost: any; // for 'profile/bookmarks' route
  @Input() user: any;
  @Input() userID: any;
  @Input() routerURL: any;

  //@Input() updateLayout: boolean = false;
  show: boolean = false;
  showIndex: number = 0;
  selectedIndex = 0;
  postID: any;
  //currentUserId: string | null = localStorage.getItem('uid');
  comments: any;
  update: boolean;
  timePassed: string;
  routerCase1: boolean;
  routerCase2: boolean;

  constructor(
    private router: Router,
    private commentService: CommentService,
    private userService: UserService,
    private postService: PostService
  ) {}

  ngOnInit(): void {
    // this.getComment();
    this.routerCase1 =
      this.routerURL === '/home' || this.routerURL === `/u/${this.userID}`;
    this.routerCase2 = this.routerURL === `/u/${this.userID}/likes`;
    this.getPostIDnTimeStamp();
  }

  getPostIDnTimeStamp() {
    if (this.routerCase1) {
      this.postID = this.post._id;
      this.timePassed = this.postService.timePassed(this.post);
    } else if (this.routerCase2) {
      this.postID = this.likepost.postID._id;
      this.timePassed = this.postService.timePassed(this.likepost);
    }
  }

  toggleHideAndShow() {
    this.show = !this.show;
  }
  toggleLikeButton() {
    console.log(this.post.likes);
  }

  getComment() {
    this.commentService.getComments(this.post._id).subscribe({
      next: (res) => {
        console.log(res);
        this.comments = res;
        this.comments = this.comments.list;
      },
    });
  }
}
