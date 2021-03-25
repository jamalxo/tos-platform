import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Section } from '../../@core/model/section.model';
import { TopicLabel } from '../../@core/model/topicLabel.model';
import { LegalAssessment } from '../../@core/model/legalAssessment.model';
import { UserService } from '../../@core/service/auth/user.service';
import { User } from '../../@core/model/user.model';
import { AnnotationService } from '../../@core/service/annotation/annotation.service';
import { Upvote } from '../../@core/model/upvote.model';
import { DeleteSectionDialogComponent } from '../delete-section-dialog/delete-section-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DeleteAnnotationDialogComponent } from '../delete-annotation-dialog/delete-annotation-dialog.component';

@Component({
  selector: 'tos-annotation-card',
  templateUrl: './annotation-card.component.html',
  styleUrls: ['./annotation-card.component.scss'],
})
export class AnnotationCardComponent {
  @Input()
  section: Section;

  @Input()
  topicLabel: TopicLabel;

  @Input()
  legalAssessment: LegalAssessment;

  @Input()
  user: User;

  @Output()
  openTopic = new EventEmitter<string>();

  @Output()
  openLegal = new EventEmitter<string>();

  @Output()
  reload = new EventEmitter<boolean>();

  constructor(
    private annotationService: AnnotationService,
              public dialog: MatDialog,) {} // eslint-disable-line

  getLegality(legal: boolean): string {
    return legal ? 'Legal' : 'Illegal';
  }

  isUpvotedByMe(): boolean {
    let isUpvotedByMe = false;
    if (this.topicLabel && this.topicLabel.upvotes) {
      this.topicLabel.upvotes.forEach((upvote) => {
        if (upvote.createdBy._id === this.user._id) {
          isUpvotedByMe = true;
        }
      });
    }
    if (this.legalAssessment && this.legalAssessment.upvotes) {
      this.legalAssessment.upvotes.forEach((upvote) => {
        if (upvote.createdBy._id === this.user._id) {
          isUpvotedByMe = true;
        }
      });
    }
    return isUpvotedByMe;
  }

  amountOfComments(): number {
    if (this.topicLabel) {
      return this.topicLabel.comments.length;
    } else {
      return this.legalAssessment.comments.length;
    }
  }

  amountOfUpvotes(): number {
    if (this.topicLabel) {
      return this.topicLabel.upvotes ? this.topicLabel.upvotes.length : 0;
    } else {
      return this.legalAssessment.upvotes
        ? this.legalAssessment.upvotes.length
        : 0;
    }
  }

  openTopicView(): void {
    this.openTopic.emit(this.topicLabel._id);
  }

  openLegalView(): void {
    this.openLegal.emit(this.legalAssessment._id);
  }

  upvoteOrUndoUpvote(): void {
    if (this.isUpvotedByMe()) {
      if (this.topicLabel) {
        this.annotationService
          .undoUpvote(this.topicLabel._id, true, this.getMyUpvote()?._id)
          .subscribe(() => {
            this.reload.emit(true);
          });
      } else {
        this.annotationService
          .undoUpvote(this.legalAssessment._id, false, this.getMyUpvote()?._id)
          .subscribe(() => {
            this.reload.emit(true);
          });
      }
    } else {
      if (this.topicLabel) {
        this.annotationService
          .upvote(this.topicLabel._id, true)
          .subscribe(() => {
            this.reload.emit(true);
          });
      } else {
        this.annotationService
          .upvote(this.legalAssessment._id, false)
          .subscribe(() => {
            this.reload.emit(true);
          });
      }
    }
  }

  getMyUpvote(): Upvote | undefined {
    if (this.topicLabel) {
      return this.topicLabel.upvotes.find(
        (upvote) => upvote.createdBy._id === this.user._id
      );
    } else {
      return this.legalAssessment.upvotes.find(
        (upvote) => upvote.createdBy._id === this.user._id
      );
    }
  }

  getLegalityofSection(section: Section): string {
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

  deleteAnnotation(isTopicLabel: boolean) {
    const data = {
      sectionId: this.section._id,
      annotationId: isTopicLabel
        ? this.topicLabel._id
        : this.legalAssessment._id,
      isTopicLabel: isTopicLabel,
    };
    const dialogRef = this.dialog.open(DeleteAnnotationDialogComponent, {
      data: data,
      width: '700px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      this.reload.emit(true);
    });
  }
}
