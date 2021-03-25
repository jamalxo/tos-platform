import { Component, OnInit, ViewChild } from '@angular/core';
import { DocumentListService } from '../@core/service/documentList/document-list.service';
import { UserService } from '../@core/service/auth/user.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IDocumentMeta } from '../@core/model/document.model';
import { User } from '../@core/model/user.model';
import { ILegalAssessment } from '../@core/model/legalAssessment.model';
import { ITopicLabel } from '../@core/model/topicLabel.model';
import { NavigationEnd, Router } from '@angular/router';
import { DocumentService } from '../@core/service/document/document.service';

@Component({
  selector: 'tos-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss', '../@shared/css/list.scss'],
})
export class DocumentListComponent implements OnInit {
  displayedColumns: string[] = [
    'title',
    'status',
    'annotations',
    'uploader',
    'open',
  ];
  dataSource: MatTableDataSource<IDocumentMeta>;
  currentUser: User;
  private currentFilterLabel = 'all';

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private documentListService: DocumentListService,
    private userService: UserService,
    private router: Router,
    private documentService: DocumentService
  ) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.dataSource = new MatTableDataSource([]);
    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        this.refreshData();
      }
    });
  }

  filter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  resetFilter() {
    this.currentFilterLabel = 'all';
    this.dataSource.filterPredicate = DocumentListComponent.titleFilter(
      this.currentFilterLabel,
      this.currentUser._id
    );
    this.filter('');
  }

  filterByUploadedByMe() {
    this.dataSource.filterPredicate = DocumentListComponent.uploaderFilter();
    this.filter(this.currentUser._id);
    this.currentFilterLabel = 'uploadedByMe';
    this.dataSource.filterPredicate = DocumentListComponent.titleFilter(
      this.currentFilterLabel,
      this.currentUser._id
    );
  }

  filterByAnnotatedByMe() {
    this.dataSource.filterPredicate = DocumentListComponent.annotatorFilter();
    this.filter(this.currentUser._id);
    this.currentFilterLabel = 'annotatedByMe';
    this.dataSource.filterPredicate = DocumentListComponent.titleFilter(
      this.currentFilterLabel,
      this.currentUser._id
    );
  }

  filterButtonStyle(filterLabel: string): string {
    return this.currentFilterLabel === filterLabel
      ? 'active-list-filter-button'
      : '';
  }

  uploadReroute() {
    this.router.navigate(['upload']);
  }

  private static titleFilter(currentFilterLabel: string, userId: string) {
    return (data: IDocumentMeta, filter: string) => {
      return currentFilterLabel === 'annotatedByMe'
        ? data.title.toLowerCase().includes(filter) &&
            DocumentListComponent.annotatedBy(data, userId)
        : currentFilterLabel === 'uploadedByMe'
        ? data.title.toLowerCase().includes(filter) &&
          DocumentListComponent.uploadedBy(data, userId)
        : data.title.toLowerCase().includes(filter);
    };
  }

  private static uploaderFilter() {
    return (data: IDocumentMeta, filter: string) => {
      return this.uploadedBy(data, filter);
    };
  }

  private static uploadedBy(data: IDocumentMeta, filter: string) {
    return data.uploadedBy._id === filter;
  }

  private static annotatorFilter() {
    return (data: IDocumentMeta, filter: string) => {
      return this.annotatedBy(data, filter);
    };
  }

  private static annotatedBy(data: IDocumentMeta, filter: string) {
    return data.annotations.some(
      (annotation: ILegalAssessment | ITopicLabel) => {
        return annotation.createdBy === filter;
      }
    );
  }

  openDocument(element: IDocumentMeta) {
    this.router.navigate([`editor/${element._id}`]);
  }

  ngOnInit(): void {
    this.refreshData();
    this.userService.getUser().subscribe((user) => {
      this.currentUser = user;
    });
    // We have to override the filterPredicate for the datasource to allow only filtering
    // for name (title).
    this.dataSource.filterPredicate = DocumentListComponent.titleFilter(
      this.currentFilterLabel,
      this.currentUser._id
    );
  }

  public refreshData() {
    this.documentListService.allDocumentMeta$.subscribe((allDocumentMeta) => {
      this.dataSource.data = allDocumentMeta;
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  deleteDocument(documentmeta: IDocumentMeta) {
    this.documentListService.removeDocument(documentmeta._id);
  }
}
