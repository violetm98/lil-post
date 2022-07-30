import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.dev';
import { User } from '../models/user.model';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  selectedUser: User = {
    _id: '',
    username: '',
    email: '',
    password: '',
    profileImgURL: '',
  };
  result: any;
  userId: any;

  private username = new BehaviorSubject<string | null>(
    localStorage.getItem('username')
  );
  private loginStatus = new BehaviorSubject<boolean>(this.checkLoginStatus());
  private profileImg = new BehaviorSubject<string | null>(
    localStorage.getItem('profileImg')
  );
  private loginUserID = new BehaviorSubject<string | null>(
    localStorage.getItem('uid')
  );

  constructor(private httpClient: HttpClient, private router: Router) {}

  /* Sign up the user */
  signupUser(data: any): Observable<any> {
    let url = environment.USER.USER_BASE_URL + environment.USER.SIGN_UP_USER;

    return this.httpClient.post(url, data);
  }
  /* Log in the user */
  loginUser(data: any): Observable<any> {
    let url = environment.USER.USER_BASE_URL + environment.USER.LOG_IN_USER;

    return this.httpClient.post(url, data, { withCredentials: true }).pipe(
      map((res: any) => {
        if (res) {
          this.result = res;
          // this.token = this.result.token;
          this.userId = this.result.userId;
          // this.profileImgUrl = this.result.profileImgURL;

          this.loginStatus.next(true);
          localStorage.setItem('token', this.result.token);
          localStorage.setItem('profileImg', this.result.profileImgURL);
          localStorage.setItem('uid', this.userId);
          localStorage.setItem('username', this.result.username);

          this.username.next(localStorage.getItem('username'));
          this.profileImg.next(localStorage.getItem('profileImg'));
          this.loginUserID.next(localStorage.getItem('uid'));
        }
      })
    );
  }

  //get a user's posts
  getUserPost(userId: string | null) {
    let url =
      environment.USER.USER_BASE_URL +
      environment.USER.GET_USER_POST +
      '/' +
      userId;

    return this.httpClient.get(url);
  }
  /* GET user's liked posts*/
  getLikedPost(userId: string | null) {
    let url = environment.LIKE.LIKE_BASE_URL + userId;
    return this.httpClient.get(url);
  }

  // getBookmarkedPost(id: string) {
  //   let url =
  //     environment.USER.USER_BASE_URL +
  //     environment.USER.GET_BOOKMARKED_POST +
  //     '/' +
  //     id;
  //   return this.httpClient.get(url);
  // }

  /* GET the current log in user */
  getUser() {
    let url = environment.USER.USER_BASE_URL + environment.USER.GET_USER;
    return this.httpClient.get(url);
  }
  getUserInfo(userID: string) {
    let url =
      environment.USER.USER_BASE_URL + environment.USER.GET_USER + '/' + userID;
    return this.httpClient.get(url);
  }
  /* update the user */
  updateUser(userId: any, data: any) {
    let url =
      environment.USER.USER_BASE_URL +
      environment.USER.UPDATE_USER +
      '/' +
      userId;
    return this.httpClient.put(url, data);
  }
  /* log out the user */
  logoutUser() {
    let url = environment.USER.USER_BASE_URL + environment.USER.LOGOUT_USER;

    this.httpClient.post(url, {}, { withCredentials: true }).subscribe({
      next: () => {
        localStorage.clear();
        // localStorage.removeItem('token');
        // localStorage.removeItem('uid');
        //localStorage.removeItem('username');
        //localStorage.removeItem('profileImg');

        this.username.next('');
        this.profileImg.next('');
        this.loginUserID.next('');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  get isLoggedin() {
    return this.loginStatus.asObservable();
  }
  get currentUsername() {
    return this.username.asObservable();
  }
  get currentProfileImg() {
    return this.profileImg.asObservable();
  }
  get currentUserID() {
    return this.loginUserID.asObservable();
  }
  get accessToken() {
    return localStorage.getItem('token');
  }
  checkLoginStatus() {
    //console.log(!!localStorage.getItem('token'));
    if (
      localStorage.getItem('token') &&
      localStorage.getItem('token') != 'undefined'
    ) {
      return true;
    } else {
      return false;
    }
  }
}
