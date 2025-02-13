"use server";
import clientPromise from "@/lib/mongodb";
import { SubTodo } from "@/types"; // Import your custom types
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache"; // Import revalidatePath

function isValidObjectId(id: string): boolean {
  return ObjectId.isValid(id) && new ObjectId(id).toString() === id;
}

export async function getIncompleteSubTodos(
  parentId: string
): Promise<SubTodo[]> {
  if (!isValidObjectId(parentId)) {
    console.error(`Invalid parentId: ${parentId}`);
    return [];
  }
  const client = await clientPromise;
  const db = client.db("ai-todo");
  const subTodos = (await db
    .collection("subTodos")
    .find({ parentId: new ObjectId(parentId), completed: false })
    .toArray()) as unknown as SubTodo[];
  return subTodos.map((subTodo) => ({
    ...subTodo,
    _id: subTodo._id.toString(),
    parentId: subTodo.parentId?.toString(),
    userId: subTodo.userId?.toString(), // Convert ObjectId to string
  }));
}

export async function getCompleteSubTodos(
  parentId: string
): Promise<SubTodo[]> {
  if (!isValidObjectId(parentId)) {
    console.error(`Invalid parentId: ${parentId}`);
    return [];
  }
  const client = await clientPromise;
  const db = client.db("ai-todo");
  const subTodos = (await db
    .collection("subTodos")
    .find({ parentId: new ObjectId(parentId), completed: true })
    .toArray()) as unknown as SubTodo[];
  return subTodos.map((subTodo) => ({
    ...subTodo,
    _id: subTodo._id.toString(),
    parentId: subTodo.parentId?.toString(),
    userId: subTodo.userId?.toString(), // Convert ObjectId to string
  }));
}

export async function checkSubTodo(todoId: string): Promise<void> {
  if (!isValidObjectId(todoId)) {
    console.error(`Invalid todoId: ${todoId}`);
    throw new Error("Invalid todoId");
  }
  const client = await clientPromise;
  const db = client.db("ai-todo");
  await db
    .collection("subTodos")
    .updateOne({ _id: new ObjectId(todoId) }, { $set: { completed: true } });
  revalidatePath("/"); // Revalidate the current path to update the data
}

export async function uncheckSubTodo(todoId: string): Promise<void> {
  if (!isValidObjectId(todoId)) {
    console.error(`Invalid todoId: ${todoId}`);
    throw new Error("Invalid todoId");
  }
  const client = await clientPromise;
  const db = client.db("ai-todo");
  await db
    .collection("subTodos")
    .updateOne({ _id: new ObjectId(todoId) }, { $set: { completed: false } });
  revalidatePath("/"); // Revalidate the current path to update the data
}
