import { useLocation, useNavigate, Link } from "react-router-dom";
import { CheckCircle2, AlertTriangle, Info, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Insight {
  type: "success" | "warning" | "info";
  text: string;
  detail?: string;
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
}

const ScanResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { analysis, category } = (location.state as { analysis: AnalysisData; category: string }) || {};

  if (!analysis) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <p className="text-muted-foreground font-hindi">कोई परिणाम नहीं मिला</p>
        <Button onClick={() => navigate("/")} className="mt-4">
          वापस जाएं
        </Button>
      </div>
    );
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-success" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-warning" />;
      default:
        return <Info className="w-5 h-5 text-info" />;
    }
  };

  // Generate insights from analysis if not provided
  const generateInsights = (): Insight[] => {
    if (analysis.insights && analysis.insights.length > 0) {
      return analysis.insights;
    }

    const insights: Insight[] = [];

    // Nitrogen insight
    if (analysis.nitrogen_level) {
      const level = analysis.nitrogen_level.toLowerCase();
      if (level.includes("low") || level.includes("कम")) {
        insights.push({
          type: "warning",
          text: "नाइट्रोजन कम → फसल की बढ़त धीमी हो सकती है",
          detail: "यूरिया या जैविक खाद डालें",
        });
      } else if (level.includes("high") || level.includes("अधिक")) {
        insights.push({
          type: "info",
          text: "नाइट्रोजन पर्याप्त → अतिरिक्त खाद की जरूरत नहीं",
        });
      } else {
        insights.push({
          type: "success",
          text: "नाइट्रोजन सही → फसल की बढ़त अच्छी रहेगी",
        });
      }
    }

    // Moisture insight
    if (analysis.moisture_percentage !== undefined) {
      if (analysis.moisture_percentage < 30) {
        insights.push({
          type: "warning",
          text: "नमी कम → आज सिंचाई करें",
        });
      } else if (analysis.moisture_percentage > 70) {
        insights.push({
          type: "info",
          text: "नमी अधिक → 2-3 दिन सिंचाई न करें",
        });
      } else {
        insights.push({
          type: "success",
          text: "पानी सही → आज सिंचाई की जरूरत नहीं",
        });
      }
    }

    // pH insight
    if (analysis.ph_level !== undefined) {
      if (analysis.ph_level < 6) {
        insights.push({
          type: "warning",
          text: "मिट्टी तेजाबी → चूना डालने से सुधार होगा",
        });
      } else if (analysis.ph_level > 8) {
        insights.push({
          type: "warning",
          text: "मिट्टी क्षारीय → जिप्सम से सुधार करें",
        });
      } else {
        insights.push({
          type: "success",
          text: "pH सही → ज्यादातर फसलों के लिए उपयुक्त",
        });
      }
    }

    // Add a general recommendation if we have few insights
    if (insights.length < 2 && analysis.recommendations && analysis.recommendations.length > 0) {
      insights.push({
        type: "info",
        text: analysis.recommendations[0],
      });
    }

    return insights.slice(0, 4); // Max 4 insights
  };

  const insights = generateInsights();

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-gradient-earth text-primary-foreground p-4">
        <h1 className="text-xl font-bold font-hindi text-center">
          {category === "crop" ? "फसल" : "मिट्टी"} स्वास्थ्य — आज
        </h1>
        {analysis.confidence_score && (
          <p className="text-center text-sm opacity-80 mt-1">
            विश्वसनीयता: {analysis.confidence_score}%
          </p>
        )}
      </header>

      {/* Main insights */}
      <main className="p-4 space-y-4">
        {/* Type badge */}
        {(analysis.soil_type || analysis.crop_type) && (
          <div className="bg-muted rounded-lg p-3 text-center animate-fade-in">
            <span className="text-lg font-hindi">
              {category === "crop" ? "🌱 " : "🌾 "}
              {analysis.soil_type || analysis.crop_type}
            </span>
          </div>
        )}

        {/* Insights list */}
        <div className="space-y-3">
          {insights.map((insight, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-4 bg-card rounded-lg shadow-soft animate-sunrise"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {getInsightIcon(insight.type)}
              <div className="flex-1">
                <p className="font-hindi text-foreground">{insight.text}</p>
                {insight.detail && (
                  <p className="text-sm text-muted-foreground mt-1 font-hindi">
                    {insight.detail}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Crop recommendations if available */}
        {analysis.crop_recommendations && analysis.crop_recommendations.length > 0 && (
          <div className="mt-6 animate-fade-in">
            <h2 className="text-lg font-semibold font-hindi mb-3">
              💡 आपकी मिट्टी के लिए सही फसल
            </h2>
            <div className="space-y-2">
              {analysis.crop_recommendations.slice(0, 3).map((rec, index) => (
                <div key={index} className="bg-accent/10 rounded-lg p-3">
                  <span className="font-semibold font-hindi">{rec.crop}</span>
                  <span className="text-muted-foreground font-hindi"> — {rec.reason}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Value proposition - subtle */}
        <div className="mt-8 p-4 bg-muted/50 rounded-lg text-center animate-fade-in">
          <p className="text-muted-foreground font-hindi text-sm">
            रोज़ यह सलाह चाहिए अपनी जमीन के लिए?
          </p>
          <Link to="/pricing">
            <Button variant="link" className="mt-2 font-hindi">
              पूरी सुविधा जारी रखें
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>

        {/* New scan button */}
        <div className="text-center mt-6">
          <Button onClick={() => navigate("/")} size="lg" className="font-hindi">
            नई जांच करें
          </Button>
        </div>
      </main>
    </div>
  );
};

export default ScanResults;