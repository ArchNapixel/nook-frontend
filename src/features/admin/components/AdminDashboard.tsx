"use client";

import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/features/auth/context/AuthProvider";
import { usePlaces } from "@/features/places/hooks/use-places";
import AdminInsights from "./AdminInsights";
import AdminSpotsSection from "./AdminSpotsSection";
import AdminStats from "./AdminStats";

function BackToMap() {
  return (
    <Button asChild variant="outline">
      <Link href="/">
        <ArrowLeftIcon />
        Back to map
      </Link>
    </Button>
  );
}

export default function AdminDashboard() {
  const { user, isReady } = useAuth();
  const { places, isLoading, hasError } = usePlaces();

  if (!isReady) {
    return <Skeleton className="m-4 h-40 max-w-[110rem] sm:mx-auto" aria-busy="true" />;
  }

  // UI gate only: the backend must enforce admin access when it exists.
  if (user?.role !== "admin") {
    return (
      <main className="mx-auto flex min-h-dvh max-w-sm flex-col items-center justify-center gap-4 p-6 text-center">
        <h1 className="text-xl font-semibold">Admins only</h1>
        <p className="text-sm text-muted-foreground">
          {user ? "Your account doesn’t have access to the dashboard." : "Sign in with an admin account to continue."}
        </p>
        <BackToMap />
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-[110rem] space-y-6 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold">Admin dashboard</h1>
          <p className="truncate text-sm text-muted-foreground">Signed in as {user.username}</p>
        </div>
        <BackToMap />
      </header>

      {isLoading && <Skeleton className="h-64 rounded-xl" aria-busy="true" />}
      {hasError && <p role="alert" className="text-sm text-destructive">Couldn’t load spots. Reload to try again.</p>}
      {!isLoading && !hasError && (
        <>
          <AdminStats places={places} />
          <AdminInsights places={places} />
          <AdminSpotsSection places={places} />
        </>
      )}
    </main>
  );
}
