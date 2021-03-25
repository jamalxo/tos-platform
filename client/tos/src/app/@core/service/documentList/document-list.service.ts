import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Document, IDocumentMeta } from '../../model/document.model';
import { HttpClient } from '@angular/common/http';
import { DocumentService } from '../document/document.service';
import { SectionService } from '../section/section.service';
import { map, mergeMap } from 'rxjs/operators';
import { ILegalAssessment } from '../../model/legalAssessment.model';
import { ITopicLabel } from '../../model/topicLabel.model';
import { DocumentStatus } from '../../model/DocumentStatus';
import { TaskService } from '../task/task.service';

@Injectable({
  providedIn: 'root',
})
export class DocumentListService {
  constructor(
    private http: HttpClient,
    private documentService: DocumentService,
    private sectionService: SectionService,
    private taskService: TaskService
  ) {
    this.fetchAllDocumentMeta();
  }

  private _allDocumentMeta$: BehaviorSubject<
    IDocumentMeta[]
  > = new BehaviorSubject<IDocumentMeta[]>([]);

  get allDocumentMeta$(): BehaviorSubject<IDocumentMeta[]> {
    return this._allDocumentMeta$;
  }

  public fetchAllDocumentMeta(): void {
    this.documentService
      .getAllDocument()
      .pipe(
        mergeMap((allDocument: Document[]) => {
          return allDocument.map((document: Document) =>
            this.sectionService.allAnnotationForDocument(document._id).pipe(
              map((allAnnotation: (ILegalAssessment | ITopicLabel)[]) => {
                const documentMeta: IDocumentMeta = {
                  _id: document._id,
                  title: document.title,
                  content: document.content,
                  sections: document.sections,
                  status: document.status || DocumentStatus.Open,
                  annotations: allAnnotation,
                  uploadedBy: document.uploadedBy,
                  createdAt: document.createdAt,
                };
                return documentMeta;
              })
            )
          );
        })
      )
      .subscribe((documentMetaObservable) =>
        documentMetaObservable.subscribe((documentMeta) => {
          const currentAllDocumentMeta = this._allDocumentMeta$.value;
          this._allDocumentMeta$.next([
            ...currentAllDocumentMeta,
            documentMeta,
          ]);
        })
      );
  }

  public removeDocument(documentId: string) {
    this.documentService.deleteDocument(documentId).subscribe((result) => {
      const allDocumentMeta = this._allDocumentMeta$.value;
      this._allDocumentMeta$.next(
        allDocumentMeta.filter((elem) => elem._id !== documentId)
      );
      this.taskService.fetchAllTask();
    });
  }
}
