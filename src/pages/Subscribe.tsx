import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, Key, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Subscribe = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [phone, setPhone] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Check if already subscribed on mount
  useState(() => {
    const subscribed = localStorage.getItem("datakhet_subscribed");
    const savedPhone = localStorage.getItem("datakhet_phone");
    if (subscribed === "true" && savedPhone) {
      setIsSubscribed(true);
      setPhone(savedPhone);
    }
  });

  const handleVerify = async () => {
    // Validate inputs
    if (!phone || phone.length < 10) {
      toast({
        title: "गलत फ़ोन नंबर",
        description: "कृपया सही 10 अंकों का फ़ोन नंबर डालें",
        variant: "destructive",
      });
      return;
    }

    if (!accessCode || accessCode.length !== 9) {
      toast({
        title: "गलत कोड",
        description: "कृपया सही 9 अंकों का कोड डालें",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);

    try {
      const { data, error } = await supabase.functions.invoke("verify-subscription", {
        body: {
          phone: phone.replace(/\D/g, "").slice(-10), // Clean phone number
          accessCode,
          sessionId: localStorage.getItem("datakhet_session"),
        },
      });

      if (error) throw error;

      if (data.success) {
        // Save to localStorage
        localStorage.setItem("datakhet_subscribed", "true");
        localStorage.setItem("datakhet_phone", phone);
        localStorage.setItem("datakhet_plan", data.plan_type || "premium");
        
        setIsSubscribed(true);
        toast({
          title: "सदस्यता सफल! 🎉",
          description: "अब आपको पूरी सुविधा मिलेगी",
        });
      } else {
        toast({
          title: "सत्यापन विफल",
          description: data.message || "फ़ोन नंबर या कोड गलत है",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast({
        title: "त्रुटि",
        description: "कृपया दोबारा कोशिश करें",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  if (isSubscribed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
        <div className="w-full max-w-sm text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-success/20 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-success" />
          </div>
          <h1 className="text-2xl font-bold font-hindi text-foreground mb-2">
            आप सदस्य हैं! 🎉
          </h1>
          <p className="text-muted-foreground font-hindi mb-6">
            फ़ोन: {phone}
          </p>
          <Button onClick={() => navigate("/")} className="font-hindi w-full">
            जांच शुरू करें
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background pb-20">
      {/* Header */}
      <header className="bg-gradient-earth text-primary-foreground p-6 text-center">
        <h1 className="text-2xl font-bold font-hindi">पूरी सुविधा लें</h1>
        <p className="text-sm opacity-80 mt-1 font-hindi">
          रोज़ की जांच • व्यक्तिगत सलाह • पूरी रिपोर्ट
        </p>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-6">
          {/* Plan info */}
          <div className="bg-accent/10 rounded-xl p-4 border border-accent/20">
            <div className="flex items-center justify-between mb-2">
              <span className="font-hindi text-foreground">प्रीमियम सदस्यता</span>
              <span className="text-xl font-bold text-primary">₹5/दिन</span>
            </div>
            <ul className="space-y-1 text-sm text-muted-foreground font-hindi">
              <li>✓ असीमित जांच</li>
              <li>✓ विस्तृत रिपोर्ट</li>
              <li>✓ व्यक्तिगत सलाह</li>
              <li>✓ इतिहास और तुलना</li>
            </ul>
          </div>

          {/* Phone input */}
          <div className="space-y-2">
            <label className="text-sm font-hindi text-foreground flex items-center gap-2">
              <Phone className="w-4 h-4 text-muted-foreground" />
              फ़ोन नंबर
            </label>
            <Input
              type="tel"
              placeholder="9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
              className="text-lg h-12 font-hindi"
              maxLength={10}
            />
          </div>

          {/* Access code input */}
          <div className="space-y-2">
            <label className="text-sm font-hindi text-foreground flex items-center gap-2">
              <Key className="w-4 h-4 text-muted-foreground" />
              आपका कोड
            </label>
            <Input
              type="text"
              placeholder="123456789"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value.replace(/\D/g, "").slice(0, 9))}
              className="text-lg h-12 tracking-widest text-center font-mono"
              maxLength={9}
            />
          </div>

          {/* Submit button */}
          <Button
            onClick={handleVerify}
            disabled={isVerifying || !phone || !accessCode}
            className="w-full h-12 text-lg font-hindi"
          >
            {isVerifying ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                सत्यापित हो रहा है...
              </>
            ) : (
              "सदस्यता लें"
            )}
          </Button>

          {/* Helper text */}
          <p className="text-center text-sm text-muted-foreground font-hindi">
            * कोड हमारे कार्यकर्ता से मिलेगा
          </p>
          <p className="text-center text-xs text-muted-foreground font-hindi">
            संपर्क: WhatsApp पर "सदस्यता" भेजें
          </p>
        </div>
      </main>
    </div>
  );
};

export default Subscribe;
