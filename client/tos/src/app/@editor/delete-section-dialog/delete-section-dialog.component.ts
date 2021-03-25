import { Component, Inject, OnInit } from '@angular/core';
import { DocumentService } from '../../@core/service/document/document.service';
import { Section } from '../../@core/model/section.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CreateSectionDialogData } from '../create-section-dialog/create-section-dialog.component';

export interface DeleteSectionDialogData {
  sectionId: string;
  documentId: string;
}

@Component({
  selector: 'tos-delete-section-dialog',
  templateUrl: './delete-section-dialog.component.html',
  styleUrls: ['./delete-section-dialog.component.scss'],
})
export class DeleteSectionDialogComponent implements OnInit {
  constructor(
    public documentService: DocumentService,
    @Inject(MAT_DIALOG_DATA)
    public deleteSectionDialogData: DeleteSectionDialogData,
    private dialogRef: MatDialogRef<DeleteSectionDialogComponent>
  ) {}

  ngOnInit(): void {}

  deleteSection(): void {
    this.documentService
      .deleteSection(
        this.deleteSectionDialogData.documentId,
        this.deleteSectionDialogData.sectionId
      )
      .subscribe(() => {
        this.dialogRef.close();
      });
  }
}
