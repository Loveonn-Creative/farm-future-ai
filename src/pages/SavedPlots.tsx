import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, ChevronLeft, Calendar, Ruler, Trash2, ImageIcon, ChevronRight, Wheat, Sprout, Loader2, Share2, BarChart3, Camera, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ScanRecord {
  id: string;
  created_at: string;
  scan_category: string | null;
  soil_type: string | null;
  crop_type: string | null;
  analysis_summary: string | null;
  latitude: number | null;
  longitude: number | null;
  ph_level: number | null;
  moisture_percentage: number | null;
  nitrogen_level: string | null;
}

interface PlotData {
  id: string;
  name: string;
  area: {
    bigha: number;
    acre: number;
    hectare: number;
    sqMeters: number;
  };
  corners: Array<{
    lat: number;
    lng: number;
    accuracy: number;
    timestamp: number;
  }>;
  photos: string[];
  createdAt: string;
  precision: {
    averageAccuracy: number;
    pointCount: number;
    method: string;
  };
}

interface PlotWithScans extends PlotData {
  scans: ScanRecord[];
}

const SavedPlots = () => {
  const navigate = useNavigate();
  const [plots, setPlots] = useState<PlotData[]>([]);
  const [selectedPlot, setSelectedPlot] = useState<PlotData | null>(null);
  const [plotScans, setPlotScans] = useState<ScanRecord[]>([]);
  const [loadingScans, setLoadingScans] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonData, setComparisonData] = useState<PlotWithScans[]>([]);

  useEffect(() => {
    const savedPlots = JSON.parse(localStorage.getItem("datakhet_plots") || "[]");
    setPlots(savedPlots.sort((a: PlotData, b: PlotData) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ));
  }, []);

  // Check if a point is inside a polygon using ray casting
  const isPointInPolygon = (lat: number, lng: number, corners: PlotData['corners']) => {
    let inside = false;
    const n = corners.length;
    
    for (let i = 0, j = n - 1; i < n; j = i++) {
      const xi = corners[i].lat, yi = corners[i].lng;
      const xj = corners[j].lat, yj = corners[j].lng;
      
      if (((yi > lng) !== (yj > lng)) && (lat < (xj - xi) * (lng - yi) / (yj - yi) + xi)) {
        inside = !inside;
      }
    }
    return inside;
  };

  // Fetch scans when a plot is selected
  useEffect(() => {
    if (!selectedPlot) {
      setPlotScans([]);
      return;
    }

    const fetchPlotScans = async () => {
      setLoadingScans(true);
      const sessionId = localStorage.getItem("datakhet_session");
      
      // Get bounding box of plot for initial filter
      const lats = selectedPlot.corners.map(c => c.lat);
      const lngs = selectedPlot.corners.map(c => c.lng);
      const minLat = Math.min(...lats) - 0.001; // ~100m buffer
      const maxLat = Math.max(...lats) + 0.001;
      const minLng = Math.min(...lngs) - 0.001;
      const maxLng = Math.max(...lngs) + 0.001;

      const { data, error } = await supabase
        .from("soil_scans")
        .select("id, created_at, scan_category, soil_type, crop_type, analysis_summary, latitude, longitude, ph_level, moisture_percentage, nitrogen_level")
        .eq("session_id", sessionId)
        .gte("latitude", minLat)
        .lte("latitude", maxLat)
        .gte("longitude", minLng)
        .lte("longitude", maxLng)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) {
        console.error("Error fetching scans:", error);
        setLoadingScans(false);
        return;
      }

      // Filter to only scans actually inside the polygon
      const scansInPlot = (data || []).filter(scan => 
        scan.latitude && scan.longitude && 
        isPointInPolygon(scan.latitude, scan.longitude, selectedPlot.corners)
      );

      setPlotScans(scansInPlot);
      setLoadingScans(false);
    };

    fetchPlotScans();
  }, [selectedPlot]);

  const deletePlot = (plotId: string) => {
    const updatedPlots = plots.filter(p => p.id !== plotId);
    localStorage.setItem("datakhet_plots", JSON.stringify(updatedPlots));
    setPlots(updatedPlots);
    setSelectedPlot(null);
    setSelectedForCompare(prev => prev.filter(id => id !== plotId));
    toast.success("खेत हटा दिया गया");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('hi-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const togglePlotSelection = (plotId: string) => {
    setSelectedForCompare(prev => {
      if (prev.includes(plotId)) {
        return prev.filter(id => id !== plotId);
      }
      if (prev.length >= 3) {
        toast.error("अधिकतम 3 खेत तुलना कर सकते हैं");
        return prev;
      }
      return [...prev, plotId];
    });
  };

  const startComparison = async () => {
    if (selectedForCompare.length < 2) {
      toast.error("कम से कम 2 खेत चुनें");
      return;
    }

    setLoadingScans(true);
    const sessionId = localStorage.getItem("datakhet_session");
    const plotsWithScans: PlotWithScans[] = [];

    for (const plotId of selectedForCompare) {
      const plot = plots.find(p => p.id === plotId);
      if (!plot) continue;

      const lats = plot.corners.map(c => c.lat);
      const lngs = plot.corners.map(c => c.lng);
      const minLat = Math.min(...lats) - 0.001;
      const maxLat = Math.max(...lats) + 0.001;
      const minLng = Math.min(...lngs) - 0.001;
      const maxLng = Math.max(...lngs) + 0.001;

      const { data } = await supabase
        .from("soil_scans")
        .select("id, created_at, scan_category, soil_type, crop_type, analysis_summary, latitude, longitude, ph_level, moisture_percentage, nitrogen_level")
        .eq("session_id", sessionId)
        .gte("latitude", minLat)
        .lte("latitude", maxLat)
        .gte("longitude", minLng)
        .lte("longitude", maxLng)
        .order("created_at", { ascending: false })
        .limit(20);

      const scansInPlot = (data || []).filter(scan => 
        scan.latitude && scan.longitude && 
        isPointInPolygon(scan.latitude, scan.longitude, plot.corners)
      );

      plotsWithScans.push({ ...plot, scans: scansInPlot });
    }

    setComparisonData(plotsWithScans);
    setShowComparison(true);
    setLoadingScans(false);
  };

  const scanFromPlot = (plot: PlotData) => {
    // Store plot context for auto-tagging
    localStorage.setItem("datakhet_active_plot", JSON.stringify({
      id: plot.id,
      name: plot.name,
      center: {
        lat: plot.corners.reduce((sum, c) => sum + c.lat, 0) / plot.corners.length,
        lng: plot.corners.reduce((sum, c) => sum + c.lng, 0) / plot.corners.length
      }
    }));
    toast.success(`${plot.name} के लिए स्कैन शुरू करें`);
    navigate("/");
  };

  const getLatestScanValue = (scans: ScanRecord[], field: 'ph_level' | 'moisture_percentage' | 'nitrogen_level') => {
    const validScan = scans.find(s => s[field] !== null && s[field] !== undefined);
    return validScan ? validScan[field] : null;
  };

  const getSoilHealthScore = (scans: ScanRecord[]) => {
    const ph = getLatestScanValue(scans, 'ph_level') as number | null;
    const moisture = getLatestScanValue(scans, 'moisture_percentage') as number | null;
    const nitrogen = getLatestScanValue(scans, 'nitrogen_level') as string | null;
    
    let score = 0;
    let factors = 0;
    
    if (ph !== null) {
      const phScore = ph >= 6 && ph <= 7 ? 100 : ph >= 5.5 && ph <= 7.5 ? 70 : 40;
      score += phScore;
      factors++;
    }
    
    if (moisture !== null) {
      const moistureScore = moisture >= 40 && moisture <= 60 ? 100 : moisture >= 30 && moisture <= 70 ? 70 : 40;
      score += moistureScore;
      factors++;
    }
    
    if (nitrogen !== null) {
      const nitrogenScore = nitrogen === 'High' || nitrogen === 'अधिक' ? 100 : nitrogen === 'Medium' || nitrogen === 'मध्यम' ? 70 : 40;
      score += nitrogenScore;
      factors++;
    }
    
    return factors > 0 ? Math.round(score / factors) : null;
  };

  const shareViaWhatsApp = (plot: PlotData) => {
    const cornersList = plot.corners
      .map((c, i) => `कोना ${i + 1}: ${c.lat.toFixed(6)}, ${c.lng.toFixed(6)}`)
      .join('\n');
    
    const googleMapsLink = `https://www.google.com/maps/dir/${plot.corners.map(c => `${c.lat},${c.lng}`).join('/')}`;
    
    const message = `🌾 *${plot.name}*

📐 *क्षेत्रफल:*
• ${plot.area.bigha.toFixed(2)} बीघा
• ${plot.area.acre.toFixed(2)} एकड़
• ${plot.area.hectare.toFixed(3)} हेक्टेयर
• ${plot.area.sqMeters.toFixed(0)} वर्ग मीटर

📍 *माप की जानकारी:*
• कोने: ${plot.corners.length}
• सटीकता: ±${plot.precision.averageAccuracy.toFixed(1)}m
• GPS पॉइंट्स: ${plot.precision.pointCount}
• तारीख: ${formatDate(plot.createdAt)}

🗺️ *निर्देशांक:*
${cornersList}

📍 *गूगल मैप्स पर देखें:*
${googleMapsLink}

_DataKhet से नापा गया_`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    toast.success("WhatsApp खुल रहा है...");
  };

  // Comparison view
  if (showComparison) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <header className="bg-gradient-earth text-primary-foreground p-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => { setShowComparison(false); setCompareMode(false); setSelectedForCompare([]); }} className="text-primary-foreground">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold font-hindi flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              खेत तुलना
            </h1>
          </div>
        </header>

        <main className="p-4 max-w-2xl mx-auto space-y-4">
          {/* Area Comparison */}
          <Card className="p-4">
            <h2 className="font-semibold font-hindi mb-4 flex items-center gap-2">
              <Ruler className="w-4 h-4 text-primary" />
              क्षेत्रफल तुलना
            </h2>
            <div className="space-y-3">
              {comparisonData.map((plot, idx) => (
                <div key={plot.id} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${idx === 0 ? 'bg-primary' : idx === 1 ? 'bg-success' : 'bg-warning'}`} />
                  <span className="font-medium font-hindi flex-1 truncate">{plot.name}</span>
                  <span className="text-lg font-bold">{plot.area.bigha.toFixed(2)}</span>
                  <span className="text-xs text-muted-foreground">बीघा</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-hindi">कुल क्षेत्रफल</span>
                <span className="font-bold">{comparisonData.reduce((sum, p) => sum + p.area.bigha, 0).toFixed(2)} बीघा</span>
              </div>
            </div>
          </Card>

          {/* Soil Health Comparison */}
          <Card className="p-4">
            <h2 className="font-semibold font-hindi mb-4 flex items-center gap-2">
              <Wheat className="w-4 h-4 text-primary" />
              मिट्टी स्वास्थ्य तुलना
            </h2>
            <div className="space-y-4">
              {comparisonData.map((plot, idx) => {
                const healthScore = getSoilHealthScore(plot.scans);
                const latestPh = getLatestScanValue(plot.scans, 'ph_level');
                const latestMoisture = getLatestScanValue(plot.scans, 'moisture_percentage');
                const latestNitrogen = getLatestScanValue(plot.scans, 'nitrogen_level');
                
                return (
                  <div key={plot.id} className="bg-muted/50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-3 h-3 rounded-full ${idx === 0 ? 'bg-primary' : idx === 1 ? 'bg-success' : 'bg-warning'}`} />
                      <span className="font-medium font-hindi">{plot.name}</span>
                      {healthScore !== null && (
                        <span className={`ml-auto text-sm font-bold ${healthScore >= 70 ? 'text-success' : healthScore >= 50 ? 'text-warning' : 'text-destructive'}`}>
                          {healthScore}%
                        </span>
                      )}
                    </div>
                    {plot.scans.length === 0 ? (
                      <p className="text-xs text-muted-foreground font-hindi">कोई जांच नहीं</p>
                    ) : (
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="text-center bg-background rounded p-2">
                          <p className="text-muted-foreground">pH</p>
                          <p className="font-medium">{latestPh !== null ? latestPh : '-'}</p>
                        </div>
                        <div className="text-center bg-background rounded p-2">
                          <p className="text-muted-foreground">नमी</p>
                          <p className="font-medium">{latestMoisture !== null ? `${latestMoisture}%` : '-'}</p>
                        </div>
                        <div className="text-center bg-background rounded p-2">
                          <p className="text-muted-foreground">नाइट्रोजन</p>
                          <p className="font-medium font-hindi">{latestNitrogen || '-'}</p>
                        </div>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-2 font-hindi">
                      {plot.scans.length} जांच
                    </p>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Scan Count Comparison */}
          <Card className="p-4">
            <h2 className="font-semibold font-hindi mb-4 flex items-center gap-2">
              <Sprout className="w-4 h-4 text-primary" />
              जांच इतिहास
            </h2>
            <div className="space-y-2">
              {comparisonData.map((plot, idx) => {
                const soilScans = plot.scans.filter(s => s.scan_category === 'soil').length;
                const cropScans = plot.scans.filter(s => s.scan_category === 'crop').length;
                
                return (
                  <div key={plot.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${idx === 0 ? 'bg-primary' : idx === 1 ? 'bg-success' : 'bg-warning'}`} />
                      <span className="font-hindi text-sm">{plot.name}</span>
                    </div>
                    <div className="flex gap-3 text-xs">
                      <span className="flex items-center gap-1">
                        <Wheat className="w-3 h-3 text-amber-600" />
                        {soilScans}
                      </span>
                      <span className="flex items-center gap-1">
                        <Sprout className="w-3 h-3 text-success" />
                        {cropScans}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Button 
            onClick={() => { setShowComparison(false); setCompareMode(false); setSelectedForCompare([]); }} 
            variant="outline"
            className="w-full font-hindi"
          >
            वापस जाएं
          </Button>
        </main>
      </div>
    );
  }

  // Plot detail view
  if (selectedPlot) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <header className="bg-gradient-earth text-primary-foreground p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setSelectedPlot(null)} className="text-primary-foreground">
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-xl font-bold font-hindi">{selectedPlot.name}</h1>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => shareViaWhatsApp(selectedPlot)}
              className="text-primary-foreground"
            >
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </header>

        <main className="p-4 max-w-lg mx-auto space-y-4">
          {/* Area Card */}
          <Card className="p-4">
            <h2 className="font-semibold font-hindi mb-3 flex items-center gap-2">
              <Ruler className="w-4 h-4 text-primary" />
              क्षेत्रफल
            </h2>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-primary/10 rounded-lg p-3">
                <p className="text-2xl font-bold text-primary">{selectedPlot.area.bigha.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">बीघा</p>
              </div>
              <div className="bg-muted rounded-lg p-3">
                <p className="text-lg font-semibold">{selectedPlot.area.acre.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">एकड़</p>
              </div>
              <div className="bg-muted rounded-lg p-3">
                <p className="text-lg font-semibold">{selectedPlot.area.hectare.toFixed(3)}</p>
                <p className="text-xs text-muted-foreground">हेक्टेयर</p>
              </div>
            </div>
          </Card>

          {/* Precision Info */}
          <Card className="p-4">
            <h2 className="font-semibold font-hindi mb-3">📍 माप की जानकारी</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground font-hindi">कोने</span>
                <span className="font-medium">{selectedPlot.corners.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground font-hindi">औसत सटीकता</span>
                <span className={`font-medium ${selectedPlot.precision.averageAccuracy <= 5 ? 'text-success' : 'text-warning'}`}>
                  ±{selectedPlot.precision.averageAccuracy.toFixed(1)}m
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground font-hindi">GPS पॉइंट्स</span>
                <span className="font-medium">{selectedPlot.precision.pointCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground font-hindi">तारीख</span>
                <span className="font-medium">{formatDate(selectedPlot.createdAt)}</span>
              </div>
            </div>
          </Card>

          {/* Photos */}
          {selectedPlot.photos.length > 0 && (
            <Card className="p-4">
              <h2 className="font-semibold font-hindi mb-3 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-primary" />
                फ़ोटो ({selectedPlot.photos.length})
              </h2>
              <div className="grid grid-cols-3 gap-2">
                {selectedPlot.photos.map((photo, index) => (
                  <img 
                    key={index}
                    src={photo} 
                    alt={`कोना ${index + 1}`}
                    className="w-full aspect-square object-cover rounded-lg"
                  />
                ))}
              </div>
            </Card>
          )}

          {/* Scan History for this Plot */}
          <Card className="p-4">
            <h2 className="font-semibold font-hindi mb-3 flex items-center gap-2">
              <Wheat className="w-4 h-4 text-primary" />
              इस खेत की जांच ({plotScans.length})
            </h2>
            
            {loadingScans ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              </div>
            ) : plotScans.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground font-hindi mb-3">
                  इस खेत में अभी कोई जांच नहीं हुई
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate("/")}
                  className="font-hindi"
                >
                  <Sprout className="w-4 h-4 mr-1" />
                  अभी जांचें
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {plotScans.map((scan) => (
                  <div 
                    key={scan.id}
                    className="bg-muted/50 rounded-lg p-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {scan.scan_category === 'crop' ? (
                          <Sprout className="w-4 h-4 text-success" />
                        ) : (
                          <Wheat className="w-4 h-4 text-amber-600" />
                        )}
                        <div>
                          <p className="font-medium text-sm font-hindi">
                            {scan.scan_category === 'crop' ? 'फसल जांच' : 'मिट्टी जांच'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(scan.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                    {scan.analysis_summary && (
                      <p className="text-xs text-muted-foreground mt-2 font-hindi line-clamp-2">
                        {scan.analysis_summary}
                      </p>
                    )}
                    {(scan.soil_type || scan.crop_type) && (
                      <p className="text-xs mt-1">
                        <span className="bg-primary/10 text-primary px-2 py-0.5 rounded font-hindi">
                          {scan.soil_type || scan.crop_type}
                        </span>
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-4">
            <h2 className="font-semibold font-hindi mb-3">🗺️ कोने के निर्देशांक</h2>
            <div className="space-y-2">
              {selectedPlot.corners.map((corner, index) => (
                <div key={index} className="flex items-center justify-between bg-muted/50 rounded-lg p-2 text-xs">
                  <span className="font-hindi">कोना {index + 1}</span>
                  <span className="text-muted-foreground font-mono">
                    {corner.lat.toFixed(6)}, {corner.lng.toFixed(6)}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Scan This Plot Button */}
          <Button 
            onClick={() => scanFromPlot(selectedPlot)} 
            className="w-full font-hindi"
          >
            <Camera className="w-4 h-4 mr-2" />
            इस खेत की जांच करें
          </Button>

          {/* WhatsApp Share Button */}
          <Button 
            onClick={() => shareViaWhatsApp(selectedPlot)} 
            variant="outline"
            className="w-full font-hindi bg-[#25D366] hover:bg-[#128C7E] text-white border-0"
          >
            <Share2 className="w-4 h-4 mr-2" />
            WhatsApp पर शेयर करें
          </Button>

          {/* Delete Button */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full font-hindi">
                <Trash2 className="w-4 h-4 mr-2" />
                खेत हटाएं
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="font-hindi">क्या आप वाकई हटाना चाहते हैं?</AlertDialogTitle>
                <AlertDialogDescription className="font-hindi">
                  "{selectedPlot.name}" का सारा डेटा हमेशा के लिए हट जाएगा।
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="font-hindi">रद्द करें</AlertDialogCancel>
                <AlertDialogAction onClick={() => deletePlot(selectedPlot.id)} className="font-hindi">
                  हटाएं
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </main>
      </div>
    );
  }

  // Plots list view
  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="bg-gradient-earth text-primary-foreground p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-primary-foreground">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold font-hindi flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              मेरे खेत
            </h1>
          </div>
          {plots.length >= 2 && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                if (compareMode) {
                  setCompareMode(false);
                  setSelectedForCompare([]);
                } else {
                  setCompareMode(true);
                }
              }}
              className="text-primary-foreground font-hindi text-xs"
            >
              <BarChart3 className="w-4 h-4 mr-1" />
              {compareMode ? 'रद्द करें' : 'तुलना करें'}
            </Button>
          )}
        </div>
      </header>

      <main className="p-4 max-w-lg mx-auto">
        {compareMode && (
          <div className="mb-4 p-3 bg-primary/10 rounded-lg">
            <p className="text-sm font-hindi text-center mb-2">
              {selectedForCompare.length === 0 
                ? '2-3 खेत चुनें तुलना के लिए' 
                : `${selectedForCompare.length} खेत चुने गए`}
            </p>
            {selectedForCompare.length >= 2 && (
              <Button 
                onClick={startComparison}
                disabled={loadingScans}
                className="w-full font-hindi"
                size="sm"
              >
                {loadingScans ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <BarChart3 className="w-4 h-4 mr-2" />
                )}
                तुलना देखें
              </Button>
            )}
          </div>
        )}

        {plots.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold font-hindi mb-2">कोई खेत नहीं</h2>
            <p className="text-muted-foreground font-hindi text-sm mb-6">
              अभी तक कोई खेत नापा नहीं गया
            </p>
            <Button onClick={() => navigate("/land-mapping")} className="font-hindi">
              <MapPin className="w-4 h-4 mr-2" />
              पहला खेत नापें
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {plots.map((plot) => {
              const isSelected = selectedForCompare.includes(plot.id);
              
              return (
                <Card 
                  key={plot.id}
                  className={`p-4 cursor-pointer hover:shadow-md transition-all ${
                    compareMode && isSelected ? 'ring-2 ring-primary bg-primary/5' : ''
                  }`}
                  onClick={() => {
                    if (compareMode) {
                      togglePlotSelection(plot.id);
                    } else {
                      setSelectedPlot(plot);
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {compareMode && (
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            isSelected ? 'bg-primary border-primary' : 'border-muted-foreground/30'
                          }`}>
                            {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
                          </div>
                        )}
                        <h3 className="font-semibold font-hindi">{plot.name}</h3>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Ruler className="w-3 h-3" />
                          {plot.area.bigha.toFixed(2)} बीघा
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(plot.createdAt)}
                        </span>
                      </div>
                      {plot.photos.length > 0 && (
                        <div className="flex gap-1 mt-2">
                          {plot.photos.slice(0, 3).map((photo, i) => (
                            <img 
                              key={i}
                              src={photo}
                              alt=""
                              className="w-10 h-10 object-cover rounded"
                            />
                          ))}
                          {plot.photos.length > 3 && (
                            <div className="w-10 h-10 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">
                              +{plot.photos.length - 3}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    {!compareMode && <ChevronRight className="w-5 h-5 text-muted-foreground" />}
                  </div>
                </Card>
              );
            })}

            <Button 
              onClick={() => navigate("/land-mapping")} 
              variant="outline" 
              className="w-full font-hindi mt-4"
            >
              <MapPin className="w-4 h-4 mr-2" />
              नया खेत नापें
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default SavedPlots;
