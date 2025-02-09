"use server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const defaultProject = {
  name: "Get Started",
  type: "system",
  createdAt: new Date(),
};

const defaultLabels = [
  { name: "Personal", type: "system", createdAt: new Date() },
  { name: "Work", type: "system", createdAt: new Date() },
  { name: "Travel", type: "system", createdAt: new Date() },
  { name: "Health", type: "system", createdAt: new Date() },
  { name: "Gym", type: "system", createdAt: new Date() },
];

export async function initializeDefaults(userId: string): Promise<void> {
  const client = await clientPromise;
  const db = client.db("ai-todo");

  // Check if default project already exists
  const existingProject = await db.collection("projects").findOne({ name: defaultProject.name, userId: new ObjectId(userId) });
  if (!existingProject) {
    await db.collection("projects").insertOne({
      ...defaultProject,
      userId: new ObjectId(userId),
    });
  }

  // Check if default labels already exist
  for (const label of defaultLabels) {
    const existingLabel = await db.collection("labels").findOne({ name: label.name, userId: new ObjectId(userId) });
    if (!existingLabel) {
      await db.collection("labels").insertOne({
        ...label,
        userId: new ObjectId(userId),
      });
    }
  }
}
