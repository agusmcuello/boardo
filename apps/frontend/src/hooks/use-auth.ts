import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      api.initFromStorage();
      const storedToken = localStorage.getItem("token");

      if (!storedToken) {
        setIsReady(true);
        return;
      }

      try {
        const res = await api.get<{ user: any }>("auth/me");
        setUser(res.user);
      } catch (err: any) {
        console.error("❌ Error al validar token:", err.message);
        // 👇 no borres enseguida el token, solo marca el user como null
        setUser(null);
      } finally {
        setIsReady(true);
      }
    };
    init();
  }, []);

  const login = async (email: string, password: string) => {
    console.log("📤 Sending to API:", { email, password });
    const res = await api.post<{ token: string; user: any }>("auth/login", {
      email,
      password,
    });
    console.log("✅ API response:", res);
    api.setToken(res.token);
    setUser(res.user);
    router.push("/dashboard");
  };

  const register = async (name: string, email: string, password: string) => {
    await api.post("auth/register", { name, email, password });
    router.push("/auth/login");
  };

  const logout = () => {
    api.setToken(null);
    setUser(null);
    router.push("/auth/login");
  };

  return { user, isReady, login, register, logout };
}
