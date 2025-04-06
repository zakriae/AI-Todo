"use client";
import SideBar from "@/components/nav/side-bar";
import MobileNav from "@/components/nav/mobile-nav";
import { Tag } from "lucide-react";
import { useLabels } from "@/hooks/useLabels";
import { Label } from "@/types";

export default function FilterLabelsPage() {
  const { labels, isLoading } = useLabels();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <SideBar />
      <div className="flex flex-col">
        <MobileNav />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:px-8">
          <div className="xl:px-40">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-semibold md:text-2xl">Labels</h1>
            </div>
            <div className="mt-6">
              {labels.map((label: Label) => (
                <div key={label._id.toString()} className="flex items-center p-2 border-b border-gray-200">
                  <Tag className="w-4 h-4 text-primary" />
                  <div className="flex flex-col ml-2">
                    <span className="text-sm font-normal">{label.name}</span>

                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
