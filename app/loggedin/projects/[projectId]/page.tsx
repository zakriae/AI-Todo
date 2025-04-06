"use client";
import { useParams } from "next/navigation";
import SideBar from "@/components/nav/side-bar";
import MobileNav from "@/components/nav/mobile-nav";
import SuggestMissingTasks from "@/components/add-tasks/suggest-tasks";
import DeleteProject from "@/components/projects/delete-project";
import Todos from "@/components/todos/todos";
import { AddTaskWrapper } from "@/components/add-tasks/add-task-button";
import CompletedTodos from "@/components/todos/completed-todos";
import { useProjects } from "@/hooks/useProjects"; 
import { useTodos } from "@/hooks/useTodos";
import { Todo } from "@/types";

export default function ProjectPage() {
  const params = useParams();
  const projectId = params?.projectId?.toString();

  
  
  // Use existing hooks
  const { projects, isLoading: isLoadingProject } = useProjects();
  const { todos: allTodos, isLoading: isLoadingTodos, updateTodo } = useTodos();
  const project = projects?.find(p => p._id === projectId);
  // Combined loading state
  const isLoading = isLoadingProject || isLoadingTodos;
  
  // Filter todos by current project ID
  const projectTodos = allTodos.filter(todo => todo.projectId === projectId);

  const handleOnChangeTodo = async (todo: Todo) => {
    updateTodo({ todoId : todo._id, isCompleted: !todo.isCompleted });
  };

  // Further filter by completion status and ensure they're parent tasks (not subtasks)
  const incompleteTodos = projectTodos.filter(todo => 
    !todo.isCompleted && !todo.parentId
  );
  
  const completedTodos = projectTodos.filter(todo => 
    todo.isCompleted && !todo.parentId
  );
  
  // Calculate total todos for this project (parent-level only)
  const projectTodosTotal = completedTodos.length;
  
  const projectName = project?.name || "";

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <SideBar />
      <div className="flex flex-col">
        <MobileNav navTitle={"My Projects"} navLink="/loggedin/projects" />

        <main className="flex flex-1 flex-col gap-4 p-4 lg:px-8">
          <div className="xl:px-40">
            <div className="flex items-center justify-between flex-wrap gap-2 lg:gap-0">
              <h1 className="text-lg font-semibold md:text-2xl">
                {isLoadingProject ? "Loading..." : (projectName || "Project")}
              </h1>
              <div className="flex gap-6 lg:gap-12 items-center">
                <SuggestMissingTasks projectId={projectId || ""} />
                <DeleteProject projectId={projectId} />
              </div>
            </div>
            <div className="flex flex-col gap-1 mt-4">
              {/* Incomplete todos */}
              {isLoading ? (
                <div className="py-4 text-center text-muted-foreground">Loading tasks...</div>
              ) : (
                <Todos items={incompleteTodos} handleOnChangeTodo={handleOnChangeTodo} />
              )}

              {/* Add task area */}
              <div className="pb-6">
                <AddTaskWrapper />
              </div>

              {/* Completed todos */}
              {isLoading ? (
                <div className="py-2"></div>
              ) : (
                <Todos items={completedTodos} handleOnChangeTodo={handleOnChangeTodo} />
              )}
              
              
              {/* Completed todos counter */}
              <div className="flex items-center gap-1 border-b-2 p-2 border-gray-100  text-sm text-foreground/80">
                <CompletedTodos totalTodos={projectTodosTotal} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}