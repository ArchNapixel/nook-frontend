export type UserRole = "user" | "admin";

export type User = {
  username: string;
  role: UserRole;
  avatarUrl?: string;
};
