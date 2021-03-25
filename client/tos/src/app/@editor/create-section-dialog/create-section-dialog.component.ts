import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Section } from '../../@core/model/section.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DocumentService } from '../../@core/service/document/document.service';
import { MatStepper } from '@angular/material/stepper';
import { UserService } from '../../@core/service/auth/user.service';
import { User } from '../../@core/model/user.model';

export interface CreateSectionDialogData {
  section: Section;
  documentid: string;
}

@Component({
  selector: 'tos-create-section-dialog',
  templateUrl: './create-section-dialog.component.html',
  styleUrls: ['./create-section-dialog.component.scss'],
})
export class CreateSectionDialogComponent {
  sectionForm = new FormGroup({
    topic: new FormControl('', Validators.required),
    legal: new FormControl('', Validators.required),
  });
  isTopicLabel: boolean;
  @ViewChild('stepper') private myStepper: MatStepper;

  user$ = this.userService.getUser();

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public createSectionDialogData: CreateSectionDialogData,
    public documentService: DocumentService,
    private dialogRef: MatDialogRef<CreateSectionDialogComponent>,
    private userService: UserService
  ) {}

  get f() {
    return this.sectionForm.controls;
  }

  next() {
    this.myStepper.next();
  }

  chooseAnnotation(isTopicLabel: boolean) {
    this.isTopicLabel = isTopicLabel;
    this.myStepper.next();
  }

  createSection(): void {
    if (this.isTopicLabel) {
      this.documentService
        .createSection(this.createSectionDialogData.documentid, {
          from: this.createSectionDialogData.section.from,
          to: this.createSectionDialogData.section.to,
          label: this.f.topic.value,
        })
        .subscribe(() => {
          this.dialogRef.close();
        });
    } else {
      this.documentService
        .createSection(this.createSectionDialogData.documentid, {
          from: this.createSectionDialogData.section.from,
          to: this.createSectionDialogData.section.to,
          legal: this.f.legal.value,
        })
        .subscribe(() => {
          this.dialogRef.close();
        });
    }
  }

  close() {
    this.dialogRef.close();
  }

  hasNoError() {
    return (
      !this.f.topic.hasError('required') || !this.f.legal.hasError('required')
    );
  }

  getUserName(user: User): string {
    return `${user.firstName} ${user.lastName}`;
  }
}
