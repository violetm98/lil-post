import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  avatar: string;
  user: any;
  username: string | null;
  loginUserID$: Observable<string | null>;
  loginUserID: any;
  loginStatus$: Observable<boolean>;
  username$: Observable<string | null>;
  profileImg$: Observable<string | null>;

  // private user = new BehaviorSubject();
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,

    private userService: UserService
  ) {}

  ngOnInit() {
    this.loginStatus$ = this.userService.isLoggedin;
    this.username$ = this.userService.currentUsername;
    this.profileImg$ = this.userService.currentProfileImg;
    this.loginUserID$ = this.userService.currentUserID;
    this.userService.currentUsername.subscribe({
      next: (res: any) => {
        console.log(res);
        this.username = res;
      },
    });

    this.loginUserID$.subscribe({
      next: (res: any) => {
        this.loginUserID = res;
      },
    });
  }

  // getUser() {
  //   console.log('getting user');
  //   return this.userService.getUser().subscribe({
  //     next: (res: any) => {
  //       //console.log(res);

  //       this.user = res.userRes;
  //       this.username = res.username;
  //     },
  //   });
  // }

  logoutUser() {
    this.userService.logoutUser();
  }
}
