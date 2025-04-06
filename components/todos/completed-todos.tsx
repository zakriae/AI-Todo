import { CircleCheckBig } from "lucide-react";
import React from "react";

export default function CompletedTodos({
  totalTodos = 0,
}: {
  totalTodos: number;
}) {
  return (
  
      <>
        <CircleCheckBig />
        <span>+ {totalTodos}</span>
        <span className="capitalize">completed tasks</span>
      </>
  );
}
