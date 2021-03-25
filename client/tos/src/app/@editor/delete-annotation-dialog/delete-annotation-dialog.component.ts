import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SectionService } from '../../@core/service/section/section.service';

export interface DeleteAnnotationDialogData {
  sectionId: string;
  annotationId: string;
  isTopicLabel: boolean;
}

@Component({
  selector: 'tos-delete-annotation-dialog',
  templateUrl: './delete-annotation-dialog.component.html',
  styleUrls: ['./delete-annotation-dialog.component.scss'],
})
export class DeleteAnnotationDialogComponent {
  constructor(
    public sectionService: SectionService,
    @Inject(MAT_DIALOG_DATA)
    public deleteSectionDialogData: DeleteAnnotationDialogData,
    private dialogRef: MatDialogRef<DeleteAnnotationDialogComponent>
  ) {}

  deleteAnnotation(): void {
    this.sectionService
      .deleteAnnotation(
        this.deleteSectionDialogData.sectionId,
        this.deleteSectionDialogData.annotationId,
        this.deleteSectionDialogData.isTopicLabel
      )
      .subscribe(() => {
        this.dialogRef.close();
      });
  }
}
