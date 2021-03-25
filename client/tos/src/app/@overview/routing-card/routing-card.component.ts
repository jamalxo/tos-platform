import { ArrayDataSource, DataSource } from '@angular/cdk/collections';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IDocumentMeta } from 'src/app/@core/model/document.model';
import { User } from 'src/app/@core/model/user.model';
import { UserService } from 'src/app/@core/service/auth/user.service';
import { DocumentListService } from 'src/app/@core/service/documentList/document-list.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'routing-card',
  templateUrl: './routing-card.component.html',
  styleUrls: ['./routing-card.component.scss'],
})
export class RoutingCardComponent implements OnInit {
  
  dataSource: Array<IDocumentMeta>;
  currentUser: User;

  constructor(
    private documentListService: DocumentListService,
    private userService: UserService,
    private router: Router,
    public datePipe: DatePipe,
  ) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.dataSource = new Array<IDocumentMeta>([]);
  }

  ngOnInit(): void {
    this.userService.getUser().subscribe((user) => {
      this.currentUser = user;
      this.documentListService.allDocumentMeta$.subscribe((allDocumentMeta) => {
        console.log("I fetched Docs");
        this.dataSource = allDocumentMeta.filter(elem => elem.uploadedBy._id == this.currentUser._id);
      });
    });
  }

  openDocument(element: IDocumentMeta) {
    this.router.navigate([`editor/${element._id}`]);
  }

  formatDate(date: Date): string | null {
    return this.datePipe.transform(date, 'dd-MM-yyyy');
  }
}
