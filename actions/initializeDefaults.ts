"use server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// Define all system projects that should be created for each user
const defaultProjects = [
  { name: "Personal", type: "system", system: true },
  { name: "Work", type: "system", system: true },
];

// Define system labels - these should NOT be duplicated per user
const systemLabelNames = [
  "Personal", "Work", "Travel", "Health", "Gym", "Important"
];

export async function initializeDefaults(userId: string): Promise<void> {
  if (!userId) {
    console.error("No userId provided to initializeDefaults");
    return;
  }

  try {
    const client = await clientPromise;
    const db = client.db("ai-todo");

    // Convert userId to ObjectId
    let userObjectId;
    try {
      userObjectId = new ObjectId(userId);
    } catch (error) {
      console.error("Invalid userId format:", userId);
      console.error("Error creating ObjectId:", error);
      userObjectId = userId;
    }

    console.log(`Initializing defaults for user: ${userId}`);

    // Create default projects (with system flag)
    for (const project of defaultProjects) {
      const existingProject = await db.collection("projects").findOne({
        userId: userObjectId,
        name: project.name
      });

      if (!existingProject) {
        await db.collection("projects").insertOne({
          userId: userObjectId,
          name: project.name,
          type: "system",
          system: true,
          createdAt: new Date()
        });
        console.log(`Created default project: ${project.name}`);
      }
    }

    // Check if system labels exist globally (NOT user-specific)
    for (const labelName of systemLabelNames) {
      const existingSystemLabel = await db.collection("labels").findOne({
        name: labelName,
        type: "system",
      });

      // Only create system label if it doesn't exist at all
      if (!existingSystemLabel) {
        const labelData = {
          name: labelName,
          type: "system",
          system: true, // Add a system flag to be consistent
          createdAt: new Date(),
          // No userId for system labels - they're global
        };
        

        
        await db.collection("labels").insertOne(labelData);
        console.log(`Created global system label: ${labelName}`);
      }
    }
    
    console.log("Successfully initialized all defaults for user");
  } catch (error) {
    console.error("Error initializing defaults:", error);
  }
}



