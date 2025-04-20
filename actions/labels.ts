"use server";
import clientPromise from "@/lib/mongodb";
import { Label } from "@/types"; // Import your custom types
import { ObjectId } from "mongodb";

export async function getLabels(userId: string): Promise<Label[]> {
  if (!userId) {
    console.error("getLabels called without userId");
    return []; // Return empty array instead of throwing
  }
  
  try {
    const client = await clientPromise;
    const db = client.db("ai-todo");
    
    // Query for both:
    // 1. User-specific labels (with userId field)
    // 2. Global system labels (with type="system" and no userId)
    const query = {
      $or: [
        { userId: new ObjectId(userId) }, // User's personal labels
        { type: "system", userId: { $exists: false } } // Global system labels
      ]
    };
    
    const labels = await db.collection("labels")
      .find(query)
      .sort({ name: 1 }) // Sort alphabetically by name
      .toArray() as unknown as Label[];
    
    // Transform ObjectIds to strings
    return labels.map((label) => ({
      ...label,
      _id: label._id.toString(),
      userId: label.userId?.toString(),
    }));
  } catch (error) {
    console.error("Error fetching labels:", error);
    return []; // Handle errors gracefully
  }
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
  const label = (await db
    .collection("labels")
    .findOne({ _id: new ObjectId(labelId) })) as Label | null;
  return label
    ? {
        ...label,
        _id: label._id.toString(), // Convert ObjectId to string
        userId: label.userId?.toString(), // Convert ObjectId to string
      }
    : null;
}

export async function deleteLabel(labelId: string): Promise<void> {
  const client = await clientPromise;
  const db = client.db("ai-todo");
  await db.collection("labels").deleteOne({ _id: new ObjectId(labelId) });
}
