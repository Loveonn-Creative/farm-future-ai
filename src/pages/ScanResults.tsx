import { useLocation, useNavigate, Link } from "react-router-dom";
import { CheckCircle2, AlertTriangle, Info, ArrowRight, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Insight {
  type: "success" | "warning" | "info";
  text: string;
  detail?: string;
  action?: string;
  cost?: string;
  benefit?: string;
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
}

const ScanResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { analysis, category } = (location.state as { analysis: AnalysisData; category: string }) || {};

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
      {/* Header - Simple */}
      <header className="bg-gradient-earth text-primary-foreground p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold font-hindi">
            {category === "crop" ? "🌱 फसल जांच" : "🌾 मिट्टी जांच"}
          </h1>
          {analysis.confidence_score !== undefined && analysis.confidence_score > 0 && (
            <span className="text-sm bg-primary-foreground/20 px-2 py-1 rounded-full">
              {analysis.confidence_score}% सही
            </span>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="p-4 space-y-4">
        {/* Type badge */}
        {(analysis.soil_type || analysis.crop_type) && (
          <div className="bg-card rounded-xl p-4 shadow-soft animate-fade-in">
            <span className="text-lg font-hindi font-semibold text-foreground">
              {category === "crop" ? "🌱 " : "🌾 "}
              {analysis.soil_type || analysis.crop_type}
            </span>
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
              <div className="flex items-center gap-4 mt-3 text-sm">
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

        {/* Other insights - Simpler cards */}
        <div className="space-y-3">
          {insights.slice(1).map((insight, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-4 bg-card rounded-xl shadow-soft animate-sunrise"
              style={{ animationDelay: `${(index + 1) * 0.1}s` }}
            >
              {getInsightIcon(insight.type)}
              <div className="flex-1">
                <p className="font-hindi text-foreground font-medium">{insight.text}</p>
                {insight.action && (
                  <p className="text-sm text-primary font-hindi mt-1">
                    → {insight.action}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Crop recommendations if available */}
        {analysis.crop_recommendations && analysis.crop_recommendations.length > 0 && (
          <div className="mt-6 animate-fade-in">
            <h2 className="text-lg font-semibold font-hindi mb-3 flex items-center gap-2">
              <span>💡</span> इस मिट्टी के लिए सही फसल
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
