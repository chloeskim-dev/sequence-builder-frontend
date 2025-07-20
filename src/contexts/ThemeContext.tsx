import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";

interface ThemeContextType {
    darkMode: boolean;
    toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        fetch("/api/user/preferences")
            .then((res) => res.json())
            .then((data) => {
                setDarkMode(data.use_dark_theme);
                document.documentElement.classList.toggle(
                    "dark",
                    data.use_dark_theme
                );
            })
            .catch(() => {
                // Fallback to system preference or default
                const systemDark = window.matchMedia(
                    "(prefers-color-scheme: dark)"
                ).matches;
                setDarkMode(systemDark);
                document.documentElement.classList.toggle("dark", systemDark);
            });
    }, []);

    const toggleDarkMode = async () => {
        // flip locally
        setDarkMode((prev) => {
            const newValue = !prev;

            // immediately update <html> tag
            document.documentElement.classList.toggle("dark", newValue);

            // save to database
            fetch("/api/user/preferences", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ darkMode: newValue }),
            }).catch(console.error);

            return newValue;
        });
    };

    return (
        <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};
