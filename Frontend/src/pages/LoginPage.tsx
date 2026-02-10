import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "../components/LanguageSwitcher";

// shadcn/ui
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "../components/ui/alert";

// const LOGO_SRC = "/logo.jpeg"; // option A: put logo in Frontend/public/logo.jpeg
const LOGO_SRC = new URL("../assets/logo.jpeg", import.meta.url).toString(); // option B: if logo is in src/assets

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      navigate("/feed");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t('loginFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-blue-600 to-sky-500 dark:from-slate-900 dark:via-blue-900 dark:to-slate-900 transition-colors" />
      <div className="absolute inset-0 opacity-40 dark:opacity-20 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.35),transparent_55%)]" />
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-white/15 dark:bg-blue-500/10 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-white/15 dark:bg-blue-500/10 blur-3xl" />

      {/* Language Switcher in top right */}
      <div className="absolute top-4 right-4 z-50">
        <div className="bg-white/20 dark:bg-slate-800/40 backdrop-blur-md rounded-lg p-1 transition-colors">
          <LanguageSwitcher />
        </div>
      </div>

      <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md bg-white/95 dark:bg-slate-900/90 backdrop-blur border-white/20 dark:border-slate-800 shadow-2xl transition-all">
          <CardHeader className="space-y-3">
            <div className="flex items-center justify-center">
              <div className="h-14 w-14 rounded-2xl bg-white dark:bg-slate-800 shadow-md flex items-center justify-center overflow-hidden transition-colors">
                <img
                  src={LOGO_SRC}
                  alt="BiznesAsh logo"
                  className="h-full w-full object-cover dark:brightness-90"
                />
              </div>
            </div>

            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center text-slate-900 dark:text-white transition-colors">
                {t('loginTitle')}
              </CardTitle>
              <CardDescription className="text-center dark:text-slate-400 transition-colors">
                {t('loginDesc')}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive" className="dark:bg-destructive/20 dark:text-destructive-foreground">
                <AlertTitle>{t('loginError')}</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2 text-foreground">
                <Label htmlFor="email">{t('emailLabel')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2 text-foreground">
                <Label htmlFor="password">{t('passwordLabel')}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 transition-all font-bold"
                disabled={isLoading}
              >
                {isLoading ? t('signingIn') : t('signInButton')}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center">
            <div className="text-sm text-slate-600 dark:text-slate-400 transition-colors">
              {t('noAccount')}{" "}
              <Link
                to="/register"
                className="font-semibold text-blue-700 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors"
              >
                {t('signUpLink')}
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
