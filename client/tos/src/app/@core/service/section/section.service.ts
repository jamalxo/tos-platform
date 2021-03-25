import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Section } from '../../model/section.model';
import { ILegalAssessment } from '../../model/legalAssessment.model';
import { ITopicLabel } from '../../model/topicLabel.model';
import { Document } from '../../model/document.model';

const options = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class SectionService {
  constructor(private http: HttpClient) {}

  public allAnnotationForDocument(
    documentId: string
  ): Observable<(ILegalAssessment | ITopicLabel)[]> {
    return this.http.get<(ILegalAssessment | ITopicLabel)[]>(
      `${environment.apiUrl}/document/${documentId}/annotation/`
    );
  }

  public annotateSectionLegal(
    sectionId: string,
    legal: any
  ): Observable<Section> {
    return this.http.post<Section>(
      `${environment.apiUrl}/section/${sectionId}/annotate-legal/`,
      legal,
      options
    );
  }

  public annotateSectionTopic(
    sectionId: string,
    topic: any
  ): Observable<Section> {
    return this.http.post<Section>(
      `${environment.apiUrl}/section/${sectionId}/annotate-topic/`,
      topic,
      options
    );
  }

  public deleteAnnotation(
    sectionId: string,
    annotationId: string,
    isTopicLabel: boolean
  ): Observable<Document> {
    const annotation = isTopicLabel ? 'topicLabel' : 'legalAssessment';
    return this.http.delete<Document>(
      `${environment.apiUrl}/section/${sectionId}/${annotation}/${annotationId}/delete`,
      options
    );
  }
}
