import { useNavigate } from "react-router-dom";
import { Crown, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import SecondaryNav from "@/components/SecondaryNav";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

const Subscribe = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isPremium, subscription } = useAuth();
  const { isHindi } = useLanguage();

  // Already premium — show status
  if (isPremium && subscription) {
    return (
      <div className="min-h-screen bg-background">
        <SecondaryNav title={isHindi ? "सदस्यता" : "Subscribe"} />
        <div className="flex flex-col items-center justify-center p-6 mt-16">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-success/20 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-success" />
          </div>
          <h1 className={`text-2xl font-bold text-foreground mb-2 ${isHindi ? "font-hindi" : ""}`}>
            {isHindi ? "आप प्रीमियम सदस्य हैं! 🎉" : "You're a Premium Member! 🎉"}
          </h1>
          <p className={`text-muted-foreground mb-1 ${isHindi ? "font-hindi" : ""}`}>
            {isHindi ? "प्लान: " : "Plan: "}
            <span className="font-semibold text-foreground">{subscription.plan_type}</span>
          </p>
          {subscription.expires_at && (
            <p className={`text-muted-foreground mb-6 ${isHindi ? "font-hindi" : ""}`}>
              {isHindi ? "समाप्ति: " : "Expires: "}
              <span className="font-semibold text-foreground">
                {new Date(subscription.expires_at).toLocaleDateString(isHindi ? "hi-IN" : "en-IN", {
                  day: "numeric", month: "long", year: "numeric",
                })}
              </span>
            </p>
          )}
          <Button onClick={() => navigate("/profile")} className={`w-full max-w-xs ${isHindi ? "font-hindi" : ""}`}>
            {isHindi ? "प्रोफ़ाइल देखें" : "View Profile"}
          </Button>
        </div>
      </div>
    );
  }

  const benefits = isHindi
    ? ["असीमित मिट्टी जांच", "विस्तृत AI रिपोर्ट", "व्यक्तिगत फसल सलाह", "इतिहास और तुलना"]
    : ["Unlimited soil scans", "Detailed AI reports", "Personalized crop advice", "History & comparison"];

  return (
    <div className="min-h-screen bg-background">
      <SecondaryNav title={isHindi ? "सदस्यता" : "Subscribe"} />

      <main className="flex flex-col items-center p-6 mt-4 max-w-md mx-auto">
        {/* Hero */}
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Crown className="w-8 h-8 text-primary" />
        </div>
        <h1 className={`text-2xl font-bold text-foreground text-center mb-2 ${isHindi ? "font-hindi" : ""}`}>
          {isHindi ? "प्रीमियम सदस्यता लें" : "Get Premium Access"}
        </h1>
        <p className={`text-muted-foreground text-center mb-6 ${isHindi ? "font-hindi" : ""}`}>
          {isHindi ? "सिर्फ ₹5/दिन में पूरी सुविधा" : "Full features for just ₹5/day"}
        </p>

        {/* Benefits */}
        <div className="w-full bg-accent/10 rounded-xl p-4 border border-accent/20 mb-6">
          <ul className="space-y-2">
            {benefits.map((b, i) => (
              <li key={i} className={`flex items-center gap-2 text-sm text-foreground ${isHindi ? "font-hindi" : ""}`}>
                <Sparkles className="w-4 h-4 text-primary shrink-0" />
                {b}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        {!isAuthenticated ? (
          <div className="w-full space-y-3">
            <Button
              onClick={() => navigate("/auth?redirect=/pricing")}
              className={`w-full h-12 text-base ${isHindi ? "font-hindi" : ""}`}
            >
              {isHindi ? "साइन अप / लॉग इन करें" : "Sign Up / Log In"}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <p className={`text-center text-xs text-muted-foreground ${isHindi ? "font-hindi" : ""}`}>
              {isHindi
                ? "लॉग इन के बाद UPI से भुगतान करें — स्क्रीनशॉट से तुरंत सत्यापन"
                : "After login, pay via UPI — instant verification with screenshot"}
            </p>
          </div>
        ) : (
          <div className="w-full space-y-3">
            <Button
              onClick={() => navigate("/pricing")}
              className={`w-full h-12 text-base ${isHindi ? "font-hindi" : ""}`}
            >
              {isHindi ? "प्लान चुनें और भुगतान करें" : "Choose Plan & Pay"}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <p className={`text-center text-xs text-muted-foreground ${isHindi ? "font-hindi" : ""}`}>
              {isHindi
                ? "UPI भुगतान करें → स्क्रीनशॉट अपलोड करें → तुरंत सक्रिय"
                : "Pay via UPI → Upload screenshot → Instantly activated"}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Subscribe;
