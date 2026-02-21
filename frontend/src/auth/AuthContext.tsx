import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/client";

export type AuthUser = {
  id: number;
  email: string;
  role: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, role?: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function readStored() {
  const token = localStorage.getItem("ai_powered_smart_hospital_token");
  const userRaw = localStorage.getItem("ai_powered_smart_hospital_user");
  return {
    token,
    user: userRaw ? (JSON.parse(userRaw) as AuthUser) : null
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const stored = readStored();
  const [user, setUser] = useState<AuthUser | null>(stored.user);
  const [token, setToken] = useState<string | null>(stored.token);

  useEffect(() => {
    if (token && user) {
      localStorage.setItem("ai_powered_smart_hospital_token", token);
      localStorage.setItem("ai_powered_smart_hospital_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("ai_powered_smart_hospital_token");
      localStorage.removeItem("ai_powered_smart_hospital_user");
    }
  }, [token, user]);

  async function login(email: string, password: string) {
    const res = await api.post("/auth/login", { email, password });
    setToken(res.data.token);
    setUser(res.data.user);
  }

  async function register(email: string, password: string, role?: string) {
    const res = await api.post("/auth/register", { email, password, role });
    setToken(res.data.token);
    setUser(res.data.user);
  }

  function logout() {
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("AuthProvider missing");
  }
  return ctx;
}
