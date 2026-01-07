import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Camera, Play, Square, ChevronLeft, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";

interface GpsPoint {
  lat: number;
  lng: number;
  timestamp: number;
}

const LandMapping = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"intro" | "tracking" | "photos" | "result">("intro");
  const [isTracking, setIsTracking] = useState(false);
  const [gpsPoints, setGpsPoints] = useState<GpsPoint[]>([]);
  const [corners, setCorners] = useState<GpsPoint[]>([]);
  const [photos, setPhotos] = useState<string[]>([]);
  const [plotName, setPlotName] = useState("");
  const [area, setArea] = useState<{ bigha: number; acre: number; hectare: number } | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Calculate area using Shoelace formula
  const calculateArea = (points: GpsPoint[]): number => {
    if (points.length < 3) return 0;
    
    let area = 0;
    const n = points.length;
    
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      area += points[i].lat * points[j].lng;
      area -= points[j].lat * points[i].lng;
    }
    
    // Convert to square meters (approximate for India's latitude)
    const latMidpoint = points.reduce((sum, p) => sum + p.lat, 0) / n;
    const metersPerDegreeLat = 111320;
    const metersPerDegreeLng = 111320 * Math.cos(latMidpoint * Math.PI / 180);
    
    const areaInSqMeters = Math.abs(area * metersPerDegreeLat * metersPerDegreeLng / 2);
    return areaInSqMeters;
  };

  // Convert square meters to Indian land units
  const convertToUnits = (sqMeters: number) => {
    const hectare = sqMeters / 10000;
    const acre = sqMeters / 4047;
    const bigha = sqMeters / 2529; // Standard Uttar Pradesh bigha
    return { bigha: Math.round(bigha * 100) / 100, acre: Math.round(acre * 100) / 100, hectare: Math.round(hectare * 100) / 100 };
  };

  const startTracking = () => {
    if (!navigator.geolocation) {
      toast.error("GPS उपलब्ध नहीं है");
      return;
    }

    setStep("tracking");
    setIsTracking(true);
    setGpsPoints([]);
    setCorners([]);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const newPoint: GpsPoint = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          timestamp: Date.now(),
        };
        setGpsPoints((prev) => [...prev, newPoint]);
      },
      (error) => {
        console.error("GPS error:", error);
        toast.error("GPS में समस्या है");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const markCorner = () => {
    if (gpsPoints.length === 0) return;
    
    const lastPoint = gpsPoints[gpsPoints.length - 1];
    setCorners((prev) => [...prev, lastPoint]);
    toast.success(`कोना ${corners.length + 1} चिह्नित`);
  };

  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsTracking(false);

    // Calculate area from corners or all points
    const pointsToUse = corners.length >= 3 ? corners : gpsPoints;
    if (pointsToUse.length >= 3) {
      const sqMeters = calculateArea(pointsToUse);
      setArea(convertToUnits(sqMeters));
      setStep("photos");
    } else {
      toast.error("कम से कम 3 कोने चाहिए");
    }
  };

  const handlePhotoCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotos((prev) => [...prev, reader.result as string]);
    };
    reader.readAsDataURL(file);
  };

  const finishMapping = () => {
    // Save to localStorage
    const plots = JSON.parse(localStorage.getItem("datakhet_plots") || "[]");
    const newPlot = {
      id: crypto.randomUUID(),
      name: plotName || `खेत ${plots.length + 1}`,
      area,
      corners: corners.length >= 3 ? corners : gpsPoints,
      photos,
      createdAt: new Date().toISOString(),
    };
    plots.push(newPlot);
    localStorage.setItem("datakhet_plots", JSON.stringify(plots));
    
    toast.success("खेत का नक्शा सेव हो गया!");
    setStep("result");
  };

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  // Intro step
  if (step === "intro") {
    return (
      <div className="min-h-screen bg-background pb-24">
        <header className="bg-gradient-earth text-primary-foreground p-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-primary-foreground">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold font-hindi flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              खेत का नक्शा
            </h1>
          </div>
        </header>

        <main className="p-4 max-w-lg mx-auto">
          <div className="text-center py-8">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 animate-pulse-gentle">
              <MapPin className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-xl font-semibold font-hindi mb-2">अपने खेत का क्षेत्रफल नापें</h2>
            <p className="text-muted-foreground font-hindi text-sm">
              खेत की चारों दिशाओं में चलें, फ़ोन आपका रास्ता याद करेगा
            </p>
          </div>

          <div className="space-y-4 mt-6">
            <div className="bg-muted/50 rounded-xl p-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
              <div>
                <p className="font-semibold font-hindi">शुरुआत करें</p>
                <p className="text-sm text-muted-foreground font-hindi">खेत के किसी कोने से चलना शुरू करें</p>
              </div>
            </div>
            <div className="bg-muted/50 rounded-xl p-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
              <div>
                <p className="font-semibold font-hindi">कोने चिह्नित करें</p>
                <p className="text-sm text-muted-foreground font-hindi">हर कोने पर बटन दबाएं</p>
              </div>
            </div>
            <div className="bg-muted/50 rounded-xl p-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
              <div>
                <p className="font-semibold font-hindi">फ़ोटो लें</p>
                <p className="text-sm text-muted-foreground font-hindi">हर कोने की मिट्टी की फ़ोटो लें</p>
              </div>
            </div>
          </div>

          <Button onClick={startTracking} size="lg" className="w-full mt-8 font-hindi">
            <Play className="w-5 h-5 mr-2" />
            नक्शा बनाना शुरू करें
          </Button>
        </main>
      </div>
    );
  }

  // Tracking step
  if (step === "tracking") {
    return (
      <div className="min-h-screen bg-background pb-24">
        <header className="bg-gradient-earth text-primary-foreground p-4">
          <h1 className="text-xl font-bold font-hindi text-center flex items-center justify-center gap-2">
            <MapPin className="w-5 h-5 animate-pulse" />
            {isTracking ? "चल रहे हैं..." : "रुक गया"}
          </h1>
        </header>

        <main className="p-4 max-w-lg mx-auto">
          {/* Live stats */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-card rounded-xl p-4 text-center shadow-soft">
              <p className="text-3xl font-bold text-primary">{gpsPoints.length}</p>
              <p className="text-sm text-muted-foreground font-hindi">GPS पॉइंट्स</p>
            </div>
            <div className="bg-card rounded-xl p-4 text-center shadow-soft">
              <p className="text-3xl font-bold text-success">{corners.length}</p>
              <p className="text-sm text-muted-foreground font-hindi">कोने चिह्नित</p>
            </div>
          </div>

          {/* Visual indicator */}
          <div className="mt-8 flex justify-center">
            <div className="relative">
              <div className="w-40 h-40 rounded-full border-4 border-primary/20 flex items-center justify-center">
                {isTracking && (
                  <div className="absolute inset-0 rounded-full border-4 border-primary animate-ping" />
                )}
                <MapPin className="w-16 h-16 text-primary" />
              </div>
              {/* Corner indicators */}
              <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">
                {corners.length >= 1 ? <Check className="w-4 h-4 text-success" /> : "A"}
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">
                {corners.length >= 2 ? <Check className="w-4 h-4 text-success" /> : "B"}
              </div>
              <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">
                {corners.length >= 3 ? <Check className="w-4 h-4 text-success" /> : "C"}
              </div>
              <div className="absolute -bottom-2 -left-2 w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">
                {corners.length >= 4 ? <Check className="w-4 h-4 text-success" /> : "D"}
              </div>
            </div>
          </div>

          <p className="text-center text-muted-foreground font-hindi mt-4 text-sm">
            खेत की सीमा पर चलते रहें
          </p>

          {/* Action buttons */}
          <div className="mt-8 space-y-3">
            <Button onClick={markCorner} variant="outline" size="lg" className="w-full font-hindi">
              <MapPin className="w-5 h-5 mr-2" />
              कोना चिह्नित करें ({corners.length}/4)
            </Button>
            
            <Button 
              onClick={stopTracking} 
              variant="default" 
              size="lg" 
              className="w-full font-hindi"
              disabled={corners.length < 3}
            >
              <Square className="w-5 h-5 mr-2" />
              नक्शा पूरा करें
            </Button>
          </div>

          {corners.length < 3 && (
            <p className="text-center text-warning text-sm font-hindi mt-4">
              कम से कम 3 कोने चिह्नित करें
            </p>
          )}
        </main>
      </div>
    );
  }

  // Photos step
  if (step === "photos") {
    return (
      <div className="min-h-screen bg-background pb-24">
        <header className="bg-gradient-earth text-primary-foreground p-4">
          <h1 className="text-xl font-bold font-hindi text-center flex items-center justify-center gap-2">
            <Camera className="w-5 h-5" />
            खेत की फ़ोटो लें
          </h1>
        </header>

        <main className="p-4 max-w-lg mx-auto">
          {/* Area result */}
          {area && (
            <div className="bg-success/10 border border-success/20 rounded-xl p-4 text-center">
              <p className="text-sm text-muted-foreground font-hindi">अनुमानित क्षेत्रफल</p>
              <p className="text-3xl font-bold text-success">{area.bigha} बीघा</p>
              <p className="text-sm text-muted-foreground">
                ({area.acre} एकड़ / {area.hectare} हेक्टेयर)
              </p>
            </div>
          )}

          {/* Photo grid */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            {photos.map((photo, index) => (
              <div key={index} className="aspect-square rounded-xl overflow-hidden bg-muted">
                <img src={photo} alt={`कोना ${index + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square rounded-xl border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center gap-2 hover:border-primary transition-colors"
            >
              <Camera className="w-8 h-8 text-muted-foreground" />
              <span className="text-xs text-muted-foreground font-hindi">फ़ोटो जोड़ें</span>
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handlePhotoCapture}
            className="hidden"
          />

          {/* Plot name */}
          <div className="mt-6">
            <label className="text-sm font-hindi text-muted-foreground">खेत का नाम (वैकल्पिक)</label>
            <Input
              value={plotName}
              onChange={(e) => setPlotName(e.target.value)}
              placeholder="जैसे: पुराना खेत, नदी वाला खेत"
              className="mt-1 font-hindi"
            />
          </div>

          <Button onClick={finishMapping} size="lg" className="w-full mt-6 font-hindi">
            <Check className="w-5 h-5 mr-2" />
            नक्शा सेव करें
          </Button>
        </main>
      </div>
    );
  }

  // Result step
  if (step === "result") {
    return (
      <div className="min-h-screen bg-background pb-24">
        <header className="bg-gradient-earth text-primary-foreground p-4">
          <h1 className="text-xl font-bold font-hindi text-center">नक्शा तैयार!</h1>
        </header>

        <main className="p-4 max-w-lg mx-auto text-center">
          <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mt-8 animate-bounce-soft">
            <Check className="w-10 h-10 text-success" />
          </div>

          <h2 className="text-xl font-semibold font-hindi mt-4">{plotName || "आपका खेत"}</h2>
          
          {area && (
            <div className="mt-4">
              <p className="text-3xl font-bold text-primary">{area.bigha} बीघा</p>
              <p className="text-sm text-muted-foreground">
                ({area.acre} एकड़ / {area.hectare} हेक्टेयर)
              </p>
            </div>
          )}

          <p className="text-sm text-muted-foreground font-hindi mt-4">
            {photos.length} फ़ोटो सेव हुईं • {corners.length} कोने चिह्नित
          </p>

          <div className="mt-8 space-y-3">
            <Button onClick={() => navigate("/")} size="lg" className="w-full font-hindi">
              इस खेत की जांच करें
            </Button>
            <Button onClick={() => setStep("intro")} variant="outline" size="lg" className="w-full font-hindi">
              दूसरा खेत नापें
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return null;
};

export default LandMapping;
