import { Component, OnInit } from '@angular/core';
import { PostService } from '../services/post.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { NgxMasonryOptions } from 'ngx-masonry';
import { PostCardComponent } from './post-card/post-card.component';

@Component({
  selector: 'app-posts-feed',
  templateUrl: './posts-feed.component.html',
  styleUrls: ['./posts-feed.component.css'],
})
export class PostsFeedComponent implements OnInit {
  dataResult: any;
  postList: any;
  likeList: any = [];
  user: any;
  userID: string | null = '';
  // parentUrlParams: string = '';
  // urlParams: string = '';

  routerURL: string = '';
  URL_list: any;
  routeConfigPath: string | undefined = '';
  showHeader: boolean = false;
  routerCase1: boolean;
  routerCase2: boolean;
  routerCase3: boolean;
  masonryOpt: NgxMasonryOptions = {
    itemSelector: '.masonry-item',
    gutter: 10,
    columnWidth: 495,
    fitWidth: true, // add fitwidth option so that item can be centered
    horizontalOrder: true,
    //resize: true,
  };

  constructor(
    private postService: PostService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.routeConfigPath = this.route.routeConfig?.path;
    console.log(this.routeConfigPath);
    this.routerURL = this.router.url;
    this.URL_list = this.routerURL.split('/');

    if (
      this.URL_list.length >= 3 &&
      this.URL_list[1] === 'u' &&
      this.URL_list[2]
    ) {
      this.userID = this.URL_list[2];
    }
    console.log(this.userID);
    this.routerCase1 =
      this.routeConfigPath === 'home' || this.routeConfigPath === '';

    this.routerCase2 = this.routeConfigPath === 'likes';
    this.routerCase3 = this.routeConfigPath === 'bookmarks';

    // this.route.url.subscribe((params) => {
    //   this.urlParams = params[0]?.path;
    //   console.log(this.urlParams);
    // });
    // this.route.parent?.url.subscribe((params) => {
    //   this.parentUrlParams = params[0]?.path;
    //   console.log(this.parentUrlParams);
    // });

    this.getCurrentUser();
    //this.userID = localStorage.getItem('uid');

    if (this.routeConfigPath === 'home') {
      console.log('active route is', this.routerURL, 'getting all the posts');
      this.getAllPosts();
    } else if (this.routeConfigPath === '' && this.userID) {
      console.log('active route is', this.routerURL, 'Get the user post');

      this.getUserPosts(this.userID);
    } else if (this.routeConfigPath === 'likes' && this.userID) {
      console.log(
        'active route is',
        this.routerURL,
        'Get the users liked post'
      );
      this.getLikedPostList(this.userID);
    } else if (this.routeConfigPath === 'bookmarks') {
      console.log(
        'active route is',
        this.routerURL,
        'Get the users bookmarked post'
      );
    }
  }

  //get all user's posts
  getAllPosts() {
    this.postService.getPosts().subscribe((data: any) => {
      this.dataResult = data;
      this.postList = this.dataResult.list;
      console.log(this.postList);
    });
  }
  //get a user's posts
  getUserPosts(userId: string | null) {
    this.userService.getUserPost(userId).subscribe((data: any) => {
      this.dataResult = data;
      this.postList = this.dataResult.user.posts;
      //console.log(this.postList);
    });
  }

  //get current user's liked posts
  getLikedPostList(id: any) {
    this.userService.getLikedPost(id).subscribe((data: any) => {
      this.dataResult = data;
      this.likeList = this.dataResult.likes;
      //console.log(this.likeList);
    });
  }
  //get current log in user
  getCurrentUser() {
    this.userService.getUser().subscribe({
      next: (res: any) => {
        this.user = res.userRes;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
