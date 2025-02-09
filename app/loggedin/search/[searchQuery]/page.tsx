"use client";
import MobileNav from "@/components/nav/mobile-nav";
import SideBar from "@/components/nav/side-bar";
import Todos from "@/components/todos/todos";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { searchTasks } from "@/actions/todos"; // Import your search function

export default function Search() {
  const { searchQuery } = useParams<{ searchQuery: string }>();

  const [searchResults, setSearchResults] = useState<any>([]);
  const [searchInProgress, setSearchInProgress] = useState(false);

  useEffect(() => {
    const handleSearch = async () => {
      setSearchResults([]);

      setSearchInProgress(true);
      try {
        const results = await searchTasks(searchQuery); // Use your search function
        setSearchResults(results);
      } finally {
        setSearchInProgress(false);
      }
    };

    if (searchQuery) {
      handleSearch();
    }
  }, [searchQuery]);

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <SideBar />
      <div className="flex flex-col">
        <MobileNav />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:px-8">
          <div className="xl:px-40">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-semibold md:text-2xl">
                Search Results for{" "}
                <span>
                  {`"`}
                  {decodeURI(searchQuery)}
                  {`"`}
                </span>
              </h1>
            </div>

            <div className="flex flex-col gap-1 py-4">
              <Todos
                items={searchResults.filter(
                  (item: any) => item.isCompleted === false
                )}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
