import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { hi } from "date-fns/locale";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ScanRecord {
  id: string;
  created_at: string;
  scan_category: string | null;
  soil_type: string | null;
  crop_type: string | null;
  confidence_score: number | null;
  comparison_note: string | null;
  analysis_summary: string | null;
}

const History = () => {
  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      const sessionId = localStorage.getItem("datakhet_session");
      if (!sessionId) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("soil_scans")
        .select("id, created_at, scan_category, soil_type, crop_type, confidence_score, comparison_note, analysis_summary")
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

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
          <div className="space-y-3">
            {scans.map((scan, index) => (
              <div
                key={scan.id}
                className="bg-card rounded-lg p-4 shadow-soft animate-sunrise"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {scan.scan_category === "crop" ? "🌱" : "🌾"}
                      </span>
                      <span className="font-semibold font-hindi">
                        {scan.soil_type || scan.crop_type || (scan.scan_category === "crop" ? "फसल जांच" : "मिट्टी जांच")}
                      </span>
                    </div>
                    
                    {scan.analysis_summary && (
                      <p className="text-sm text-muted-foreground mt-1 font-hindi line-clamp-2">
                        {scan.analysis_summary}
                      </p>
                    )}

                    {scan.comparison_note && (
                      <p className="text-sm text-success mt-2 font-hindi">
                        ✓ {scan.comparison_note}
                      </p>
                    )}
                  </div>
                  
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
          </div>
        )}
      </main>
    </div>
  );
};

export default History;