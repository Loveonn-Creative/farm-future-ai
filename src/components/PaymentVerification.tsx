import { useState } from "react";
import { Upload, CheckCircle, XCircle, Loader2, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PaymentVerificationProps {
  selectedPlan: string | null;
}

const PLAN_LABELS: Record<string, { hi: string; en: string; amount: string }> = {
  daily: { hi: "रोज़ाना", en: "Daily", amount: "₹5" },
  "6month": { hi: "6 महीने", en: "6 Months", amount: "₹499" },
  "1year": { hi: "1 साल", en: "1 Year", amount: "₹1499" },
};

const PaymentVerification = ({ selectedPlan }: PaymentVerificationProps) => {
  const { isHindi } = useLanguage();
  const { user, refreshSubscription } = useAuth();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState<{ verified: boolean; message: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.size > 5 * 1024 * 1024) {
      toast({ title: isHindi ? "फ़ाइल 5MB से छोटी होनी चाहिए" : "File must be under 5MB", variant: "destructive" });
      return;
    }

    setFile(selected);
    setResult(null);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(selected);
  };

  const handleVerify = async () => {
    if (!file || !selectedPlan || !user) return;

    setVerifying(true);
    setResult(null);

    try {
      // Convert to base64
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve) => {
        reader.onloadend = () => {
          const result = reader.result as string;
          resolve(result.split(",")[1]); // Remove data:image/...;base64, prefix
        };
        reader.readAsDataURL(file);
      });

      const { data, error } = await supabase.functions.invoke("verify-payment", {
        body: {
          screenshotBase64: base64,
          planType: selectedPlan,
          userId: user.id,
        },
      });

      if (error) throw error;

      setResult({ verified: data.verified, message: data.message });

      if (data.verified) {
        await refreshSubscription();
        toast({ title: isHindi ? "सदस्यता सक्रिय! 🎉" : "Subscription activated! 🎉" });
      }
    } catch (err) {
      console.error("Verification error:", err);
      setResult({
        verified: false,
        message: isHindi ? "सत्यापन में त्रुटि। कृपया दोबारा कोशिश करें।" : "Verification failed. Please try again.",
      });
    } finally {
      setVerifying(false);
    }
  };

  if (!selectedPlan) return null;

  const planInfo = PLAN_LABELS[selectedPlan];

  return (
    <div className="mt-6 bg-card rounded-xl border-2 border-primary/20 p-5 animate-sunrise">
      <h3 className={`font-semibold text-foreground mb-2 ${isHindi ? "font-hindi" : ""}`}>
        {isHindi ? `${planInfo.hi} (${planInfo.amount}) - भुगतान सत्यापन` : `${planInfo.en} (${planInfo.amount}) - Payment Verification`}
      </h3>
      <p className={`text-sm text-muted-foreground mb-4 ${isHindi ? "font-hindi" : ""}`}>
        {isHindi
          ? "UPI से भुगतान करने के बाद, स्क्रीनशॉट अपलोड करें। AI तुरंत सत्यापित करेगा।"
          : "After paying via UPI, upload the screenshot. AI will verify instantly."}
      </p>

      {/* File upload */}
      <label className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/30 rounded-lg p-6 cursor-pointer hover:border-primary/50 transition-colors">
        {preview ? (
          <img src={preview} alt="Screenshot" className="max-h-48 rounded-lg object-contain mb-2" />
        ) : (
          <>
            <Camera className="w-10 h-10 text-muted-foreground mb-2" />
            <span className={`text-sm text-muted-foreground ${isHindi ? "font-hindi" : ""}`}>
              {isHindi ? "स्क्रीनशॉट चुनें या फोटो लें" : "Select screenshot or take photo"}
            </span>
          </>
        )}
        <input
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>

      {file && (
        <Button
          onClick={handleVerify}
          disabled={verifying}
          className={`w-full mt-4 ${isHindi ? "font-hindi" : ""}`}
          size="lg"
        >
          {verifying ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {isHindi ? "AI सत्यापित कर रहा है..." : "AI Verifying..."}
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              {isHindi ? "सत्यापित करें" : "Verify Payment"}
            </>
          )}
        </Button>
      )}

      {/* Result */}
      {result && (
        <div
          className={`mt-4 p-4 rounded-lg flex items-start gap-3 ${
            result.verified ? "bg-success/10 border border-success/30" : "bg-destructive/10 border border-destructive/30"
          }`}
        >
          {result.verified ? (
            <CheckCircle className="w-6 h-6 text-success shrink-0 mt-0.5" />
          ) : (
            <XCircle className="w-6 h-6 text-destructive shrink-0 mt-0.5" />
          )}
          <p className={`text-sm ${isHindi ? "font-hindi" : ""}`}>{result.message}</p>
        </div>
      )}
    </div>
  );
};

export default PaymentVerification;
