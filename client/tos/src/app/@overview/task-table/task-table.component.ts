import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { Task } from 'src/app/@core/model/task.model';
import { Document } from 'src/app/@core/model/document.model';
import { User } from 'src/app/@core/model/user.model';
import { TaskService } from 'src/app/@core/service/task/task.service';
import { UserService } from 'src/app/@core/service/auth/user.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteTaskDialogComponent } from '../delete-task-dialog/delete-task-dialog.component';
import { DocumentService } from 'src/app/@core/service/document/document.service';
import { TaskDialogComponent, TaskDialogContext } from 'src/app/@editor/task-dialog/task-dialog.component';

@Component({
  selector: 'task-table',
  templateUrl: './task-table.component.html',
  styleUrls: ['./task-table.component.scss'],
})
export class TaskTableComponent {
  displayedColumns: string[] = [
    'task_id',
    'type',
    'document',
    'taskStatus',
    'actions',
  ];

  dataSource: MatTableDataSource<Task>;
  currentUser: User;
  documentList: Document[];

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private taskService: TaskService,
    private userService: UserService,
    private router: Router,
    public dialog: MatDialog,
    private documentService: DocumentService,
  ) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.dataSource = new MatTableDataSource([]);
    this.documentService.getAllDocument().subscribe((res) => {
      this.documentList = res;
    })
  }

  getDocument(documentId: string) {
    return this.documentList.find((elem) => elem._id == documentId);
  }

  openDocument(element: Task) {
    this.router.navigate([`editor/${element.documentId}`]);
  }

  openUpdateTask(
    documentId: string,
    currentlySelectedSectionId: string,
    task: Task
  ) {

    const task_mapped = {
      _id: task._id,
      task_id: task.task_id,
      assignedById: task.assignedById,
      assigneeId: task.assigneeId._id,
      documentId: task.documentId._id,
      description: task.description,
      sectionId: task.sectionId,
      taskStatus: task.taskStatus,
      taskType: task.taskType,
    }

    const data = {
      document: this.getDocument(documentId),
      currentlySelectedSectionId: currentlySelectedSectionId,
      context: TaskDialogContext.Update,
      task: task_mapped,
    };
    this.openTaskDialog(data);
  }

  private openTaskDialog(data: {
    document: Document;
    context: TaskDialogContext;
    currentlySelectedSectionId: string;
  }) {
    this.dialog.open(TaskDialogComponent, {
      data: data,
      width: '700px',
    });
  }

  filterByAssignedToMe() {
    if (this.currentUser._id) {
      this.dataSource.filterPredicate = TaskTableComponent.assignedToMeFilter();
      this.dataSource.filter = this.currentUser._id.trim().toLowerCase();
      this.dataSource.filterPredicate = TaskTableComponent.taskFilter(this.currentUser._id);
    }
  }

  private static assignedToMeFilter() {
    return (data: Task, filter: string) => {
      return TaskTableComponent.assignedToMe(data, filter);
    };
  }

  private static assignedToMe(data: Task, filter: string) {
    return data.assigneeId._id.toLowerCase() === filter;
  }

  private static taskFilter(userId: string) {
    return (data: Task, filter: string) => {
      return (
        `T${data.task_id}`.toLowerCase().includes(filter) &&
        TaskTableComponent.assignedToMe(data, filter)
      );
    };
  }

  openDeleteTaskDialog(task: Task): void {
    const data = {
      taskId: task._id,
    };
    const dialogRef = this.dialog.open(DeleteTaskDialogComponent, {
      data: data,
      width: '700px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.filterByAssignedToMe();
    });
  }

  ngOnInit(): void {
    this.userService.getUser().subscribe((user) => {
      this.currentUser = user;
      this.taskService.allTask$.subscribe((allTask) => {
        this.dataSource.data = allTask;
        console.log("I fetched Tasks");
        this.filterByAssignedToMe();
      });
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
}
