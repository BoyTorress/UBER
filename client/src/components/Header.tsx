import { Button } from "@/components/ui/button";
import { LogOut, Moon, Sun, User } from "lucide-react";
import { useState, useEffect } from "react";
import logoUrl from "@assets/favicon_1763333474962.png";

interface HeaderProps {
  userName?: string;
  onLogout?: () => void;
}

export default function Header({ userName = "Usuario", onLogout }: HeaderProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    document.documentElement.classList.toggle('dark', newIsDark);
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <img 
            src={logoUrl} 
            alt="Brandon Sus Finanzas" 
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h1 className="text-lg font-bold tracking-tight">Brandon Sus Finanzas</h1>
            <p className="text-xs text-muted-foreground">Uber y su vida universitaria</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={toggleTheme}
            data-testid="button-toggle-theme"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
          
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">{userName}</span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            data-testid="button-logout"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Salir
          </Button>
        </div>
      </div>
    </header>
  );
}
