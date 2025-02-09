"use server";
import clientPromise from "@/lib/mongodb";
import { Project, Todo } from "@/types"; // Import your custom types
import { ObjectId } from "mongodb";

export async function getProjects(userId: string): Promise<Project[]> {
  const client = await clientPromise;
  const db = client.db("ai-todo");
  const projects = await db.collection("projects").find({ userId: new ObjectId(userId) }).toArray() as unknown as Project[];
  return projects.map(project => ({
    ...project,
    _id: project._id.toString(),
    userId: project.userId?.toString(), // Convert ObjectId to string
  }));
}

export async function getProjectById(projectId: string): Promise<Project | null> {
  const client = await clientPromise;
  const db = client.db("ai-todo");
  const project = await db.collection("projects").findOne({ _id: new ObjectId(projectId) }) as Project | null;
  return project ? { ...project, _id: project._id.toString(), userId: project.userId?.toString() } : null; // Convert ObjectId to string
}

export async function addProject(name: string, userId: string): Promise<string> {
  const client = await clientPromise;
  const db = client.db("ai-todo");
  const result = await db.collection("projects").insertOne({
    name,
    userId: new ObjectId(userId),
    type: "user",
    createdAt: new Date(),
  });
  return result.insertedId.toString();
}

export async function deleteProject(projectId: string): Promise<void> {
  const client = await clientPromise;
  const db = client.db("ai-todo");
  await db.collection("projects").deleteOne({ _id: new ObjectId(projectId) });
}

export async function getIncompleteTodosByProject(projectId: string): Promise<Todo[]> {
  const client = await clientPromise;
  const db = client.db("ai-todo");
  const todos = await db.collection("todos").find({ projectId: new ObjectId(projectId), completed: false }).toArray() as unknown as Todo[];
  return todos.map(todo => ({
    ...todo,
    _id: todo._id.toString(),
    projectId: todo.projectId?.toString(),
    labelId: todo.labelId?.toString(),
    userId: todo.userId?.toString(), // Convert ObjectId to string
  }));
}