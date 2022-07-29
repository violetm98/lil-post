import { Component, OnInit, Input } from '@angular/core';
import { LikeService } from 'src/app/services/like.service';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-like-button',
  templateUrl: './like.component.html',
  styleUrls: ['./like.component.css'],
})
export class LikeComponent implements OnInit {
  @Input() post: any | null;
  @Input() likepost: any | null;
  @Input() user: any | null;
  @Input() likesCount: any | null;
  @Input() likeStatus: any;
  iconName: string = 'favorite_border';
  userId: string | null = localStorage.getItem('uid');
  isLiked: boolean;
  likedpost: any;
  postID: any;

  constructor(
    private postService: PostService,
    private likeService: LikeService
  ) {}

  ngOnInit(): void {
    // this.setLikeIcon();
    // console.log(this.post);
    // this.postID = this.likepost.postID._id;
    // console.log(this.postID);
    // console.log(this.likeStatus);
  }

  setLikeIcon() {
    if (this.likeStatus == true) {
      this.iconName = 'favorite';
    } else {
      this.iconName = 'favorite_border';
    }
  }

  toggleLikeState() {
    if (this.likeStatus == true) {
      this.likeStatus = false;
      this.likesCount--;
      this.iconName = 'favorite_border';
      this.deleteLike();
    } else {
      this.likeStatus = true;
      this.likesCount++;
      this.iconName = 'favorite';
      this.addLike();
    }
  }

  //update the database
  addLike() {
    this.likeService.addLike(this.postID, { userID: this.userId }).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  //update the database
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
}
