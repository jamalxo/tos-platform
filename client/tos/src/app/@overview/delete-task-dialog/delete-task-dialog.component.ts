import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TaskService } from 'src/app/@core/service/task/task.service';

export interface DeleteTaskDialogData {
  taskId: string;
}

@Component({
  selector: 'tos-delete-task-dialog',
  templateUrl: './delete-task-dialog.component.html',
  styleUrls: ['./delete-task-dialog.component.scss'],
})
export class DeleteTaskDialogComponent implements OnInit {
  constructor(
    public taskService: TaskService,
    @Inject(MAT_DIALOG_DATA)
    public deleteSectionDialogData: DeleteTaskDialogData,
    private dialogRef: MatDialogRef<DeleteTaskDialogComponent>
  ) {}

  ngOnInit(): void {}

  deleteTask() {
    this.taskService
    .removeTask(this.deleteSectionDialogData.taskId)
    this.dialogRef.close();
  }
}