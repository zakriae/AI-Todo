"use client";
import { Hash } from "lucide-react";
import Link from "next/link";
import { Label } from "../ui/label";
import { useProjects } from "@/hooks/useProjects"; // Import the hook instead of direct MongoDB function
import { Button } from "../ui/button"; // For creating new projects
import { PlusCircle } from "lucide-react"; // Optional icon for "Create project" button

export default function ProjectList() {
  // Use the hook to get projects and loading state
  const { projects, isLoading } = useProjects();

  return (
    <div className="xl:px-40">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Projects</h1>
        
        {/* Optionally add a create project button */}
        <Link href="/loggedin/projects/new">
          <Button variant="outline" size="sm" className="flex gap-1">
            <PlusCircle className="h-4 w-4" />
            <span>New Project</span>
          </Button>
        </Link>
      </div>
      
      <div className="flex flex-col gap-1 py-4">
        {isLoading ? (
          <div className="py-4 text-center text-muted-foreground">Loading projects...</div>
        ) : projects && projects.length > 0 ? (
          projects.map((project) => (
            <Link key={project._id} href={`/loggedin/projects/${project._id}`}>
              <div className="flex items-center space-x-2 border-b-2 p-2 border-gray-100 hover:bg-slate-50 rounded-md transition-colors">
                <Hash className="text-primary w-5" />
                <Label
                  htmlFor={`project-${project._id}`}
                  className="text-base font-normal hover:cursor-pointer"
                >
                  {project.name}
                </Label>
              </div>
            </Link>
          ))
        ) : (
          <div className="py-4 text-center text-muted-foreground">
            No projects found. Create your first project!
          </div>
        )}
      </div>
    </div>
  );
}