import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommentService } from 'src/app/services/comment.service';
import { PostService } from 'src/app/services/post.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css'],
})
export class PostDetailComponent implements OnInit {
  postID: any;
  loginUserID: any = localStorage.getItem('uid');
  postAuthor: any;
  imgURL: any;
  post: any = {};
  selectedIndex = 0;
  comments: any;
  timePassed: string;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private commentService: CommentService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.postID = this.route.snapshot.paramMap.get('id');

    //console.log(this.postID);
    this.getPostDetail(this.postID).subscribe({
      next: (res: any) => {
        console.log(res);

        this.post = res.result;
        this.imgURL = this.post.imgURL;
        this.postAuthor = this.post.postedBy;
        this.timePassed = this.postService.timePassed(this.post);
        console.log(this.imgURL);
      },
      error: (err) => {
        console.log(err);
      },
    });
    //this.getComment();
  }

  getPostDetail(id: string) {
    return this.postService.getPostDetail(id);
  }

  onPrevClick() {
    if (this.selectedIndex === 0) {
      this.selectedIndex = this.post.imgURL.length - 1;
    } else {
      this.selectedIndex--;
    }
  }

  onNextClick() {
    if (this.selectedIndex === this.post.imgURL.length - 1) {
      this.selectedIndex = 0;
    } else {
      this.selectedIndex++;
    }
  }
  getComment() {
    this.commentService.getComments(this.postID).subscribe({
      next: (res) => {
        console.log(res);
        this.comments = res;
        this.comments = this.comments.list;
      },
    });
  }
  back() {
    this.location.back();
  }
}
