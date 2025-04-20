"use server";
import clientPromise from "@/lib/mongodb";
import { Project, Todo } from "@/types";
import { ObjectId } from "mongodb";

export async function getProjects(userId: string): Promise<Project[]> {
  if (!userId) {
    console.error("getProjects called without userId");
    return []; // Return empty array instead of throwing
  }
  
  try {
    const client = await clientPromise;
    const db = client.db("ai-todo");
    
    // Build query to fetch both user-specific AND system projects
    const query = {
      $or: [
        { userId: new ObjectId(userId) }, 
        { system: true }         // Projects marked as system
      ]
    };
    
    // Fetch projects with proper query
    const projects = await db.collection("projects")
      .find(query)
      .sort({ createdAt: -1 }) // Sort by creation date
      .toArray() as unknown as Project[];
    
    // Convert ObjectId to string
    return projects.map(project => ({
      ...project,
      _id: project._id.toString(),
      userId: project.userId?.toString(),
    }));
  } catch (error) {
    console.error("Error fetching projects:", error);
    return []; // Return empty array on error rather than crashing
  }
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