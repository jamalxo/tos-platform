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
export class AnnotationService {
  constructor(private http: HttpClient) {}

  public createComment(
    topicLabelId: string,
    content: any,
    isTopicLabel: boolean
  ): Observable<Comment> {
    const annotation = isTopicLabel ? 'topicLabel' : 'legalAssessment';
    return this.http.post<Comment>(
      `${environment.apiUrl}/${annotation}/${topicLabelId}/comment/`,
      { content },
      options
    );
  }

  public upvote(
    annotationId: string,
    isTopicLabel: boolean
  ): Observable<Comment> {
    const annotation = isTopicLabel ? 'topicLabel' : 'legalAssessment';
    return this.http.post<any>(
      `${environment.apiUrl}/${annotation}/${annotationId}/upvote/`,
      {},
      options
    );
  }

  public undoUpvote(
    annotationId: string,
    isTopicLabel: boolean,
    upvoteId: string | undefined
  ): Observable<Comment> {
    const annotation = isTopicLabel ? 'topicLabel' : 'legalAssessment';
    return this.http.delete<any>(
      `${environment.apiUrl}/${annotation}/${annotationId}/upvote/${upvoteId}/delete`,
      options
    );
  }

  public deleteComment(
    annotationId: string,
    commentId: string,
    isTopicLabel: boolean
  ): Observable<Comment> {
    const annotation = isTopicLabel ? 'topicLabel' : 'legalAssessment';
    return this.http.delete<any>(
      `${environment.apiUrl}/${annotation}/${annotationId}/comment/${commentId}/delete`,
      options
    );
  }
}
