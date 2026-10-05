"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { User } from "../types/user";
import { validateAuthField, type AuthField } from "../utils/validate-auth";

type Mode = "login" | "signup";
type Values = Record<AuthField, string>;
type Errors = Partial<Record<AuthField, string>>;

const FIELDS: { field: AuthField; label: string; type: string }[] = [
  { field: "username", label: "Username", type: "text" },
  { field: "password", label: "Password", type: "password" },
];

type AuthDialogProps = {
  initialMode?: Mode;
  onClose: () => void;
  onAuthenticated: (user: User) => void;
};

// Mount only while open so form state resets on close.
export default function AuthDialog({ initialMode = "login", onClose, onAuthenticated }: AuthDialogProps) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [values, setValues] = useState<Values>({ username: "", password: "" });
  const [errors, setErrors] = useState<Errors>({});

  const isLogin = mode === "login";

  function switchMode(next: Mode) {
    setMode(next);
    setErrors({});
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors: Errors = {};
    for (const { field } of FIELDS) {
      const error = validateAuthField(field, values[field]);
      if (error) nextErrors[field] = error;
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    // ponytail: no backend yet, so this signs in locally; call the auth API here once it exists.
    // Demo-only role rule: the username "admin" becomes an admin; the real role must come from the backend.
    const username = values.username.trim();
    onAuthenticated({ username, role: username.toLowerCase() === "admin" ? "admin" : "user" });
  }

  function autoCompleteFor(field: AuthField) {
    if (field === "username") return "username";
    return isLogin ? "current-password" : "new-password";
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-lg">{isLogin ? "Log in to NOOK" : "Create your account"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {FIELDS.map(({ field, label, type }) => (
            <div key={field} className="space-y-1.5">
              <Label htmlFor={`auth-${field}`}>{label}</Label>
              <Input
                id={`auth-${field}`}
                type={type}
                autoComplete={autoCompleteFor(field)}
                value={values[field]}
                onChange={(e) => {
                  setValues((v) => ({ ...v, [field]: e.target.value }));
                  setErrors((er) => ({ ...er, [field]: undefined }));
                }}
                onBlur={() =>
                  setErrors((er) => ({ ...er, [field]: validateAuthField(field, values[field]) ?? undefined }))
                }
                aria-invalid={!!errors[field]}
                aria-describedby={errors[field] ? `auth-${field}-error` : undefined}
                className="h-9"
              />
              {errors[field] && (
                <p id={`auth-${field}-error`} className="text-sm text-destructive">
                  {errors[field]}
                </p>
              )}
            </div>
          ))}
          <Button type="submit" size="lg" className="h-10 w-full">
            {isLogin ? "Log in" : "Create account"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          {isLogin ? "New to NOOK?" : "Already have an account?"}{" "}
          <Button type="button" variant="link" className="h-auto p-0" onClick={() => switchMode(isLogin ? "signup" : "login")}>
            {isLogin ? "Sign up" : "Log in"}
          </Button>
        </p>
      </DialogContent>
    </Dialog>
  );
}
