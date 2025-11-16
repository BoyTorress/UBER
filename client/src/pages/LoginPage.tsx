import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Lock, Moon, Sun } from "lucide-react";
import { useEffect } from "react";

interface LoginPageProps {
  onLogin?: (email: string, password: string, remember: boolean) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    document.documentElement.classList.toggle('dark', newIsDark);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin?.(email, password, remember);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute top-4 right-4">
        <Button
          size="icon"
          variant="ghost"
          onClick={toggleTheme}
          data-testid="button-toggle-theme"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>
      </div>

      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground font-bold text-2xl mb-4">
            U
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">
            UberFinanzas
          </h1>
          <p className="text-sm text-muted-foreground">
            Gestión financiera para conductores
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
                data-testid="input-email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
                data-testid="input-password"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={remember}
              onCheckedChange={(checked) => setRemember(checked as boolean)}
              data-testid="checkbox-remember"
            />
            <Label
              htmlFor="remember"
              className="text-sm font-normal cursor-pointer"
            >
              Recordar sesión
            </Label>
          </div>

          <Button type="submit" className="w-full" size="lg" data-testid="button-login">
            Iniciar Sesión
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            ¿No tienes cuenta?{" "}
            <button
              type="button"
              className="text-primary font-medium hover-elevate"
              onClick={() => console.log('Registro clicked')}
              data-testid="link-register"
            >
              Regístrate aquí
            </button>
          </p>
        </form>
      </Card>
    </div>
  );
}
