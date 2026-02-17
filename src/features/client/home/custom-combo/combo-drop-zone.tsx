"use client";

import { useDroppable } from "@dnd-kit/core";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ComboDropZoneProps {
  children: ReactNode;
  className?: string;
}

export function ComboDropZone({ children, className }: ComboDropZoneProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: "combo-drop-zone",
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        isOver ? "ring-2 ring-green-500 bg-green-50" : "",
        "rounded-3xl transition-all h-full",
        className,
      )}
    >
      {children}
    </div>
  );
}
