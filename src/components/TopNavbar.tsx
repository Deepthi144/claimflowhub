import { Moon, Sun, User } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { useAuth } from "@/lib/auth";

export function TopNavbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, role } = useAuth();

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
      <h2 className="text-lg font-semibold text-foreground font-['Space_Grotesk']">
        Claim Processing System
      </h2>
      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
          aria-label="Toggle theme"
        >
          {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-foreground leading-none">
              {user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User"}
            </p>
            <p className="text-xs text-muted-foreground capitalize">{role || ""}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
