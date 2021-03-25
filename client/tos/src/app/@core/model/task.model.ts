export interface NewTask {
  assigneeId: string;
  assignedById: string;
  description?: string;
  documentId?: string;
  sectionId?: string;
  taskType: TaskType;
}

export interface Task {
  _id: string;

  assignedById: string;
  assigneeId: {
    firstName: string;
    _id: string;
  };
  documentId: {
    title: string;
    _id: string;
  };
  description?: string;
  task_id: string;
  sectionId?: string;
  taskType: TaskType;
  taskStatus: TaskStatus;
}

export enum TaskStatus {
  Open,
  InProgress,
  Review,
  Done,
}

export enum TaskType {
  Review,
  Annotate,
}
