import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Document } from '../../model/document.model';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

const options = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  constructor(private http: HttpClient) {}

  public upload(document: any): Observable<Document> {
    return this.http.post<Document>(
      `${environment.apiUrl}/document/upload`,
      document,
      options
    );
  }

  public getDocument(documentId: string): Observable<Document> {
    return this.http.get<Document>(
      `${environment.apiUrl}/document/${documentId}`,
      options
    );
  }

  public deleteDocument(documentId: string): Observable<any> {
    return this.http.delete(
      `${environment.apiUrl}/document/${documentId}`,
      options
    );
  }

  public getAllDocument(): Observable<Document[]> {
    return this.http.get<Document[]>(
      `${environment.apiUrl}/document/`,
      options
    );
  }

  public createSection(documentId: string, section: any): Observable<Document> {
    return this.http.post<Document>(
      `${environment.apiUrl}/document/${documentId}/section/create`,
      section,
      options
    );
  }

  public deleteSection(
    documentId: string,
    sectionId: string
  ): Observable<Document> {
    return this.http.delete<Document>(
      `${environment.apiUrl}/document/${documentId}/section/${sectionId}/delete`,
      options
    );
  }

  public changeStatus(documentId: string, status: any): Observable<Document> {
    return this.http.post<Document>(
      `${environment.apiUrl}/document/${documentId}/change-status`,
      status,
      options
    );
  }

  public uploadFile(file: any) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(
      `${environment.apiUrl}/document/fromfile`,
      formData
    );
  }
}
