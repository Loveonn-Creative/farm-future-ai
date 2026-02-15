import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Sprout, Mail, Lock, Phone, Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/profile";
  const { signIn, signUp, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const { isHindi } = useLanguage();

  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate(redirect, { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "forgot") {
      if (!email) return;
      setLoading(true);
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/profile`,
        });
        if (error) {
          toast({
            title: isHindi ? "त्रुटि" : "Error",
            description: error.message,
            variant: "destructive",
          });
        } else {
          setResetSent(true);
        }
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!email || !password) return;

    setLoading(true);
    try {
      if (mode === "login") {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: isHindi ? "लॉगिन विफल" : "Login Failed",
            description: error,
            variant: "destructive",
          });
        } else {
          navigate(redirect, { replace: true });
        }
      } else {
        const { error } = await signUp(email, password, phone);
        if (error) {
          toast({
            title: isHindi ? "पंजीकरण विफल" : "Signup Failed",
            description: error,
            variant: "destructive",
          });
        } else {
          setEmailSent(true);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  if (resetSent) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
        <div className="w-full max-w-sm text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center">
            <Mail className="w-10 h-10 text-primary" />
          </div>
          <h1 className={`text-2xl font-bold text-foreground mb-2 ${isHindi ? "font-hindi" : ""}`}>
            {isHindi ? "रीसेट लिंक भेजा गया! 📧" : "Reset Link Sent! 📧"}
          </h1>
          <p className={`text-muted-foreground mb-6 ${isHindi ? "font-hindi" : ""}`}>
            {isHindi
              ? "कृपया अपना ईमेल जांचें और पासवर्ड रीसेट लिंक पर क्लिक करें।"
              : "Please check your email and click the password reset link."}
          </p>
          <Button onClick={() => { setResetSent(false); setMode("login"); }} variant="outline" className={`w-full ${isHindi ? "font-hindi" : ""}`}>
            {isHindi ? "लॉगिन पर जाएं" : "Go to Login"}
          </Button>
        </div>
      </div>
    );
  }

  if (emailSent) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
        <div className="w-full max-w-sm text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center">
            <Mail className="w-10 h-10 text-primary" />
          </div>
          <h1 className={`text-2xl font-bold text-foreground mb-2 ${isHindi ? "font-hindi" : ""}`}>
            {isHindi ? "ईमेल भेजा गया! 📧" : "Email Sent! 📧"}
          </h1>
          <p className={`text-muted-foreground mb-6 ${isHindi ? "font-hindi" : ""}`}>
            {isHindi
              ? "कृपया अपना ईमेल जांचें और लिंक पर क्लिक करके पुष्टि करें।"
              : "Please check your email and click the confirmation link."}
          </p>
          <Button onClick={() => { setEmailSent(false); setMode("login"); }} variant="outline" className={`w-full ${isHindi ? "font-hindi" : ""}`}>
            {isHindi ? "लॉगिन पर जाएं" : "Go to Login"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-gradient-earth text-primary-foreground p-6 text-center">
        <Link to="/" className="inline-flex items-center gap-2 mb-2">
          <Sprout className="w-6 h-6" />
          <span className="font-bold text-lg">DataKhet</span>
        </Link>
        <h1 className={`text-xl font-bold ${isHindi ? "font-hindi" : ""}`}>
          {mode === "forgot"
            ? isHindi ? "पासवर्ड रीसेट करें" : "Reset Password"
            : mode === "login"
              ? isHindi ? "अपने खाते में लॉगिन करें" : "Sign In to Your Account"
              : isHindi ? "नया खाता बनाएं" : "Create Your Account"}
        </h1>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5">
          {/* Email */}
          <div className="space-y-2">
            <label className={`text-sm text-foreground flex items-center gap-2 ${isHindi ? "font-hindi" : ""}`}>
              <Mail className="w-4 h-4 text-muted-foreground" />
              {isHindi ? "ईमेल" : "Email"}
            </label>
            <Input
              type="email"
              placeholder="farmer@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12"
              required
            />
          </div>

          {/* Password (not shown in forgot mode) */}
          {mode !== "forgot" && (
            <div className="space-y-2">
              <label className={`text-sm text-foreground flex items-center gap-2 ${isHindi ? "font-hindi" : ""}`}>
                <Lock className="w-4 h-4 text-muted-foreground" />
                {isHindi ? "पासवर्ड" : "Password"}
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 pr-10"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Forgot password link (login mode only) */}
          {mode === "login" && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => setMode("forgot")}
                className={`text-sm text-primary hover:underline ${isHindi ? "font-hindi" : ""}`}
              >
                {isHindi ? "पासवर्ड भूल गए?" : "Forgot password?"}
              </button>
            </div>
          )}

          {/* Phone (signup only) */}
          {mode === "signup" && (
            <div className="space-y-2">
              <label className={`text-sm text-foreground flex items-center gap-2 ${isHindi ? "font-hindi" : ""}`}>
                <Phone className="w-4 h-4 text-muted-foreground" />
                {isHindi ? "फ़ोन नंबर (वैकल्पिक)" : "Phone (optional)"}
              </label>
              <Input
                type="tel"
                placeholder="9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                className="h-12"
                maxLength={10}
              />
            </div>
          )}

          {/* Submit */}
          <Button type="submit" disabled={loading} className={`w-full h-12 text-lg ${isHindi ? "font-hindi" : ""}`}>
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : mode === "forgot" ? (
              isHindi ? "रीसेट लिंक भेजें" : "Send Reset Link"
            ) : mode === "login" ? (
              isHindi ? "लॉगिन करें" : "Sign In"
            ) : (
              isHindi ? "खाता बनाएं" : "Create Account"
            )}
          </Button>

          {/* Toggle login/signup/forgot */}
          <div className="text-center space-y-2">
            {mode === "forgot" ? (
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`text-sm text-primary hover:underline ${isHindi ? "font-hindi" : ""}`}
              >
                {isHindi ? "← लॉगिन पर वापस जाएं" : "← Back to Login"}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
                className={`text-sm text-primary hover:underline ${isHindi ? "font-hindi" : ""}`}
              >
                {mode === "login"
                  ? isHindi ? "नया खाता बनाएं →" : "Create an account →"
                  : isHindi ? "पहले से खाता है? लॉगिन करें →" : "Already have an account? Sign in →"}
              </button>
            )}
          </div>

          {/* Continue as guest */}
          <div className="pt-4 border-t border-border text-center">
            <Link
              to="/"
              className={`text-sm text-muted-foreground hover:text-foreground ${isHindi ? "font-hindi" : ""}`}
            >
              {isHindi ? "बिना खाते के जारी रखें →" : "Continue as guest →"}
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Auth;
