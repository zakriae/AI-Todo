"use server";
import clientPromise from "@/lib/mongodb";
import { Todo } from "@/types"; // Import your custom types
import { ObjectId } from "mongodb";
import moment from "moment";
import { revalidatePath } from "next/cache"; // Import revalidatePath

export async function getTodos(userId: string): Promise<Todo[]> {
  if (!userId) {
    console.error("getTodos called without userId");
    return []; // Return empty array instead of throwing error
  }

  try {
    const client = await clientPromise;
    const db = client.db("ai-todo");

    // Add proper userId filter to ensure data isolation
    const todos = await db.collection("todos")
      .find({ userId: new ObjectId(userId) })
      .toArray() as unknown as Todo[];

    // Keep existing transformation code
    return todos.map((todo) => ({
      ...todo,
      _id: todo._id.toString(),
      projectId: todo.projectId?.toString(),
      labelId: todo.labelId?.toString(),
      userId: todo.userId?.toString(),
      parentId: todo.parentId?.toString(),
    }));
  } catch (error) {
    console.error("Error fetching todos:", error);
    return []; // Handle errors gracefully
  }
}

export async function updateTodo({todoId,isCompleted} :{todoId: string, isCompleted: boolean} ): Promise<void> {
  try {
    const client = await clientPromise;
    const db = client.db("ai-todo");
    
    await db.collection("todos").updateOne(
      { _id: new ObjectId(todoId) },
      { 
        $set: { 
          isCompleted,
          updatedAt: new Date()
        } 
      }
    );

    revalidatePath("/"); // Revalidate the current path to update the data
  } catch (error) {
    console.error("Failed to update todo:", error);
    throw error;
  }
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

// to delete if not needed
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
// to delete if not needed
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

// to delete if not needed
export async function getTotalTodos(): Promise<number> {
  const client = await clientPromise;
  const db = client.db("ai-todo");
  return await db.collection("todos").countDocuments();
}
// to delete if not needed
export async function checkTodo(todoId: string): Promise<void> {
  const client = await clientPromise;
  const db = client.db("ai-todo");
  await db
    .collection("todos")
    .updateOne({ _id: new ObjectId(todoId) }, { $set: { isCompleted: true } });
  revalidatePath("/"); // Revalidate the current path to update the data
}
// to delete if not needed
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
