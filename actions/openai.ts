"use server";

import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type TaskResult = {
  taskName: string;
  description?: string;
  priority?: string;
};

type AIResponse = {
  success: boolean;
  tasksCount?: number;
  error?: string;
};

type OpenAITaskResponse = {
  todos: TaskResult[];
};

async function getOrCreateAILabel(db: any, userId: string) {
  // Try to find existing AI label
  const existingLabel = await db.collection("labels")
    .findOne({ name: "AI", userId: new ObjectId(userId) });
  
  if (existingLabel) {
    return existingLabel._id.toString();
  }
  
  // Create new AI label if it doesn't exist
  const newLabel = {
    name: "AI",
    userId: new ObjectId(userId),
    type: "user",
    createdAt: new Date()
  };
  
  const result = await db.collection("labels").insertOne(newLabel);
  return result.insertedId.toString();
}

export async function suggestTasksWithAI({ projectId }: { projectId: string }): Promise<AIResponse> {
  try {
    // Get project details to provide context for AI
    const client = await clientPromise;
    const db = client.db("ai-todo");
    const project = await db.collection("projects").findOne({ _id: new ObjectId(projectId) });
    
    if (!project) {
      return { success: false, error: "Project not found" };
    }

    // Get existing todos for this project to avoid duplicates
    const existingTodos = await db.collection("todos")
      .find({ projectId: projectId, parentId: { $exists: false } })
      .toArray();
    
    // Format for OpenAI
    const todos = existingTodos.map(todo => ({
      taskName: todo.taskName,
      description: todo.description || ""
    }));

    const aiLabelId = await getOrCreateAILabel(db, project.userId.toString());

    // Generate tasks with OpenAI
    const response = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "I'm a project manager and I need help identifying missing to-do items. I have a list of existing tasks in JSON format, containing objects with 'taskName' and 'description' properties. I also have a good understanding of the project scope. Can you help me identify 5 additional to-do items for the project with projectName that are not yet included in this list? Please provide these missing items in a separate JSON array with the key 'todos' containing objects with 'taskName' and 'description' properties. Ensure there are no duplicates between the existing list and the new suggestions.",
        },
        {
          role: "user",
          content: JSON.stringify({
            todos,
            projectName: project.name,
            projectDescription: project.description || ""
          }),
        },
      ],
      response_format: {
        type: "json_object",
      },
      model: "gpt-4o-mini",
    });

    const responseData = JSON.parse(response.choices[0].message.content || '{}') as OpenAITaskResponse;
    
    if (!responseData.todos || !Array.isArray(responseData.todos)) {
      return { success: false, error: "Invalid AI response format" };
    }
    
    const tasks = responseData.todos;
    
    // Insert the generated tasks into the database
    const insertPromises = tasks.map(task => {
      return db.collection("todos").insertOne({
        taskName: task.taskName,
        description: task.description || "",
        priority: task.priority || "medium",
        projectId: project._id.toString(),
        isCompleted: false,
        userId: project.userId.toString(),
        labelId: aiLabelId,
        createdAt: new Date()
      });
    });
    
    await Promise.all(insertPromises);
    
    // Revalidate the path to update the UI
    revalidatePath("/loggedin");
    
    return { 
      success: true,
      tasksCount: tasks.length
    };
  } catch (error) {
    console.error("Error in suggestTasksWithAI:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

export async function suggestSubtasksWithAI({ 
  projectId, 
  taskName, 
  description, 
  parentId 
}: { 
  projectId: string;
  taskName: string;
  description: string;
  parentId: string;
}): Promise<AIResponse> {
  try {
    const client = await clientPromise;
    const db = client.db("ai-todo");
    
    // Get existing subtasks for this parent
    const existingSubtasks = await db.collection("todos")
      .find({ parentId: parentId })
      .toArray();
    
    // Format for OpenAI
    const todos = existingSubtasks.map(todo => ({
      taskName: todo.taskName,
      description: todo.description || ""
    }));

    
    
    // Get project name for context
    const project = await db.collection("projects").findOne({ _id: new ObjectId(projectId) });
    const projectName = project ? project.name : "Unknown Project";
   

    // Generate subtasks with OpenAI
    const response = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "I'm a project manager and I need help identifying missing sub tasks for a parent todo. I have a list of existing sub tasks in JSON format, containing objects with 'taskName' and 'description' properties. I also have a good understanding of the project scope. Can you help me identify 3 to 5 additional sub tasks that are not yet included in this list? Please provide these missing items in a separate JSON array with the key 'todos' containing objects with 'taskName' and 'description' properties. Ensure there are no duplicates between the existing list and the new suggestions.",
        },
        {
          role: "user",
          content: JSON.stringify({
            todos,
            projectName,
            parentTodo: { taskName, description }
          }),
        },
      ],
      response_format: {
        type: "json_object",
      },
      model: "gpt-4o-mini",
    });
   
    console.log("AI Response:", response);

    const responseData = JSON.parse(response.choices[0].message.content || '{}') as OpenAITaskResponse;
    console.log("AI Response:", responseData);
    if (!responseData.todos || !Array.isArray(responseData.todos)) {
      return { success: false, error: "Invalid AI response format" };
    }
    
    const subtasks = responseData.todos;
    
    // Get the parent task to access userId
    const parentTask = await db.collection("todos").findOne({ _id: new ObjectId(parentId) });
    
    if (!parentTask) {
      return { success: false, error: "Parent task not found" };
    }

    const aiLabelId = await getOrCreateAILabel(db, parentTask.userId.toString());

    
    // Insert the generated subtasks into the database
    const insertPromises = subtasks.map(subtask => {
      return db.collection("todos").insertOne({
        taskName: subtask.taskName,
        description: subtask.description || "",
        priority: subtask.priority || "medium",
        projectId: projectId,
        parentId: parentId,
        isCompleted: false,
        userId: parentTask.userId.toString(),
        labelId: aiLabelId,
        createdAt: new Date()
      });
    });
    
    await Promise.all(insertPromises);
    
    // Revalidate the path to update the UI
    revalidatePath("/loggedin");
    
    return { 
      success: true,
      tasksCount: subtasks.length
    };
  } catch (error) {
    console.error("Error in suggestSubtasksWithAI:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}