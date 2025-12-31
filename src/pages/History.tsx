import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { hi } from "date-fns/locale";
import { Loader2, ChevronDown, ChevronUp, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface ScanRecord {
  id: string;
  created_at: string;
  scan_category: string | null;
  soil_type: string | null;
  crop_type: string | null;
  confidence_score: number | null;
  comparison_note: string | null;
  analysis_summary: string | null;
  moisture_percentage: number | null;
  ph_level: number | null;
  nitrogen_level: string | null;
  recommendations: string[] | null;
  insights: unknown;
}

type TrendType = "better" | "worse" | "same" | "none";

const History = () => {
  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      const sessionId = localStorage.getItem("datakhet_session");
      if (!sessionId) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("soil_scans")
        .select("id, created_at, scan_category, soil_type, crop_type, confidence_score, comparison_note, analysis_summary, moisture_percentage, ph_level, nitrogen_level, recommendations, insights")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) {
        console.error("Error fetching history:", error);
      } else {
        setScans(data || []);
      }
      setLoading(false);
    };

    fetchHistory();
  }, []);

  // Compare current scan with previous one
  const getTrend = (current: ScanRecord, index: number): { trend: TrendType; note: string } => {
    if (index >= scans.length - 1) return { trend: "none", note: "" };
    
    const previous = scans[index + 1];
    
    // Compare moisture
    if (current.moisture_percentage !== null && previous.moisture_percentage !== null) {
      const diff = current.moisture_percentage - previous.moisture_percentage;
      if (diff > 10) return { trend: "better", note: "नमी बढ़ी" };
      if (diff < -10) return { trend: "worse", note: "नमी घटी" };
    }
    
    // Compare nitrogen
    if (current.nitrogen_level && previous.nitrogen_level) {
      const levels = { "कम": 1, "low": 1, "मध्यम": 2, "medium": 2, "अधिक": 3, "high": 3 };
      const currLevel = levels[current.nitrogen_level.toLowerCase() as keyof typeof levels] || 2;
      const prevLevel = levels[previous.nitrogen_level.toLowerCase() as keyof typeof levels] || 2;
      if (currLevel > prevLevel) return { trend: "better", note: "पोषण बढ़ा" };
      if (currLevel < prevLevel) return { trend: "worse", note: "पोषण घटा" };
    }
    
    // Compare pH
    if (current.ph_level !== null && previous.ph_level !== null) {
      const currOptimal = Math.abs(current.ph_level - 7);
      const prevOptimal = Math.abs(previous.ph_level - 7);
      if (currOptimal < prevOptimal - 0.5) return { trend: "better", note: "pH संतुलित हुआ" };
      if (currOptimal > prevOptimal + 0.5) return { trend: "worse", note: "pH असंतुलित" };
    }
    
    return { trend: "same", note: "स्थिर" };
  };

  const getTrendIcon = (trend: TrendType) => {
    switch (trend) {
      case "better":
        return <TrendingUp className="w-4 h-4 text-success" />;
      case "worse":
        return <TrendingDown className="w-4 h-4 text-destructive" />;
      case "same":
        return <Minus className="w-4 h-4 text-muted-foreground" />;
      default:
        return null;
    }
  };

  const getTrendBadge = (trend: TrendType, note: string) => {
    if (trend === "none") return null;
    
    const colors = {
      better: "bg-success/10 text-success border-success/20",
      worse: "bg-destructive/10 text-destructive border-destructive/20",
      same: "bg-muted text-muted-foreground border-border"
    };
    
    return (
      <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${colors[trend]}`}>
        {getTrendIcon(trend)}
        <span className="font-hindi">{note}</span>
      </span>
    );
  };

  // Group scans by date
  const groupByDate = (scans: ScanRecord[]) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const groups: { label: string; scans: ScanRecord[] }[] = [
      { label: "आज", scans: [] },
      { label: "कल", scans: [] },
      { label: "इस हफ्ते", scans: [] },
      { label: "पुरानी जांचें", scans: [] }
    ];

    scans.forEach(scan => {
      const scanDate = new Date(scan.created_at);
      if (scanDate.toDateString() === today.toDateString()) {
        groups[0].scans.push(scan);
      } else if (scanDate.toDateString() === yesterday.toDateString()) {
        groups[1].scans.push(scan);
      } else if (scanDate > weekAgo) {
        groups[2].scans.push(scan);
      } else {
        groups[3].scans.push(scan);
      }
    });

    return groups.filter(g => g.scans.length > 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const groupedScans = groupByDate(scans);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-gradient-earth text-primary-foreground p-4">
        <h1 className="text-xl font-bold font-hindi text-center">
          📜 पिछली जांचें
        </h1>
      </header>

      <main className="p-4">
        {scans.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground font-hindi text-lg">
              अभी तक कोई जांच नहीं हुई
            </p>
            <Link to="/">
              <Button className="mt-4 font-hindi">
                पहली जांच करें
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {groupedScans.map((group) => (
              <div key={group.label}>
                <h2 className="text-sm font-semibold text-muted-foreground font-hindi mb-2">
                  {group.label}
                </h2>
                <div className="space-y-3">
                  {group.scans.map((scan, index) => {
                    const globalIndex = scans.findIndex(s => s.id === scan.id);
                    const { trend, note } = getTrend(scan, globalIndex);
                    const isExpanded = expandedId === scan.id;

                    return (
                      <Collapsible
                        key={scan.id}
                        open={isExpanded}
                        onOpenChange={() => setExpandedId(isExpanded ? null : scan.id)}
                      >
                        <div
                          className="bg-card rounded-lg shadow-soft animate-sunrise overflow-hidden"
                          style={{ animationDelay: `${index * 0.05}s` }}
                        >
                          <CollapsibleTrigger className="w-full p-4 text-left">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-lg">
                                    {scan.scan_category === "crop" ? "🌱" : "🌾"}
                                  </span>
                                  <span className="font-semibold font-hindi">
                                    {scan.soil_type || scan.crop_type || (scan.scan_category === "crop" ? "फसल जांच" : "मिट्टी जांच")}
                                  </span>
                                  {getTrendBadge(trend, note)}
                                </div>
                                
                                {scan.analysis_summary && (
                                  <p className="text-sm text-muted-foreground mt-1 font-hindi line-clamp-2">
                                    {scan.analysis_summary}
                                  </p>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <div className="text-right">
                                  <span className="text-xs text-muted-foreground">
                                    {format(new Date(scan.created_at), "d MMM", { locale: hi })}
                                  </span>
                                  {scan.confidence_score && (
                                    <div className="mt-1">
                                      <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                                        {scan.confidence_score}%
                                      </span>
                                    </div>
                                  )}
                                </div>
                                {isExpanded ? (
                                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                )}
                              </div>
                            </div>
                          </CollapsibleTrigger>
                          
                          <CollapsibleContent>
                            <div className="px-4 pb-4 pt-2 border-t border-border space-y-3">
                              {/* Metrics */}
                              <div className="grid grid-cols-3 gap-2 text-center">
                                {scan.moisture_percentage !== null && (
                                  <div className="bg-muted/50 rounded-lg p-2">
                                    <p className="text-xs text-muted-foreground font-hindi">नमी</p>
                                    <p className="font-semibold">{scan.moisture_percentage}%</p>
                                  </div>
                                )}
                                {scan.ph_level !== null && (
                                  <div className="bg-muted/50 rounded-lg p-2">
                                    <p className="text-xs text-muted-foreground">pH</p>
                                    <p className="font-semibold">{scan.ph_level}</p>
                                  </div>
                                )}
                                {scan.nitrogen_level && (
                                  <div className="bg-muted/50 rounded-lg p-2">
                                    <p className="text-xs text-muted-foreground font-hindi">नाइट्रोजन</p>
                                    <p className="font-semibold font-hindi text-sm">{scan.nitrogen_level}</p>
                                  </div>
                                )}
                              </div>

                              {/* Recommendations */}
                              {scan.recommendations && scan.recommendations.length > 0 && (
                                <div>
                                  <p className="text-xs text-muted-foreground font-hindi mb-1">दी गई सलाह:</p>
                                  <ul className="text-sm font-hindi space-y-1">
                                    {scan.recommendations.slice(0, 3).map((rec, i) => (
                                      <li key={i} className="flex items-start gap-2">
                                        <span className="text-primary">→</span>
                                        <span>{rec}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* View full button */}
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full font-hindi"
                                onClick={() => navigate("/scan-results", { 
                                  state: { 
                                    analysis: scan, 
                                    category: scan.scan_category || "soil" 
                                  } 
                                })}
                              >
                                पूरी जानकारी देखें
                              </Button>
                            </div>
                          </CollapsibleContent>
                        </div>
                      </Collapsible>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Improvement note if we have scans */}
        {scans.length >= 2 && (
          <div className="mt-6 p-4 bg-success/10 rounded-lg text-center animate-fade-in">
            <p className="font-hindi text-success">
              🌱 आपकी जमीन की जानकारी बढ़ रही है
            </p>
            <p className="text-xs text-muted-foreground font-hindi mt-1">
              {scans.length} जांचें हो चुकी हैं
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default History;
