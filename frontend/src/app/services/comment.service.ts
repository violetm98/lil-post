import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Comment } from '../models/comment.model';
import { backendURL } from '../../config';
@Injectable({
  providedIn: 'root',
})
export class CommentService {
  constructor(private httpClient: HttpClient) {}

  //get comments for a post
  getComments(postID: string) {
    return this.httpClient.get(`${backendURL}/comment/${postID}`);
  }

  getReplyCount(commentID: string) {
    return this.httpClient.get(`${backendURL}/comment/reply/${commentID}`);
  }
  addComment(
    body: string,
    parentID: string | null,
    postID: string
  ): Observable<Comment> {
    let headers = {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    };
    return this.httpClient.post<Comment>(
      `${backendURL}/comment/add/${postID}`,
      {
        body: body,
        parentID,
        post: postID,
      },
      { headers: headers }
    );
  }

  deleteComment(commentId: string): Observable<Comment> {
    return this.httpClient.delete<Comment>(
      `${backendURL}/comment/delete/${commentId}`
    );
  }
}
