import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Comment } from '../../model/comment.model';

const options = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  constructor(private http: HttpClient) {}

  public editComment(commentId: string, content: string): Observable<Comment> {
    return this.http.post<Comment>(
      `${environment.apiUrl}/comment/${commentId}/edit/`,
      { content },
      options
    );
  }

  public upvote(commentId: string): Observable<Comment> {
    return this.http.post<any>(
      `${environment.apiUrl}/comment/${commentId}/upvote/`,
      {},
      options
    );
  }

  public undoUpvote(
    commentId: string,
    upvoteId: string | undefined
  ): Observable<Comment> {
    return this.http.delete<any>(
      `${environment.apiUrl}/comment/${commentId}/upvote/${upvoteId}/delete`,
      options
    );
  }
}
