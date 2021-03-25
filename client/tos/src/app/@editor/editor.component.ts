import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentService } from '../@core/service/document/document.service';
import { Document } from '../@core/model/document.model';
import { MatDialog } from '@angular/material/dialog';
import { CreateSectionDialogComponent } from './create-section-dialog/create-section-dialog.component';
import { Section } from '../@core/model/section.model';
import { BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CreateAnnotationDialogComponent } from './create-annotation-dialog/create-annotation-dialog.component';
import { LegalAssessment } from '../@core/model/legalAssessment.model';
import { TopicLabel } from '../@core/model/topicLabel.model';
import { DeleteSectionDialogComponent } from './delete-section-dialog/delete-section-dialog.component';
import { DocumentStatus } from '../@core/model/DocumentStatus';
import { AnnotationService } from '../@core/service/annotation/annotation.service';
import { FormControl } from '@angular/forms';
import { UserService } from '../@core/service/auth/user.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import {
  TaskDialogComponent,
  TaskDialogContext,
} from './task-dialog/task-dialog.component';
import { TaskService } from '../@core/service/task/task.service';
import { Task } from '../@core/model/task.model';

@Component({
  selector: 'tos-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorComponent implements OnDestroy {
  documentid = this.activatedRoute.snapshot.params.documentid;
  currentlySelectedSection: string;
  currentlySelectedAnnotation: string | undefined;
  isCurrentlySelectedAnnotationTopicLabel: boolean;
  context = {
    message: '',
  };

  init = {
    _id: '',
    content: '',
    sections: [] as Section[],
    title: '',
  };

  // for comments
  comment = new FormControl('', []);

  // to update the view dynamically
  refreshToken$ = new BehaviorSubject<Document>(<Document>this.init);
  document$ = this.refreshToken$.pipe(
    switchMap(() => this.documentService.getDocument(this.documentid))
  );
  store: Document;

  allTaskForDocument$ = new BehaviorSubject<Task[]>([]);
  showTaskList = false;
  showSectionList = false;

  user$ = this.userService.getUser();

  public DocumentStatus = DocumentStatus;

  constructor(
    private activatedRoute: ActivatedRoute,
    private documentService: DocumentService,
    public dialog: MatDialog,
    public taskService: TaskService,
    private annotationService: AnnotationService,
    public userService: UserService,
    private _snackBar: MatSnackBar
  ) {
    this.documentService.getDocument(this.documentid).subscribe((res) => {
      this.store = res;
    });
    this.taskService
      .getAllTaskForDocument(this.documentid)
      .subscribe((allTask) => {
        this.allTaskForDocument$.next(allTask);
      });
  }

  reloadData(): void {
    console.log('reloading');
    this.refreshToken$.next(this.store);
    this.taskService
      .getAllTaskForDocument(this.documentid)
      .subscribe((allTask) => {
        this.allTaskForDocument$.next(allTask);
        this.taskService.fetchAllTask();
      });
  }

  ngOnDestroy() {
    this.refreshToken$.unsubscribe();
  }

  get getShowTaskList() {
    return this.showTaskList;
  }

  get getShowSectionList() {
    return this.showSectionList;
  }

  openModal(): void {
    if (window.getSelection().toString().length > 0) {
      const content = window.getSelection().toString();
      const selection = window.getSelection();
      let start = selection.anchorOffset;
      let end = selection.focusOffset;
      if (start >= 0 && end >= 0) {
        console.log('start: ' + start);
        console.log('end: ' + end);
      }

      // if you start the marking on the other end
      if (end < start) {
        [start, end] = [end, start];
      }

      if (content.length !== end - start) {
        this._snackBar.open('Invalid Section!', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
        return;
      }

      const data = {
        section: {
          from: start,
          to: end,
          content: content,
        },
        documentid: this.documentid,
      };
      const dialogRef = this.dialog.open(CreateSectionDialogComponent, {
        data: data,
        width: '700px',
      });

      dialogRef.afterClosed().subscribe((result) => {
        console.log(`Dialog result: ${result}`);
        this.reloadData();
      });
    }
  }

  openModalWithSection(
    section: Section,
    isLast = false,
    document: Document
  ): void {
    if (window.getSelection().toString().length > 0) {
      const content = window.getSelection().toString();
      const selection = window.getSelection();
      let start = !isLast
        ? selection.anchorOffset + section.to
        : selection.anchorOffset + section.to - 1;
      let end = !isLast
        ? selection.focusOffset + section.to
        : selection.focusOffset + section.to - 1;
      if (start >= 0 && end >= 0) {
        console.log('start: ' + start);
        console.log('end: ' + end);
      }

      // if you start the marking on the other end
      if (end < start) {
        [start, end] = [end, start];
      }

      if (content.length !== end - start) {
        this._snackBar.open('Invalid Section!', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
        return;
      }
      const data = {
        section: {
          from: start,
          to: end,
          content: content,
        },
        documentid: this.documentid,
      };
      const dialogRef = this.dialog.open(CreateSectionDialogComponent, {
        data: data,
        width: '700px',
      });

      dialogRef.afterClosed().subscribe((result) => {
        console.log(`Dialog result: ${result}`);
        this.reloadData();
      });
    }
  }

  getContent(from: number, to: number, document: Document): string {
    return document.content.slice(from, to);
  }

  getCollaborator(document: Document): string[] {
    let allCollaborators = document.sections.map((section) => {
      return `${section.createdBy.firstName} ${section.createdBy.lastName}`;
    });
    allCollaborators = allCollaborators.filter((v, i, a) => a.indexOf(v) === i);
    return allCollaborators;
  }

  getDifferentBackground(i: number): string {
    return `section-text-${i % 9}`;
  }

  getDifferentTitle(i: number): string {
    return `section-title-${i % 9}`;
  }

  openSectionById(sectionId: string | undefined) {
    if (sectionId !== undefined) {
      this.currentlySelectedAnnotation = undefined;
      this.currentlySelectedSection = sectionId;
    }
  }

  openSection(section: Section) {
    this.currentlySelectedAnnotation = undefined;
    this.currentlySelectedSection = section._id;
  }

  openAnnotation(annotationId: string, isTopicLabel: boolean) {
    this.currentlySelectedAnnotation = annotationId;
    this.isCurrentlySelectedAnnotationTopicLabel = isTopicLabel;
  }

  canCreate(from: number, to: number, content: string): boolean {
    return to - from === content.length;
  }

  openAnnotationDialog(document: Document): void {
    const data = {
      section: this.getSection(document, this.currentlySelectedSection),
      documentid: this.documentid,
    };
    const dialogRef = this.dialog.open(CreateAnnotationDialogComponent, {
      data: data,
      width: '700px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      console.log(this.store);
      this.reloadData();
    });
  }

  getSection(document: Document, sectionId: string): Section | undefined {
    return document.sections.find((section) => section._id === sectionId);
  }

  getAnnotation(
    document: Document,
    annotationId: string
  ): LegalAssessment | TopicLabel | undefined {
    if (this.isCurrentlySelectedAnnotationTopicLabel) {
      return this.getSection(
        document,
        this.currentlySelectedSection
      )?.topicLabels.find((topicLabel) => topicLabel._id === annotationId);
    } else {
      return this.getSection(
        document,
        this.currentlySelectedSection
      )?.legalAssessments.find(
        (legalAssessment) => legalAssessment._id === annotationId
      );
    }
  }

  getAnnotationLabelOrLegal(
    document: Document,
    annotationId: string
  ): string | undefined {
    if (this.isCurrentlySelectedAnnotationTopicLabel) {
      return this.getSection(
        document,
        this.currentlySelectedSection
      )?.topicLabels.find((topicLabel) => topicLabel._id === annotationId)
        ?.label;
    } else {
      return this.getSection(
        document,
        this.currentlySelectedSection
      )?.legalAssessments.find(
        (legalAssessment) => legalAssessment._id === annotationId
      )?.legal
        ? 'Legal'
        : 'Illegal';
    }
  }

  closeAnnotation(): void {
    this.currentlySelectedAnnotation = undefined;
  }

  getSectionIndex(
    currentlySelectedSection: string,
    document: Document
  ): number {
    return (
      document.sections.findIndex(
        (section) => section._id === currentlySelectedSection
      ) + 1
    );
  }

  openCreateTask(document: Document, currentlySelectedSectionId: string) {
    const data = {
      document: document,
      currentlySelectedSectionId: currentlySelectedSectionId,
      context: TaskDialogContext.Create,
    };
    this.openTaskDialog(data);
  }

  private openTaskDialog(data: {
    document: Document;
    context: TaskDialogContext;
    currentlySelectedSectionId: string;
  }) {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      data: data,
      width: '700px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      console.log(this.store);
      this.reloadData();
    });
  }

  openDeleteSectionDialog(documentId: string, sectionId: string): void {
    const data = {
      sectionId: sectionId,
      documentId: documentId,
    };
    const dialogRef = this.dialog.open(DeleteSectionDialogComponent, {
      data: data,
      width: '700px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      console.log(this.store);
      this.reloadData();
    });
  }

  createComment() {
    if (this.currentlySelectedAnnotation != null) {
      this.annotationService
        .createComment(
          this.currentlySelectedAnnotation,
          this.comment.value,
          this.isCurrentlySelectedAnnotationTopicLabel
        )
        .subscribe((res) => {
          this.comment.reset();
          console.log(res);
          this.reloadData();
        });
    }
  }

  changeStatus(status: string, document: Document): void {
    this.documentService
      .changeStatus(document._id, { status })
      .subscribe((res) => {
        this.reloadData();
      });
  }

  hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  }

  intToRGB(i: number): string {
    const c = (i & 0x00ffffff).toString(16).toUpperCase();
    return '#' + '00000'.substring(0, 6 - c.length) + c + '75';
  }

  openAnnotationTopic(value: string) {
    this.currentlySelectedAnnotation = value;
    this.isCurrentlySelectedAnnotationTopicLabel = true;
  }

  openAnnotationLegal(value: string) {
    this.currentlySelectedAnnotation = value;
    this.isCurrentlySelectedAnnotationTopicLabel = false;
  }

  getLegalityOfSection(section: Section): string {
    if (!section.legalAssessments) {
      return 'grey';
    }
    if (section.legalAssessments.length === 0) {
      return 'grey';
    }
    const legals: boolean[] = [];
    section.legalAssessments.forEach((legal) => {
      legals.push(legal.legal);
    });
    if (legals.includes(true) && legals.includes(false)) {
      return 'orange';
    }
    if (!legals.includes(true)) {
      return 'red';
    }
    if (!legals.includes(false)) {
      return 'green';
    }
    return 'grey';
  }

  openUpdateTask(
    document: Document,
    currentlySelectedSectionId: string,
    task: Task
  ) {
    const data = {
      document: document,
      currentlySelectedSectionId: currentlySelectedSectionId,
      context: TaskDialogContext.Update,
      task: task,
    };
    this.openTaskDialog(data);
  }

  toggleShowTaskList() {
    this.showTaskList = !this.showTaskList;
  }

  toggleShowSectionList() {
    this.showSectionList = !this.showSectionList;
  }
}
