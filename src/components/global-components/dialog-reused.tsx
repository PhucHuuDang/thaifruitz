"use client";

import { JSX, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DialogReusedProps {
  title: string | JSX.Element;
  description: string | JSX.Element;
  trigger: React.ReactNode | string | number | JSX.Element;

  content: string | JSX.Element;

  icon?: LucideIcon | React.ReactNode;

  open?: boolean;

  className?: string;
  onOpen?: (state: boolean) => void;

  asChild?: boolean;
}

export const DialogReused = ({
  title,
  description,
  trigger,
  content,
  open = false,
  asChild,
  onOpen,
  className,
}: DialogReusedProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Dialog open={open ?? isOpen} onOpenChange={onOpen ?? setIsOpen}>
      <DialogTrigger asChild={asChild}>{trigger}</DialogTrigger>
      <DialogContent className={cn("", className)}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>`{description}</DialogDescription>
        </DialogHeader>

        {content}
      </DialogContent>
    </Dialog>
  );
};
