import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Section } from '../../@core/model/section.model';
import { LegalAssessment } from '../../@core/model/legalAssessment.model';
import { TopicLabel } from '../../@core/model/topicLabel.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SectionService } from '../../@core/service/section/section.service';
import { UserService } from '../../@core/service/auth/user.service';
import { User } from '../../@core/model/user.model';

export interface CreateAnnotationDialogData {
  section: Section;
  documentid: string;
  legal: LegalAssessment;
  topic: TopicLabel;
}

@Component({
  selector: 'tos-create-annotation-dialog',
  templateUrl: './create-annotation-dialog.component.html',
  styleUrls: ['./create-annotation-dialog.component.scss'],
})
export class CreateAnnotationDialogComponent {
  sectionForm = new FormGroup({
    topic: new FormControl('', Validators.required),
    legal: new FormControl('', Validators.required),
  });
  isTopicLabel: boolean;
  @ViewChild('stepper') private myStepper: MatStepper;

  user$ = this.userService.getUser();

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public createAnnotationDialogData: CreateAnnotationDialogData,
    public sectionService: SectionService,
    private dialogRef: MatDialogRef<CreateAnnotationDialogComponent>,
    public userService: UserService
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

  createAnnotation(): void {
    if (this.isTopicLabel) {
      this.sectionService
        .annotateSectionTopic(this.createAnnotationDialogData.section._id, {
          topic: this.f.topic.value,
        })
        .subscribe(() => {
          this.dialogRef.close();
        });
    } else {
      this.sectionService
        .annotateSectionLegal(this.createAnnotationDialogData.section._id, {
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
