import { ObjectId } from "mongodb";

export interface Todo {
  labelId: any;
  projectId: any;
  _id: string;
  taskName: string;
  description?: string;
  isCompleted: boolean;
  dueDate?: Date;
  priority?: string;
  userId: ObjectId | string; // Add userId field
  // Add other fields as necessary
}

export interface Project {
  _id: string;
  name: string;
  type: string;
  createdAt: Date;
  userId?: string; // Add the userId property
}

export interface Label {
  _id: ObjectId | string;
  userId: ObjectId | string;
  name: string;
  type: string;
  createdAt: Date;
}

export interface SubTodo extends Todo {
  parentId: ObjectId | string;
}
