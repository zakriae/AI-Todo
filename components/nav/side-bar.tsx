"use client";
import Link from "next/link";
import { primaryNavItems } from "@/utils";
import UserProfile from "./user-profile";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Hash, PlusIcon } from "lucide-react";
import { Dialog, DialogTrigger } from "../ui/dialog";
import AddProjectDialog from "../projects/add-project-dialog";
import AddLabelDialog from "../labels/add-label-dialog";
import { useProjects } from "@/hooks/useProjects";

interface MyListTitleType {
  [key: string]: string;
}

export default function SideBar() {
  const pathname = usePathname();
  console.log("projects");
  const { projects } = useProjects(); // Replace manual fetching with useProjects hook
  const [navItems, setNavItems] = useState([...primaryNavItems]);
 
  const LIST_OF_TITLE_IDS: MyListTitleType = {
    primary: "",
    projects: "My Projects",
  };

  const renderItems = (items: Array<any>, type: string) => {
    return items.map(({ _id, name }, idx) => {
      return {
        ...(idx === 0 && { id: type }),
        name,
        link: `/loggedin/${type}/${_id.toString()}`,
        icon: <Hash className="w-4 h-4" />,
      };
    });
  };

  useEffect(() => {
    if (projects?.length > 0) {
      const projectItems = renderItems(projects, "projects");
      setNavItems([...primaryNavItems, ...projectItems]);
    }
  }, [projects]);

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex justify-between h-14 items-center border-b p-1 lg:h-[60px] lg:px-2">
          <UserProfile />
        </div>
        <nav className="grid items-start px-1 text-sm font-medium lg:px-4">
          {navItems.map(({ name, icon, link, id }, idx) => (
            <div key={idx}>
              {id && (
                <div
                  className={cn(
                    "flex items-center mt-6 mb-2",
                    id === "filters" && "my-0"
                  )}
                >
                  <p className="flex flex-1 text-base">
                    {LIST_OF_TITLE_IDS[id]}
                  </p>
                  {LIST_OF_TITLE_IDS[id] === "My Projects" && (
                    <AddProjectDialog />
                  )}
                </div>
              )}
              <div className={cn("flex items-center lg:w-full")}>
                <div
                  className={cn(
                    "flex items-center text-left lg:gap-3 rounded-lg py-2 transition-all hover:text-primary justify-between w-full",
                    pathname === link
                      ? "active rounded-lg bg-primary/10 text-primary transition-all hover:text-primary"
                      : "text-foreground "
                  )}
                >
                  <Link
                    key={idx}
                    href={link}
                    className={cn(
                      "flex items-center text-left gap-3 rounded-lg transition-all hover:text-primary w-full"
                    )}
                  >
                    <div className="flex gap-4 items-center w-full">
                      <div className="flex gap-2 items-center">
                        <p className="flex text-base text-left">
                          {icon || <Hash />}
                        </p>
                        <p>{name}</p>
                      </div>
                    </div>
                  </Link>
                  {id === "filters" && (
                    <Dialog>
                      <DialogTrigger id="closeDialog">
                        <PlusIcon
                          className="h-5 w-5"
                          aria-label="Add a Label"
                        />
                      </DialogTrigger>
                      <AddLabelDialog />
                    </Dialog>
                  )}
                </div>
              </div>
            </div>
          ))}
        </nav>
      </div>
   
    </div>
  );
}