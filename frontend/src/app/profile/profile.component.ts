import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  links = ['./', 'likes'];
  bookmarkLink = 'bookmarks';
  titles = ['Posts', 'Likes'];
  activeLink = this.links[0];
  selectedIndex: number = 0;
  urlParams: any;
  URL: string;
  loginUser: any;
  user: any | null;
  userId: string;

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.userId = params['id'];

      this.setActivelink();
      this.getUserInfo(this.userId).subscribe({
        next: (data: any) => {
          this.user = data.user;
          //console.log(this.user);
        },
        error: (err) => {
          console.log(err);
        },
      });
    });

    this.route.url.subscribe((params) => {
      this.urlParams = params[0]?.path;
      //console.log(this.urlParams);
      this.setActivelink();
    });

    this.getLoginUser().subscribe({
      next: (res: any) => {
        this.loginUser = res.userRes;
        console.log(this.loginUser);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  /* Get requested user info */
  getUserInfo(userID: string) {
    return this.userService.getUserInfo(userID);
  }

  /* When refresh page, make sure the active tab would be the last chosen tab */
  setActivelink() {
    const isProfileActive = this.router.url === `/u/${this.userId}`;
    const isLikeActive = this.router.url === `/u/${this.userId}/likes`;
    const isBookmarkActive = this.router.url === `/u/${this.userId}/bookmarks`;
    if (isProfileActive) {
      this.activeLink = this.links[0];
    } else if (isLikeActive) {
      this.activeLink = this.links[1];
    } else if (isBookmarkActive) {
      this.activeLink = this.bookmarkLink;
    }
  }

  //get current log in user
  getLoginUser() {
    return this.userService.getUser();
  }
}
