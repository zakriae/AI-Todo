"use server";
import clientPromise from "@/lib/mongodb";
import { Label } from "@/types"; // Import your custom types
import { ObjectId } from "mongodb";

export async function getLabels(userId: string): Promise<Label[]> {
  const client = await clientPromise;
  const db = client.db("ai-todo");
  const labels = await db.collection("labels").find({ userId: new ObjectId(userId) }).toArray() as unknown as Label[];
  return labels.map(label => ({
    ...label,
    _id: label._id.toString(),
    userId: label.userId?.toString(), // Convert ObjectId to string
  }));
}

export async function addLabel(name: string, userId: string): Promise<string> {
  const client = await clientPromise;
  const db = client.db("ai-todo");
  const result = await db.collection("labels").insertOne({
    name,
    userId: new ObjectId(userId),
    type: "user",
    createdAt: new Date(),
  });
  return result.insertedId.toString();
}

export async function getLabelById(labelId: string): Promise<Label | null> {
  const client = await clientPromise;
  const db = client.db("ai-todo");
  const label = await db.collection("labels").findOne({ _id: new ObjectId(labelId) }) as Label | null;
  return label ? { ...label, _id: label._id.toString(), userId: label.userId?.toString() } : null; // Convert ObjectId to string
}

export async function deleteLabel(labelId: string): Promise<void> {
  const client = await clientPromise;
  const db = client.db("ai-todo");
  await db.collection("labels").deleteOne({ _id: new ObjectId(labelId) });
}