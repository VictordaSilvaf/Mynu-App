import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../theme-provider";
import { User } from "@/types";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()

    return (
        <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="relative w-10 h-10 rounded-full bg-muted/50 backdrop-blur-md border border-border/50 flex items-center justify-center hover:bg-muted transition-colors"
            aria-label="Toggle theme"
        >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-foreground" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-foreground" />
        </motion.button>
    );
}
