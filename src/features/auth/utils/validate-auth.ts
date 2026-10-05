export type AuthField = "username" | "password";

export function validateAuthField(field: AuthField, value: string): string | null {
  switch (field) {
    case "username": {
      const v = value.trim();
      if (!v) return "Enter your username.";
      if (v.length < 3 || v.length > 20) return "Use 3–20 characters.";
      return /^\w+$/.test(v) ? null : "Use only letters, numbers and underscores.";
    }
    case "password":
      if (!value) return "Enter your password.";
      return value.length >= 8 ? null : "Use at least 8 characters.";
  }
}
