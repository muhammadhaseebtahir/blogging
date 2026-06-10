import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Role = "guest" | "user" | "poster" | "admin";

interface AuthUser {
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  role: Role;
  login: (role: Exclude<Role, "guest">, name?: string) => void;
  logout: () => void;
  setRole: (role: Role) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "blogsphere.auth";

const defaultUserFor = (role: Exclude<Role, "guest">, name?: string): AuthUser => ({
  name: name ?? (role === "admin" ? "Admin Sphere" : role === "poster" ? "Aisha Khan" : "Reader"),
  email: `${role}@blogsphere.ai`,
  role,
  avatar: `https://i.pravatar.cc/150?u=${role}`,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {}
  }, []);

  const persist = (u: AuthUser | null) => {
    setUser(u);
    if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    else localStorage.removeItem(STORAGE_KEY);
  };

  const value: AuthContextValue = {
    user,
    role: user?.role ?? "guest",
    login: (role, name) => persist(defaultUserFor(role, name)),
    logout: () => persist(null),
    setRole: (role) => persist(role === "guest" ? null : defaultUserFor(role)),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
