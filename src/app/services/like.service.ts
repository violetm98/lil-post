import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.dev';

@Injectable({
  providedIn: 'root',
})
export class LikeService {
  constructor(private httpClient: HttpClient) {}

  getlikesCount(postID: any) {
    let url =
      environment.LIKE.LIKE_BASE_URL +
      environment.LIKE.LIKE_COUNT +
      '/' +
      postID;
    return this.httpClient.get(url);
  }

  getlikeStatus(postID: any) {
    let headers = {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    };
    let url =
      environment.LIKE.LIKE_BASE_URL +
      environment.LIKE.LIKE_STATUS +
      '/' +
      postID;
    return this.httpClient.get(url, { headers: headers });
  }

  addLike(postID: string, data: any) {
    let url =
      environment.LIKE.LIKE_BASE_URL + environment.LIKE.ADD_LIKE + '/' + postID;
    return this.httpClient.post(url, data);
  }

  deleteLike(postID: any) {
    let headers = {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    };
    let url =
      environment.LIKE.LIKE_BASE_URL +
      environment.LIKE.DELETE_LIKE +
      '/' +
      postID;
    return this.httpClient.delete(url, { headers: headers });
  }
}
