"use server";
import clientPromise from "@/lib/mongodb";
import { Todo } from "@/types"; // Import your custom types
import { ObjectId } from "mongodb";

export async function getIncompleteSubTodos(parentId: string): Promise<Todo[]> {
  const client = await clientPromise;
  const db = client.db("ai-todo");
  const subTodos = await db.collection("subTodos").find({ parentId: new ObjectId(parentId), completed: false }).toArray() as unknown as Todo[];
  return subTodos.map(subTodo => ({
    ...subTodo,
    _id: subTodo._id.toString(),
    parentId: subTodo.parentId?.toString(),
    userId: subTodo.userId?.toString(), // Convert ObjectId to string
  }));
}

export async function getCompleteSubTodos(parentId: string): Promise<Todo[]> {
  const client = await clientPromise;
  const db = client.db("ai-todo");
  const subTodos = await db.collection("subTodos").find({ parentId: new ObjectId(parentId), completed: true }).toArray() as unknown as Todo[];
  return subTodos.map(subTodo => ({
    ...subTodo,
    _id: subTodo._id.toString(),
    parentId: subTodo.parentId?.toString(),
    userId: subTodo.userId?.toString(), // Convert ObjectId to string
  }));
}

export async function checkSubTodo(todoId: string): Promise<void> {
  const client = await clientPromise;
  const db = client.db("ai-todo");
  await db.collection("subTodos").updateOne({ _id: new ObjectId(todoId) }, { $set: { completed: true } });
}

export async function uncheckSubTodo(todoId: string): Promise<void> {
  const client = await clientPromise;
  const db = client.db("ai-todo");
  await db.collection("subTodos").updateOne({ _id: new ObjectId(todoId) }, { $set: { completed: false } });
}