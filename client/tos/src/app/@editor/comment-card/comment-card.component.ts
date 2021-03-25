import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Comment } from '../../@core/model/comment.model';
import { DatePipe } from '@angular/common';
import { FormControl } from '@angular/forms';
import { CommentService } from '../../@core/service/comment/comment.service';
import { User } from '../../@core/model/user.model';
import { AnnotationService } from '../../@core/service/annotation/annotation.service';
import { Upvote } from '../../@core/model/upvote.model';

@Component({
  selector: 'tos-comment-card',
  templateUrl: './comment-card.component.html',
  styleUrls: ['./comment-card.component.scss'],
})
export class CommentCardComponent implements OnInit {
  @Input()
  comment: Comment;

  @Input()
  user: User;

  @Input()
  isTopicLabel: boolean;

  @Input()
  annotationId: string;

  @Output()
  reload = new EventEmitter<boolean>();

  commentForm = new FormControl('', []);

  editMode = false;

  constructor(
    public datePipe: DatePipe,
    public commentService: CommentService,
    public annotationService: AnnotationService
  ) {}

  public ngOnInit() {
    this.editMode = false;
    this.commentForm.setValue(this.comment.content);
  }

  getRandomNumber(): number {
    return Math.floor(Math.random() * 10) + 1;
  }

  formatDate(date: Date): string | null {
    return this.datePipe.transform(date, 'dd-MM-yyyy');
  }

  changeEdit(): boolean {
    this.editMode = !this.editMode;
    return this.editMode;
  }

  editComment() {
    this.editMode = false;
    console.log(this.commentForm.value);
    this.commentService
      .editComment(this.comment._id, this.commentForm.value)
      .subscribe((res) => {
        this.reload.emit(true);
      });
  }

  deleteComment() {
    this.annotationService
      .deleteComment(this.annotationId, this.comment._id, this.isTopicLabel)
      .subscribe((res) => {
        this.reload.emit(true);
      });
  }

  isUpvotedByMe(): boolean {
    let isUpvotedByMe = false;
    this.comment.upvotes.forEach((upvote) => {
      if (upvote.createdBy._id === this.user._id) {
        isUpvotedByMe = true;
      }
    });
    return isUpvotedByMe;
  }

  amountOfUpvotes(): number {
    return this.comment.upvotes ? this.comment.upvotes.length : 0;
  }

  upvoteOrUndoUpvote(): void {
    if (this.isUpvotedByMe()) {
      this.commentService
        .undoUpvote(this.comment._id, this.getMyUpvote()?._id)
        .subscribe(() => {
          this.reload.emit(true);
        });
    } else {
      this.commentService.upvote(this.comment._id).subscribe(() => {
        this.reload.emit(true);
      });
    }
  }

  getMyUpvote(): Upvote | undefined {
    return this.comment.upvotes.find(
      (upvote) => upvote.createdBy._id === this.user._id
    );
  }
}
