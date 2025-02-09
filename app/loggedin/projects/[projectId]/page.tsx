"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import SideBar from "@/components/nav/side-bar";
import MobileNav from "@/components/nav/mobile-nav";
import SuggestMissingTasks from "@/components/add-tasks/suggest-tasks";
import DeleteProject from "@/components/projects/delete-project";
import Todos from "@/components/todos/todos";
import { getProjectById, getIncompleteTodosByProject } from "@/actions/projects"; // Import your MongoDB functions
import { Project, Todo } from "@/types"; // Import your custom types

export default function ProjectPage() {
  const { projectId } = useParams<{ projectId: string }>();

  const [project, setProject] = useState<Project | null>(null);
  const [inCompletedTodosByProject, setInCompletedTodosByProject] = useState<Todo[]>([]);

  useEffect(() => {
    async function fetchData() {
      if (projectId) {
        const projectData = await getProjectById(projectId);
        const incompleteTodos = await getIncompleteTodosByProject(projectId);

        setProject(projectData);
        setInCompletedTodosByProject(incompleteTodos);
      }
    }
    fetchData();
  }, [projectId]);

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
                {projectName || "Project"}
              </h1>
              <div className="flex gap-6 lg:gap-12 items-center">
                <SuggestMissingTasks projectId={projectId} />
                <DeleteProject projectId={projectId} />
              </div>
            </div>
            <div className="flex flex-col gap-1 mt-4">
              <Todos items={inCompletedTodosByProject} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}