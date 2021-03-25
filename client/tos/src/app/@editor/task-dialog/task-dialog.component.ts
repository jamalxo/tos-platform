import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../@core/service/auth/user.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Document } from '../../@core/model/document.model';
import {
  NewTask,
  Task,
  TaskStatus,
  TaskType,
} from '../../@core/model/task.model';
import { TaskService } from '../../@core/service/task/task.service';

export enum TaskDialogContext {
  Create,
  Update,
}

export interface TaskDialogData {
  sectionId: string;
  document: Document;
  context: TaskDialogContext;
  task?: Task;
}

@Component({
  selector: 'tos-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.scss'],
})
export class TaskDialogComponent {
  taskForm = new FormGroup({
    assignee: new FormControl(
      this.taskDialogData.task?.assigneeId,
      Validators.required
    ),
    section: new FormControl(this.taskDialogData.task?.sectionId),
    taskStatus: new FormControl(
      this.taskDialogData.task?.taskStatus,
      Validators.required
    ),
    taskType: new FormControl(
      this.taskDialogData.task?.taskType,
      Validators.required
    ),
    description: new FormControl(this.taskDialogData.task?.description),
  });

  user$ = this.userService.getUser();
  allUser$ = this.userService.getAllUser();
  allTaskType = TaskType;
  taskTypeEnumKeys: string[] = [];
  allTaskStatus = TaskStatus;
  taskStatusEnumKeys: string[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public taskDialogData: TaskDialogData,
    private dialogRef: MatDialogRef<TaskDialogComponent>,
    public userService: UserService,
    public taskService: TaskService
  ) {
    this.taskTypeEnumKeys = Object.keys(this.allTaskType).filter((f) =>
      isNaN(Number(f))
    );
    this.taskStatusEnumKeys = Object.keys(this.allTaskStatus).filter((f) =>
      isNaN(Number(f))
    );
  }

  get f() {
    return this.taskForm.controls;
  }

  close() {
    this.dialogRef.close();
  }

  persist() {
    this.userService.getUser().subscribe((userMe) => {
      if (this.hasNoError()) {
        if (this.taskDialogData.context === TaskDialogContext.Create) {
          const newTask: NewTask = {
            assignedById: userMe._id,
            assigneeId: this.f.assignee.value,
            description: this.f.description.value,
            documentId: this.taskDialogData.document._id,
            sectionId: this.f.section.value,
            taskType: this.f.taskType.value,
          };
          this.taskService
            .create(newTask)
            .subscribe((task) => this.dialogRef.close());
        } else if (this.taskDialogData.context === TaskDialogContext.Update) {
          if (this.taskDialogData.task !== undefined) {
            console.log(this.taskDialogData.task);

            this.taskDialogData.task.description = this.f.description.value;
            this.taskDialogData.task.assigneeId = this.f.assignee.value;
            this.taskDialogData.task.taskStatus = this.f.taskStatus.value;

            this.taskService
              .update(this.taskDialogData.task)
              .subscribe((task) => this.dialogRef.close());
          }
        } else {
          // abort
          this.dialogRef.close();
        }
      }
    });
  }

  get context(): string {
    return this.taskDialogData.context === TaskDialogContext.Create
      ? 'Create'
      : this.taskDialogData.context === TaskDialogContext.Update
      ? 'Update'
      : '';
  }

  get cardTitle(): string {
    return `${
      this.context === 'Create'
        ? 'Create '
        : this.context === 'Update'
        ? 'Edit '
        : ''
    }Task`;
  }

  intToRGB(i: number): string {
    const c = (i & 0x00ffffff).toString(16).toUpperCase();
    return '#' + '00000'.substring(0, 6 - c.length) + c + '75';
  }

  hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  }

  hasNoError() {
    return this.taskDialogData.context === TaskDialogContext.Create
      ? !this.f.assignee.hasError('required') ||
          !this.f.taskType.hasError('required')
      : this.taskDialogData.context === TaskDialogContext.Update
      ? !this.f.taskStatus.hasError('required')
      : false;
  }
}
