import { SHA256 } from "crypto-js";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { api, getRefreshToken } from "../utils/api";

interface User {
  id: string;
  email?: string;
  name?: string;
  role?: string;
  preferences?: {
    darkMode?: boolean;
    language?: string;
  };
}

interface LoginCredentials {
  username: string;
  password: string;
}

const SALT = "pjZKk6A8YtC8$9p&UIp62bv4PLwD7@dF";
interface UserContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setIsLoading(false);
        return;
      }

      const response = await fetch("/v1/auth/log", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        // Token invalid, remove it
        localStorage.removeItem("authToken");
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem("authToken");
    } finally {
      setIsLoading(false);
    }
  };

  const login = async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    const password_hash = SHA256(password + SALT).toString();
    const payload = {
      username,
      password_hash,
    };
    const endpoint = "/v1/auth/login";
    const res = await fetch(`http://127.0.0.1:8080${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error("Login failed");
    }

    const data = await res.json();

    localStorage.setItem("accessToken", data.access_token);
    localStorage.setItem("refreshToken", data.refresh_token);
    setUser({
      id: data.user_id,
      email: "",
      name: "",
      role: "",
      preferences: {
        darkMode: false,
        language: "en",
      },
    });
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        const res = await api.post(
          "/v1/auth/logout",
          {},
          { token: getRefreshToken() }
        );
        console.log("logged out user", res);
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);
      window.location.href = "/";
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/user/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error("Update failed");
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
    } catch (error) {
      throw error;
    }
  };

  const refreshUser = async () => {
    await checkAuthStatus();
  };

  const isAuthenticated = user !== null;

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        logout,
        updateUser,
        refreshUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
