"use client";

import * as React from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export const NavLink = ({
  children,
  onClick,
  className = "",
  type = "button",
}: NavLinkProps) => {
  return (
    <Button
      type={type}
      variant="link"
      onClick={onClick}
      className={cn(
        "text-sm font-medium text-muted-foreground hover:text-foreground",
        className
      )}
    >
      {children}
    </Button>
  );
};
