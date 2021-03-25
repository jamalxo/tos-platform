import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { NewTask, Task } from '../../model/task.model';
import { environment } from '../../../../environments/environment';
import {element} from "protractor";
const taskApi = `${environment.apiUrl}/task/`;

const options = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private http: HttpClient) {
    this.fetchAllTask();
  }

  private _allTask$: BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>([]);

  get allTask$(): BehaviorSubject<Task[]> {
    return this._allTask$;
  }

  public fetchAllTask(): void {
    this.getAllTask().subscribe((allTask: Task[]) => {
      this._allTask$.next(allTask);
    });
  }

  public removeTask(taskId: string): void {
    this.deleteTask(taskId).subscribe((result) => {
      const currentAllTask = this._allTask$.value;
      this._allTask$.next(currentAllTask.filter((elem) => elem._id !== taskId));
    });
  }

  public create(task: NewTask): Observable<Task> {
    return this.http.post<Task>(`${taskApi}`, task, options);
  }

  private getTask(taskId: string): Observable<Task> {
    return this.http.get<Task>(`${taskApi}${taskId}`, options);
  }

  private deleteTask(taskId: string): Observable<any> {
    return this.http.delete(`${taskApi}${taskId}`, options);
  }

  private getAllTask(): Observable<Task[]> {
    return this.http.get<Task[]>(`${taskApi}/`, options);
  }

  public getAllTaskForAssignee(assigneeId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${taskApi}/assignee/${assigneeId}`, options);
  }

  public getAllTaskForDocument(documentId: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${taskApi}/document/${documentId}`, options);
  }

  update(task: any): Observable<Task> {
    return this.http.put<Task>(`${taskApi}/${task._id}`, task, options);
  }
}
