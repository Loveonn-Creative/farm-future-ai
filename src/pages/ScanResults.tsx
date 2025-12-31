import { useLocation, useNavigate, Link } from "react-router-dom";
import { CheckCircle2, AlertTriangle, Info, ArrowRight, IndianRupee, Volume2, Share2, Loader2, Sprout, Wheat, Leaf, Pill, Lightbulb, ScrollText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { toast } from "@/components/ui/sonner";
import VoiceQuestion from "@/components/VoiceQuestion";

interface Insight {
  type: "success" | "warning" | "info";
  text: string;
  detail?: string;
  action?: string;
  cost?: string;
  benefit?: string;
  details?: string;
}

interface ControlStep {
  remedy?: string;
  medicine?: string;
  how_to_make?: string;
  how_to_apply?: string;
  frequency?: string;
  dosage?: string;
  timing?: string;
  cost?: string;
  when_needed?: string;
}

interface DiseaseInfo {
  name: string | null;
  severity: string;
  affected_area?: string;
}

interface AnalysisData {
  soil_type?: string;
  crop_type?: string;
  ph_level?: number;
  nitrogen_level?: string;
  phosphorus_level?: string;
  potassium_level?: string;
  organic_matter_percentage?: number;
  moisture_percentage?: number;
  confidence_score?: number;
  precision_level?: string;
  analysis_summary?: string;
  recommendations?: string[];
  insights?: Insight[];
  crop_recommendations?: Array<{ crop: string; reason: string }>;
  is_invalid_image?: boolean;
  primary_action?: {
    text: string;
    cost?: string;
    benefit?: string;
  };
  // Enhanced crop disease fields
  growth_stage?: string;
  growth_stage_detail?: string;
  health_status?: string;
  disease_detected?: DiseaseInfo;
  pest_detected?: DiseaseInfo;
  deficiency?: string;
  control_steps?: {
    free_remedies?: ControlStep[];
    paid_remedies?: ControlStep[];
  };
  stage_warning?: string;
}

const ScanResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { analysis, category } = (location.state as { analysis: AnalysisData; category: string }) || {};
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Generate speech text from insights
  const generateSpeechText = (): string => {
    const parts: string[] = [];
    
    if (analysis?.soil_type) {
      parts.push(`आपकी मिट्टी ${analysis.soil_type} है।`);
    }
    
    const insights = generateInsights();
    insights.forEach(insight => {
      parts.push(insight.text + "।");
      if (insight.action) {
        parts.push(insight.action + "।");
      }
    });
    
    if (analysis?.recommendations && analysis.recommendations.length > 0) {
      parts.push("सलाह:");
      analysis.recommendations.slice(0, 2).forEach(rec => {
        parts.push(rec + "।");
      });
    }
    
    return parts.join(" ");
  };

  // Play voice using ElevenLabs TTS
  const playVoice = async () => {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    setIsLoading(true);
    try {
      const text = generateSpeechText();
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ text }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate voice");
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.onerror = () => {
        setIsPlaying(false);
        toast.error("आवाज़ चलाने में समस्या हुई");
      };
      
      await audio.play();
      setIsPlaying(true);
    } catch (error) {
      console.error("TTS error:", error);
      toast.error("आवाज़ नहीं चला सकते");
    } finally {
      setIsLoading(false);
    }
  };

  // Share via WhatsApp
  const shareOnWhatsApp = () => {
    const insights = generateInsights();
    let message = "🌾 *DataKhet मिट्टी जांच रिपोर्ट*\n\n";
    
    if (analysis?.soil_type) {
      message += `मिट्टी: ${analysis.soil_type}\n`;
    }
    
    if (analysis?.confidence_score) {
      message += `सटीकता: ${analysis.confidence_score}%\n\n`;
    }
    
    message += "*जांच परिणाम:*\n";
    insights.forEach(insight => {
      const icon = insight.type === "success" ? "✅" : insight.type === "warning" ? "⚠️" : "ℹ️";
      message += `${icon} ${insight.text}`;
      if (insight.action) {
        message += ` → ${insight.action}`;
      }
      message += "\n";
    });
    
    message += "\n📱 DataKhet ऐप से अपनी मिट्टी जांचें!";
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  if (!analysis) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <p className="text-muted-foreground font-hindi">कोई परिणाम नहीं मिला</p>
        <Button onClick={() => navigate("/")} className="mt-4 font-hindi">
          वापस जाएं
        </Button>
      </div>
    );
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0" />;
      case "warning":
        return <AlertTriangle className="w-6 h-6 text-warning flex-shrink-0" />;
      default:
        return <Info className="w-6 h-6 text-info flex-shrink-0" />;
    }
  };

  // Generate clearer, actionable insights
  const generateInsights = (): Insight[] => {
    if (analysis.insights && analysis.insights.length > 0) {
      return analysis.insights;
    }

    const insights: Insight[] = [];

    // Nitrogen insight with action
    if (analysis.nitrogen_level) {
      const level = analysis.nitrogen_level.toLowerCase();
      if (level.includes("low") || level.includes("कम")) {
        insights.push({
          type: "warning",
          text: "खाद की कमी है",
          action: "10kg यूरिया डालें",
          cost: "₹200",
          benefit: "₹2000 की फसल बचेगी",
        });
      } else if (level.includes("high") || level.includes("अधिक")) {
        insights.push({
          type: "success",
          text: "खाद पर्याप्त है",
          action: "खाद न डालें, पैसे बचाएं",
        });
      } else {
        insights.push({
          type: "success",
          text: "खाद सही है",
          action: "अगले हफ्ते फिर जांचें",
        });
      }
    }

    // Moisture insight with action
    if (analysis.moisture_percentage !== undefined) {
      if (analysis.moisture_percentage < 30) {
        insights.push({
          type: "warning",
          text: "पानी कम है",
          action: "आज शाम सिंचाई करें",
        });
      } else if (analysis.moisture_percentage > 70) {
        insights.push({
          type: "info",
          text: "पानी ज़्यादा है",
          action: "2-3 दिन सिंचाई बंद रखें",
        });
      } else {
        insights.push({
          type: "success",
          text: "पानी सही है",
          action: "आज सिंचाई न करें",
        });
      }
    }

    // pH insight with action
    if (analysis.ph_level !== undefined) {
      if (analysis.ph_level < 6) {
        insights.push({
          type: "warning",
          text: "मिट्टी तेजाबी है",
          action: "50kg चूना डालें",
          cost: "₹300",
        });
      } else if (analysis.ph_level > 8) {
        insights.push({
          type: "warning",
          text: "मिट्टी क्षारीय है",
          action: "जिप्सम डालें",
        });
      } else {
        insights.push({
          type: "success",
          text: "मिट्टी संतुलित है",
        });
      }
    }

    return insights.slice(0, 4);
  };

  const insights = generateInsights();
  
  // Find the primary action (first warning, or first insight)
  const primaryAction = analysis.primary_action || 
    insights.find(i => i.type === "warning") || 
    insights[0];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header with Voice & Share */}
      <header className="bg-gradient-earth text-primary-foreground p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold font-hindi flex items-center gap-2">
            {category === "crop" ? (
              <Sprout className="w-5 h-5 animate-sprout" />
            ) : (
              <Wheat className="w-5 h-5 animate-grow" />
            )}
            {category === "crop" ? "फसल जांच" : "मिट्टी जांच"}
          </h1>
          <div className="flex items-center gap-2">
            {/* Voice button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={playVoice}
              disabled={isLoading}
              className="text-primary-foreground hover:bg-primary-foreground/20 transition-transform hover:scale-105"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Volume2 className={`w-5 h-5 ${isPlaying ? "animate-pulse-gentle" : ""}`} />
              )}
            </Button>
            {/* WhatsApp Share */}
            <Button
              variant="ghost"
              size="icon"
              onClick={shareOnWhatsApp}
              className="text-primary-foreground hover:bg-primary-foreground/20 transition-transform hover:scale-105"
            >
              <Share2 className="w-5 h-5" />
            </Button>
            {analysis.confidence_score !== undefined && analysis.confidence_score > 0 && (
              <span className="text-sm bg-primary-foreground/20 px-2 py-1 rounded-full animate-slide-up">
                {analysis.confidence_score}% सही
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="p-4 space-y-4">
        {/* Type badge with growth stage */}
        {(analysis.soil_type || analysis.crop_type) && (
          <div className="bg-card rounded-xl p-4 shadow-soft animate-slide-up">
            <div className="flex items-center justify-between">
              <span className="text-lg font-hindi font-semibold text-foreground flex items-center gap-2">
                {category === "crop" ? (
                  <Sprout className="w-5 h-5 text-accent animate-grow" />
                ) : (
                  <Wheat className="w-5 h-5 text-primary animate-pulse-gentle" />
                )}
                {analysis.soil_type || analysis.crop_type}
              </span>
              {analysis.health_status && (
                <span className={`text-xs px-2 py-1 rounded-full font-hindi transition-all ${
                  analysis.health_status === "स्वस्थ" 
                    ? "bg-success/10 text-success animate-glow" 
                    : analysis.health_status === "गंभीर"
                    ? "bg-destructive/10 text-destructive animate-shake-gentle"
                    : "bg-warning/10 text-warning animate-pulse-gentle"
                }`}>
                  {analysis.health_status}
                </span>
              )}
            </div>
            {/* Growth stage */}
            {analysis.growth_stage && (
              <div className="mt-2 pt-2 border-t border-border">
                <p className="text-sm text-muted-foreground font-hindi flex items-center gap-1">
                  <Leaf className="w-3 h-3 text-accent" />
                  अवस्था: <span className="text-foreground font-medium">{analysis.growth_stage}</span>
                </p>
                {analysis.growth_stage_detail && (
                  <p className="text-xs text-muted-foreground font-hindi mt-1">
                    {analysis.growth_stage_detail}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Stage Warning */}
        {analysis.stage_warning && (
          <div className="bg-warning/10 border border-warning/20 rounded-xl p-4 animate-slide-up">
            <p className="text-sm font-hindi text-warning flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 animate-bounce-soft" />
              {analysis.stage_warning}
            </p>
          </div>
        )}

        {/* Disease/Pest Alert */}
        {(analysis.disease_detected?.name || analysis.pest_detected?.name) && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 animate-slide-up">
            <h3 className="font-semibold font-hindi text-destructive flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 animate-shake-gentle" />
              {analysis.disease_detected?.name ? "रोग पहचाना गया" : "कीट पहचाना गया"}
            </h3>
            <div className="space-y-1">
              <p className="font-hindi text-foreground">
                <span className="font-medium">{analysis.disease_detected?.name || analysis.pest_detected?.name}</span>
              </p>
              {(analysis.disease_detected?.severity || analysis.pest_detected?.severity) && (
                <p className="text-sm font-hindi">
                  गंभीरता: <span className={`font-medium ${
                    (analysis.disease_detected?.severity || analysis.pest_detected?.severity) === "गंभीर" 
                      ? "text-destructive" 
                      : "text-warning"
                  }`}>
                    {analysis.disease_detected?.severity || analysis.pest_detected?.severity}
                  </span>
                  {analysis.disease_detected?.affected_area && (
                    <span className="text-muted-foreground"> ({analysis.disease_detected.affected_area} प्रभावित)</span>
                  )}
                </p>
              )}
            </div>
          </div>
        )}

        {/* PRIMARY ACTION - Big card */}
        {primaryAction && (
          <div className="bg-gradient-earth rounded-xl p-5 text-primary-foreground animate-sunrise">
            <p className="text-sm opacity-80 mb-1 font-hindi">आज यह करें:</p>
            <p className="text-xl font-bold font-hindi mb-2">
              {(primaryAction as Insight).action || primaryAction.text}
            </p>
            {(primaryAction.cost || primaryAction.benefit) && (
              <div className="flex items-center gap-4 mt-3 text-sm flex-wrap">
                {primaryAction.cost && (
                  <span className="flex items-center gap-1 bg-primary-foreground/20 px-2 py-1 rounded">
                    <IndianRupee className="w-3 h-3" />
                    लागत: {primaryAction.cost}
                  </span>
                )}
                {primaryAction.benefit && (
                  <span className="flex items-center gap-1 bg-success/30 px-2 py-1 rounded">
                    फायदा: {primaryAction.benefit}
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Control Steps - Free Remedies First */}
        {analysis.control_steps?.free_remedies && analysis.control_steps.free_remedies.length > 0 && (
          <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-lg font-semibold font-hindi mb-3 flex items-center gap-2">
              <Leaf className="w-5 h-5 text-success animate-grow" /> मुफ्त/घरेलू उपाय
            </h2>
            <div className="space-y-3">
              {analysis.control_steps.free_remedies.map((step, index) => (
                <div key={index} className="bg-success/5 border border-success/20 rounded-xl p-4">
                  <p className="font-semibold font-hindi text-foreground">{step.remedy}</p>
                  {step.how_to_make && (
                    <p className="text-sm text-muted-foreground font-hindi mt-1">
                      <span className="text-success">बनाएं:</span> {step.how_to_make}
                    </p>
                  )}
                  {step.how_to_apply && (
                    <p className="text-sm text-muted-foreground font-hindi mt-1">
                      <span className="text-success">लगाएं:</span> {step.how_to_apply}
                    </p>
                  )}
                  {step.frequency && (
                    <p className="text-sm text-muted-foreground font-hindi mt-1">
                      <span className="text-success">कितनी बार:</span> {step.frequency}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Control Steps - Paid Remedies */}
        {analysis.control_steps?.paid_remedies && analysis.control_steps.paid_remedies.length > 0 && (
          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-lg font-semibold font-hindi mb-3 flex items-center gap-2">
              <Pill className="w-5 h-5 text-primary animate-pulse-gentle" /> दवाई (अगर घरेलू उपाय से फायदा न हो)
            </h2>
            <div className="space-y-3">
              {analysis.control_steps.paid_remedies.map((step, index) => (
                <div key={index} className="bg-muted/50 border border-border rounded-xl p-4">
                  <div className="flex items-start justify-between">
                    <p className="font-semibold font-hindi text-foreground">{step.medicine}</p>
                    {step.cost && (
                      <span className="text-xs bg-muted px-2 py-0.5 rounded-full">{step.cost}</span>
                    )}
                  </div>
                  {step.dosage && (
                    <p className="text-sm text-muted-foreground font-hindi mt-1">
                      <span className="text-primary">मात्रा:</span> {step.dosage}
                    </p>
                  )}
                  {step.timing && (
                    <p className="text-sm text-muted-foreground font-hindi mt-1">
                      <span className="text-primary">समय:</span> {step.timing}
                    </p>
                  )}
                  {step.when_needed && (
                    <p className="text-xs text-muted-foreground font-hindi mt-2 italic">
                      {step.when_needed}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other insights - Simpler cards */}
        {insights.length > 1 && (
          <div className="space-y-3">
            {insights.slice(1).map((insight, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 bg-card rounded-xl shadow-soft animate-slide-up"
                style={{ animationDelay: `${(index + 1) * 0.08}s` }}
              >
                {getInsightIcon(insight.type)}
                <div className="flex-1">
                  <p className="font-hindi text-foreground font-medium">{insight.text}</p>
                  {insight.action && (
                    <p className="text-sm text-primary font-hindi mt-1">
                      → {insight.action}
                    </p>
                  )}
                  {insight.details && (
                    <p className="text-xs text-muted-foreground font-hindi mt-1">
                      {insight.details}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Crop recommendations if available */}
        {analysis.crop_recommendations && analysis.crop_recommendations.length > 0 && (
          <div className="mt-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <h2 className="text-lg font-semibold font-hindi mb-3 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-warning animate-glow" /> इस मिट्टी के लिए सही फसल
            </h2>
            <div className="space-y-2">
              {analysis.crop_recommendations.slice(0, 3).map((rec, index) => (
                <div key={index} className="bg-accent/10 rounded-lg p-3 border border-accent/20">
                  <span className="font-semibold font-hindi text-foreground">{rec.crop}</span>
                  <span className="text-muted-foreground font-hindi"> — {rec.reason}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Voice Q&A Section */}
        <div className="mt-6 animate-fade-in">
          <VoiceQuestion soilData={analysis} />
        </div>

        {/* Subscribe CTA - Subtle */}
        <div className="mt-8 p-4 bg-muted/50 rounded-xl text-center animate-fade-in border border-border">
          <p className="text-muted-foreground font-hindi text-sm">
            रोज़ यह सलाह चाहिए अपनी जमीन के लिए?
          </p>
          <Link to="/subscribe">
            <Button variant="link" className="mt-1 font-hindi text-primary">
              पूरी सुविधा लें
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>

        {/* New scan button */}
        <div className="text-center mt-6">
          <Button onClick={() => navigate("/")} size="lg" className="font-hindi w-full max-w-xs">
            नई जांच करें
          </Button>
        </div>
      </main>
    </div>
  );
};

export default ScanResults;
