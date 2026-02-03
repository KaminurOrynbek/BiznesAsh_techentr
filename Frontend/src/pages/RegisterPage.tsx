import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";

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

// const LOGO_SRC = "/logo.jpeg"; // Frontend/public/logo.jpeg
const LOGO_SRC = new URL("../assets/logo.jpeg", import.meta.url).toString(); // src/assets/logo.jpeg

export const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      await register(username, email, password);
      navigate("/feed");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-blue-600 to-sky-500" />
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.35),transparent_55%)]" />
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-white/15 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-white/15 blur-3xl" />

      <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md bg-white/95 backdrop-blur border-white/20 shadow-2xl">
          <CardHeader className="space-y-3">
            <div className="flex items-center justify-center">
              <div className="h-14 w-14 rounded-2xl bg-white shadow-md flex items-center justify-center overflow-hidden">
                <img
                  src={LOGO_SRC}
                  alt="BiznesAsh logo"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center text-slate-900">
                Create an account
              </CardTitle>
              <CardDescription className="text-center">
                Join the BiznesAsh community to start your journey
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Registration error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Almas K."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
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

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Sign Up"}
              </Button>
            </form>

            <div className="mt-4 text-xs text-center text-slate-600">
              By clicking continue, you agree to our{" "}
              <span className="underline hover:text-slate-900 cursor-pointer">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="underline hover:text-slate-900 cursor-pointer">
                Privacy Policy
              </span>
              .
            </div>
          </CardContent>

          <CardFooter className="flex justify-center">
            <div className="text-sm text-slate-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-blue-700 hover:text-blue-600"
              >
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
