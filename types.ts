import { ObjectId } from "mongodb";

export interface Todo {
    labelId: any;
    projectId: any;
    _id: string;
    title: string;
    description?: string;
    completed: boolean;
    dueDate?: Date;
    priority?: string;
    // Add other fields as necessary
  }

export interface Project {
    _id: string;
    name: string;
    // Add other fields as necessary
}

export interface Label {
    _id: ObjectId;
    name: string;
    // Add other fields as necessary
  }