import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const init = async () => {
      api.initFromStorage();

      const guestMode = localStorage.getItem("guestMode");
      const token = localStorage.getItem("token");

      // ✅ 1. Si está en modo invitado → restaurar sesión
      if (guestMode === "1") {
        setUser({
          id: 0,
          name: "Invitado",
          email: "guest@boardo",
          guest: true,
        });
        setIsReady(true);
        return;
      }

      // ✅ 2. Si no hay token → no hay usuario
      if (!token) {
        setIsReady(true);
        return;
      }

      // ✅ 3. Validar token en backend
      try {
        const res = await api.get<{ user: any }>("auth/mine");
        setUser(res.user);
      } catch {
        setUser(null);
      } finally {
        setIsReady(true);
      }
    };

    init();
  }, []);

  // ✅ Login normal
  const login = async (email: string, password: string) => {
    const res = await api.post<{ token: string; user: any }>("auth/login", {
      email,
      password,
    });

    api.setToken(res.token);
    localStorage.removeItem("guestMode");

    setUser(res.user);

    queryClient.invalidateQueries({
      queryKey: ["userTasks", res.user.id],
    });

    router.push("/dashboard");
  };

  // ✅ Login invitado
  const loginGuest = () => {
    const guestUser = {
      id: 0,
      name: "Invitado",
      email: "guest@boardo",
      guest: true,
    };

    localStorage.setItem("guestMode", "1");
    localStorage.removeItem("token");

    if (!localStorage.getItem("guestTasks")) {
      localStorage.setItem("guestTasks", JSON.stringify(seedGuestTasks()));
    }

    setUser(guestUser);
    router.push("/dashboard");
  };

  // ✅ Registro normal
  const register = async (name: string, email: string, password: string) => {
    await api.post("auth/register", { name, email, password });
    router.push("/auth/login");
  };

  // ✅ Logout (normal o invitado)
  const logout = () => {
    api.setToken(null);
    localStorage.removeItem("guestMode");
    // localStorage.removeItem("guestTasks")  → opcional
    setUser(null);
    queryClient.clear();
    router.push("/");
  };

  return {
    user,
    isReady,
    login,
    loginGuest,
    register,
    logout,
  };
}

function seedGuestTasks() {
  const now = new Date().toISOString();
  return [
    {
      id: "g-1",
      title: "Welcome to Boardo",
      description: "Try dragging this card between columns",
      listId: 1,
      position: 1,
      priority: "MEDIUM",
      createdAt: now,
      updatedAt: now,
      userId: "0",
    },
    {
      id: "g-2",
      title: "Guest task",
      description: "",
      listId: 2,
      position: 1,
      priority: "LOW",
      createdAt: now,
      updatedAt: now,
      userId: "0",
    },
  ];
}
