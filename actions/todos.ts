"use server";
import clientPromise from "@/lib/mongodb";
import { Todo } from "@/types"; // Import your custom types
import { ObjectId } from "mongodb";
import moment from "moment";
import { revalidatePath } from "next/cache"; // Import revalidatePath

export async function getTodos(): Promise<Todo[]> {
  const client = await clientPromise;
  const db = client.db("ai-todo");
  const todos = (await db
    .collection("todos")
    .find()
    .toArray()) as unknown as Todo[];
  return todos.map((todo) => ({
    ...todo,
    _id: todo._id.toString(),
    projectId: todo.projectId?.toString(),
    labelId: todo.labelId?.toString(),
    userId: todo.userId?.toString(), // Convert ObjectId to string
  }));
}

export async function getTodayTodos(): Promise<Todo[]> {
  const client = await clientPromise;
  const db = client.db("ai-todo");
  const startOfDay = moment().startOf("day").toDate();
  const endOfDay = moment().endOf("day").toDate();
  const todos = (await db
    .collection("todos")
    .find({ dueDate: { $gte: startOfDay, $lte: endOfDay } })
    .toArray()) as unknown as Todo[];
  return todos.map((todo) => ({
    ...todo,
    _id: todo._id.toString(),
    projectId: todo.projectId?.toString(),
    labelId: todo.labelId?.toString(),
    userId: todo.userId?.toString(), // Convert ObjectId to string
  }));
}

export async function getOverdueTodos(): Promise<Todo[]> {
  const client = await clientPromise;
  const db = client.db("ai-todo");
  const now = new Date();
  const todos = (await db
    .collection("todos")
    .find({ dueDate: { $lt: now }, isCompleted: false })
    .toArray()) as unknown as Todo[];
  return todos.map((todo) => ({
    ...todo,
    _id: todo._id.toString(),
    projectId: todo.projectId?.toString(),
    labelId: todo.labelId?.toString(),
    userId: todo.userId?.toString(), // Convert ObjectId to string
  }));
}

export async function getCompletedTodos(): Promise<Todo[]> {
  const client = await clientPromise;
  const db = client.db("ai-todo");
  const todos = (await db
    .collection("todos")
    .find({ isCompleted: true })
    .toArray()) as unknown as Todo[];
  return todos.map((todo) => ({
    ...todo,
    _id: todo._id.toString(),
    projectId: todo.projectId?.toString(),
    labelId: todo.labelId?.toString(),
    userId: todo.userId?.toString(), // Convert ObjectId to string
  }));
}

export async function getIncompleteTodos(): Promise<Todo[]> {
  const client = await clientPromise;
  const db = client.db("ai-todo");
  const todos = (await db
    .collection("todos")
    .find({ isCompleted: false })
    .toArray()) as unknown as Todo[];
  return todos.map((todo) => ({
    ...todo,
    _id: todo._id.toString(),
    projectId: todo.projectId?.toString(),
    labelId: todo.labelId?.toString(),
    userId: todo.userId?.toString(), // Convert ObjectId to string
  }));
}

export async function getTotalTodos(): Promise<number> {
  const client = await clientPromise;
  const db = client.db("ai-todo");
  return await db.collection("todos").countDocuments();
}

export async function checkTodo(todoId: string): Promise<void> {
  const client = await clientPromise;
  const db = client.db("ai-todo");
  await db
    .collection("todos")
    .updateOne({ _id: new ObjectId(todoId) }, { $set: { isCompleted: true } });
  revalidatePath("/"); // Revalidate the current path to update the data
}

export async function uncheckTodo(todoId: string): Promise<void> {
  const client = await clientPromise;
  const db = client.db("ai-todo");
  await db
    .collection("todos")
    .updateOne({ _id: new ObjectId(todoId) }, { $set: { isCompleted: false } });
  revalidatePath("/"); // Revalidate the current path to update the data
}

export async function deleteTodo(todoId: string): Promise<void> {
  const client = await clientPromise;
  const db = client.db("ai-todo");
  await db.collection("todos").deleteOne({ _id: new ObjectId(todoId) });
  revalidatePath("/"); // Revalidate the current path to update the data
}
