import { Component, OnInit, ViewChild } from '@angular/core';
import { TaskService } from '../@core/service/task/task.service';
import { MatTableDataSource } from '@angular/material/table';
import { User } from '../@core/model/user.model';
import { MatSort } from '@angular/material/sort';
import { Task } from '../@core/model/task.model';
import { UserService } from '../@core/service/auth/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'tos-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss', '../@shared/css/list.scss'],
})
export class TaskComponent implements OnInit {
  displayedColumns: string[] = [
    'type',
    'task_id',
    'document',
    'taskStatus',
    'assignee',
    'open',
  ];

  dataSource: MatTableDataSource<Task>;
  currentUser: User;
  private currentFilterLabel = 'all';

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private taskService: TaskService,
    private userService: UserService,
    private router: Router
  ) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.dataSource = new MatTableDataSource([]);
  }

  filter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  resetFilter() {
    this.dataSource.filterPredicate = TaskComponent.taskFilter(
      this.currentFilterLabel,
      this.currentUser._id
    );
    this.filter('');
    this.dataSource.filterPredicate = TaskComponent.taskFilter(
      this.currentFilterLabel,
      this.currentUser._id
    );
    this.currentFilterLabel = 'all';
  }

  filterByAssignedToMe() {
    this.dataSource.filterPredicate = TaskComponent.assignedToMeFilter();
    this.filter(this.currentUser._id);
    this.dataSource.filterPredicate = TaskComponent.taskFilter(
      this.currentFilterLabel,
      this.currentUser._id
    );
    this.currentFilterLabel = 'assignedToMe';
  }

  filterByAssignedByMe() {
    this.dataSource.filterPredicate = TaskComponent.assignedByMeFilter();
    this.filter(this.currentUser._id);
    this.dataSource.filterPredicate = TaskComponent.taskFilter(
      this.currentFilterLabel,
      this.currentUser._id
    );
    this.currentFilterLabel = 'assignedByMe';
  }

  filterButtonStyle(filterLabel: string): string {
    return this.currentFilterLabel === filterLabel
      ? 'active-list-filter-button'
      : '';
  }

  openDocument(element: Task) {
    this.router.navigate([`editor/${element.documentId._id}`]);
  }

  private static taskFilter(currentFilterLabel: string, userId: string) {
    return (data: Task, filter: string) => {
      return currentFilterLabel === 'assignedToMe'
        ? `T${data.task_id}`.toLowerCase().includes(filter) &&
            TaskComponent.assignedToMe(data, filter)
        : currentFilterLabel === 'assignedByMe'
        ? `T${data.task_id}`.toLowerCase().includes(filter) &&
          TaskComponent.assignedByMe(data, filter)
        : `T${data.task_id}`.toLowerCase().includes(filter);
    };
  }

  private static assignedToMe(data: Task, filter: string) {
    return data.assigneeId._id.toLowerCase() === filter;
  }

  private static assignedByMe(data: Task, filter: string) {
    return data.assignedById === filter;
  }

  private static assignedToMeFilter() {
    return (data: Task, filter: string) => {
      return TaskComponent.assignedToMe(data, filter);
    };
  }

  private static assignedByMeFilter() {
    return (data: Task, filter: string) => {
      return TaskComponent.assignedByMe(data, filter);
    };
  }

  ngOnInit(): void {
    this.refreshData();

    this.userService.getUser().subscribe((user) => {
      this.currentUser = user;
      this.dataSource.filterPredicate = TaskComponent.taskFilter(
        this.currentFilterLabel,
        this.currentUser._id
      );
    });
  }

  public refreshData() {
    this.taskService.allTask$.subscribe((allTask) => {
      this.dataSource.data = allTask;
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  deleteTask(task: Task) {
    this.taskService.removeTask(task._id);
  }
}
