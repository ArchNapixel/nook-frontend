"use client";

import Link from "next/link";
import { LayoutDashboardIcon, LogOutIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { User } from "../types/user";

function getInitials(username: string) {
  return username.slice(0, 2).toUpperCase() || "?";
}

type ProfileMenuProps = {
  user: User | null;
  onSignInClick: () => void;
  onSignOut: () => void;
};

const POSITION = "absolute right-3 top-3 z-20 sm:right-4 sm:top-4";

export default function ProfileMenu({ user, onSignInClick, onSignOut }: ProfileMenuProps) {
  if (!user) {
    return (
      <Button onClick={onSignInClick} size="lg" className={`${POSITION} h-11 rounded-full px-5 shadow-lg`}>
        Sign in
      </Button>
    );
  }

  return (
    <div className={POSITION}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label="Account menu"
            className="rounded-full shadow-lg ring-2 ring-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <Avatar className="size-11">
              <AvatarFallback className="bg-primary text-base font-medium text-primary-foreground">
                {getInitials(user.username)}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel className="font-normal">
            <p className="truncate text-sm font-semibold text-foreground">{user.username}</p>
            <p className="text-xs text-muted-foreground">{user.role === "admin" ? "Administrator" : "Student"}</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {user.role === "admin" && (
            <DropdownMenuItem asChild>
              <Link href="/admin">
                <LayoutDashboardIcon />
                Admin dashboard
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onSelect={onSignOut}>
            <LogOutIcon />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
