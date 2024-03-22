import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.dev';
import { Post } from '../models/post.model';
import { format } from 'timeago.js';
import { upload_url } from 'src/config';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(private httpClient: HttpClient) {}

  // Methods to communicate with backend
  getPosts() {
    let url = environment.POST.POST_BASE_URL + environment.POST.GET_ALL_POSTS;
    return this.httpClient.get(url);
  }

  viewPost(id: string) {
    let url =
      environment.POST.POST_BASE_URL + environment.POST.GET_A_POST + '/' + id;
    return this.httpClient.get(url);
  }

  addNewPost(data: Post) {
    let url = environment.POST.POST_BASE_URL + environment.POST.ADD_NEW_POST;
    let token = localStorage.getItem('token');
    //console.log(token)
    let headers = new HttpHeaders();
    headers = headers.set('content-type', 'application/json');
    headers = headers.set('Authorization', 'Bearer ' + token);
    //console.log(headers)
    const httpOptions = {
      headers: headers,
    };

    return this.httpClient.post(url, data, httpOptions);
  }

  uploadImg(file: any) {
    var data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'small-post');
    data.append('cloud_name', 'dqdolxarl');

    return this.httpClient.post(upload_url, data);
  }

  getPostDetail(id: string) {
    let url =
      environment.POST.POST_BASE_URL + environment.POST.GET_A_POST + '/' + id;
    return this.httpClient.get(url);
  }
  updatePost(id: any, data: any) {
    let url =
      environment.POST.POST_BASE_URL + environment.POST.UPDATE_POST + '/' + id;
    return this.httpClient.put(url, data);
  }

  deletePost(id: string) {}

  searchPost(keyWord: string) {}

  timePassed(post: any) {
    const now = new Date(Date.now());
    const updateTime = new Date(post.updatedAt);
    const difftime = now.getTime() - updateTime.getTime();
    let timePassed = '';
    // console.log(difftime);
    const ONEDAY = 24 * 60 * 60 * 1000;
    if (difftime >= ONEDAY) {
      timePassed = updateTime.toLocaleDateString();
    } else {
      timePassed = format(post.updatedAt, 'en_US');
    }
    return timePassed;
  }
}
