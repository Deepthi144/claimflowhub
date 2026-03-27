import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, type AppRole } from "@/lib/auth";
import { useTheme } from "@/lib/theme";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Shield,
  FileText,
  Moon,
  Sun,
  Loader2,
  UserCheck,
} from "lucide-react";
import { toast } from "sonner";

export default function Login() {
  const { signIn } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<AppRole>("officer");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setIsLoading(true);
    try {
      await signIn(email, password);
      toast.success("Welcome back!");
      // Role-based redirect handled by App router
    } catch (err: any) {
      toast.error(err.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemo = (role: "admin" | "officer") => {
    if (role === "admin") {
      setEmail("admin@claimflow.com");
      setPassword("Admin@123");
      setSelectedRole("admin");
    } else {
      setEmail("officer@claimflow.com");
      setPassword("Officer@123");
      setSelectedRole("officer");
    }
  };

  return (
    <div className="min-h-screen flex bg-background relative overflow-hidden">
      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-5 right-5 z-10 w-10 h-10 rounded-xl flex items-center justify-center bg-card border border-border hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
      >
        {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
      </button>

      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative items-center justify-center p-12">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-primary-foreground blur-3xl" />
          <div className="absolute bottom-32 right-16 w-56 h-56 rounded-full bg-primary-foreground blur-3xl" />
        </div>
        <div className="relative z-10 text-center max-w-md">
          <div className="w-20 h-20 rounded-2xl bg-primary-foreground/20 flex items-center justify-center mx-auto mb-8 backdrop-blur-sm">
            <FileText className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-primary-foreground mb-4 font-['Space_Grotesk']">
            ClaimFlow
          </h1>
          <p className="text-primary-foreground/80 text-lg leading-relaxed">
            Streamline your insurance claim processing with our modern, intelligent management platform.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-4">
            {[
              { label: "Fast Processing", value: "10x" },
              { label: "Accuracy Rate", value: "99%" },
              { label: "Claims Handled", value: "50K+" },
            ].map((stat) => (
              <div key={stat.label} className="bg-primary-foreground/10 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-2xl font-bold text-primary-foreground">{stat.value}</p>
                <p className="text-xs text-primary-foreground/70 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - login form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md animate-fade-in">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground font-['Space_Grotesk']">
              ClaimFlow
            </span>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-foreground font-['Space_Grotesk'] mb-1">
              Welcome back
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              Insurance Claim Management System
            </p>

            {/* Role Selection */}
            <div className="mb-6">
              <Label className="text-xs text-muted-foreground uppercase tracking-wider mb-3 block">
                Login as
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedRole("officer")}
                  className={`flex items-center gap-2.5 p-3.5 rounded-xl border-2 transition-all text-left ${
                    selectedRole === "officer"
                      ? "border-primary bg-primary/5 text-foreground"
                      : "border-border text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  <UserCheck className="w-5 h-5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Claims Officer</p>
                    <p className="text-xs opacity-70">Process claims</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole("admin")}
                  className={`flex items-center gap-2.5 p-3.5 rounded-xl border-2 transition-all text-left ${
                    selectedRole === "admin"
                      ? "border-primary bg-primary/5 text-foreground"
                      : "border-border text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  <Shield className="w-5 h-5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Administrator</p>
                    <p className="text-xs opacity-70">Full access</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full h-11" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-5">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary font-medium hover:underline">
                Sign Up
              </Link>
            </p>

            {/* Demo credentials */}
            <div className="mt-6 pt-5 border-t border-border">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3 text-center">
                Demo Credentials
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => fillDemo("admin")}
                  className="text-xs p-2.5 rounded-lg bg-accent hover:bg-accent/80 transition-colors text-center"
                >
                  <p className="font-medium text-foreground">Admin</p>
                  <p className="text-muted-foreground mt-0.5">admin@claimflow.com</p>
                </button>
                <button
                  type="button"
                  onClick={() => fillDemo("officer")}
                  className="text-xs p-2.5 rounded-lg bg-accent hover:bg-accent/80 transition-colors text-center"
                >
                  <p className="font-medium text-foreground">Officer</p>
                  <p className="text-muted-foreground mt-0.5">officer@claimflow.com</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
