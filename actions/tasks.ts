"use server";
import clientPromise from "@/lib/mongodb"; // Your existing MongoDB connection file
import { ObjectId } from "mongodb";
import { Project, Todo } from "@/types"; // Import your custom types

export async function getLabels() {
  const client = await clientPromise;
  const db = client.db("ai-todo");
  return await db.collection("labels").find().toArray();
}

export async function createTask({
  taskName,
  description,
  priority,
  dueDate,
  projectId,
  labelId,
  userId,
}: any) {
  const client = await clientPromise;
  const db = client.db("ai-todo");

  const result = await db.collection("todos").insertOne({
    taskName,
    description,
    priority: parseInt(priority),
    dueDate,
    projectId: new ObjectId(projectId),
    labelId: new ObjectId(labelId),
    userId: new ObjectId(userId),
    createdAt: new Date(),
    isCompleted: false,
  });

  return JSON.parse(JSON.stringify(result)); // Convert to plain object
}

export async function getLabelById(labelId: string) {
  const client = await clientPromise;
  const db = client.db("ai-todo");
  const label = await db
    .collection("labels")
    .findOne({ _id: new ObjectId(labelId) });
  if (label) {
    label.id = label._id.toString();
  }
  return label;
}

export async function getCompleteSubTodos(parentId: string) {
  const client = await clientPromise;
  const db = client.db("ai-todo");
  const subTodos = await db
    .collection("subTodos")
    .find({ parentId, isCompleted: true })
    .toArray();
  return subTodos.map((subTodo) => {
    subTodo.id = subTodo._id.toString();
    subTodo.parentId = subTodo.parentId.toString();
    return subTodo;
  });
}
