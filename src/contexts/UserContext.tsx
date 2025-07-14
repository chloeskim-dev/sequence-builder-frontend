import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import { api, getRefreshToken, safeFetch } from "../utils/api";

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

interface LoginPayload {
    identifier: string;
    password: string;
}

interface LoginSuccessResponseJson {
    access_token: string;
    refresh_token: string;
    token_type: string;
    user_id: string;
}

function isLoginSuccessResponseJson(
    data: any
): data is LoginSuccessResponseJson {
    return (
        typeof data === "object" &&
        typeof data.access_token === "string" &&
        typeof data.refresh_token === "string" &&
        typeof data.token_type === "string" &&
        typeof data.user_id === "string"
    );
}

interface UserContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (credentials: LoginPayload) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (updates: Partial<User>) => Promise<void>;
    refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);
const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

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

    const login = async (payload: LoginPayload) => {
        const endpoint = "/v1/auth/login";
        const fetchOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        };

        try {
            const { response, data } = await safeFetch(
                `${REACT_APP_API_URL}${endpoint}`,
                fetchOptions
            );

            console.log("Status:", response.status);
            console.log("Data:", data);

            if (data && isLoginSuccessResponseJson(data)) {
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
            }
        } catch (err: any) {
            throw err;
        }
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
            }
        } catch (error) {
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
