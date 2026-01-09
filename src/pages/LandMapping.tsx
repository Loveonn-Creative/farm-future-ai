import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Camera, Play, Square, ChevronLeft, Check, Loader2, Volume2, VolumeX, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { useSensorFusion } from "@/hooks/use-sensor-fusion";
import { useVoiceGuidance } from "@/hooks/use-voice-guidance";

interface GpsPoint {
  lat: number;
  lng: number;
  accuracy: number;
  timestamp: number;
}

const LandMapping = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"intro" | "tracking" | "photos" | "result">("intro");
  const [corners, setCorners] = useState<GpsPoint[]>([]);
  const [photos, setPhotos] = useState<string[]>([]);
  const [plotName, setPlotName] = useState("");
  const [area, setArea] = useState<{ bigha: number; acre: number; hectare: number; sqMeters: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sensor fusion for high-precision GPS
  const {
    filteredPoints,
    currentPosition,
    accuracy,
    isCalibrated,
    errorEstimate,
    startTracking: startSensorTracking,
    stopTracking: stopSensorTracking,
    markCorner: markSensorCorner,
    clearPoints
  } = useSensorFusion();

  // Voice guidance system
  const {
    isSpeaking,
    isEnabled: voiceEnabled,
    setIsEnabled: setVoiceEnabled,
    speakStart,
    speakCornerMarked,
    speakKeepWalking,
    speakComplete,
    speakCalibrating,
    speakGpsWeak,
    stopSpeaking
  } = useVoiceGuidance();

  // Calculate area using Shoelace formula with high precision
  const calculateArea = (points: GpsPoint[]): number => {
    if (points.length < 3) return 0;
    
    let area = 0;
    const n = points.length;
    
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      area += points[i].lat * points[j].lng;
      area -= points[j].lat * points[i].lng;
    }
    
    // Convert to square meters using WGS84 ellipsoid approximation
    const latMidpoint = points.reduce((sum, p) => sum + p.lat, 0) / n;
    const metersPerDegreeLat = 111132.92 - 559.82 * Math.cos(2 * latMidpoint * Math.PI / 180);
    const metersPerDegreeLng = 111412.84 * Math.cos(latMidpoint * Math.PI / 180);
    
    const areaInSqMeters = Math.abs(area * metersPerDegreeLat * metersPerDegreeLng / 2);
    return areaInSqMeters;
  };

  // Convert square meters to Indian land units
  const convertToUnits = (sqMeters: number) => {
    const hectare = sqMeters / 10000;
    const acre = sqMeters / 4046.86;
    const bigha = sqMeters / 2529.29; // Standard UP bigha
    return { 
      bigha: Math.round(bigha * 100) / 100, 
      acre: Math.round(acre * 100) / 100, 
      hectare: Math.round(hectare * 1000) / 1000,
      sqMeters: Math.round(sqMeters)
    };
  };

  const startTracking = async () => {
    try {
      setStep("tracking");
      setCorners([]);
      clearPoints();
      
      await startSensorTracking();
      
      // Voice guidance
      if (voiceEnabled) {
        speakCalibrating();
        setTimeout(() => {
          if (isCalibrated) {
            speakStart();
          }
        }, 3000);
      }
    } catch (error) {
      console.error("Failed to start tracking:", error);
      toast.error("GPS शुरू नहीं हो सका। कृपया GPS चालू करें।");
    }
  };

  const markCorner = () => {
    const point = markSensorCorner();
    if (!point) {
      toast.error("GPS पॉइंट नहीं मिला");
      return;
    }
    
    const newCorner: GpsPoint = {
      lat: point.lat,
      lng: point.lng,
      accuracy: point.accuracy,
      timestamp: point.timestamp
    };
    
    setCorners(prev => {
      const newCorners = [...prev, newCorner];
      
      // Voice feedback
      if (voiceEnabled) {
        speakCornerMarked(newCorners.length);
      }
      
      toast.success(`कोना ${newCorners.length} चिह्नित (सटीकता: ±${Math.round(point.accuracy)}m)`);
      return newCorners;
    });
  };

  const stopTracking = () => {
    stopSensorTracking();
    
    // Calculate area from corners
    if (corners.length >= 3) {
      const sqMeters = calculateArea(corners);
      const units = convertToUnits(sqMeters);
      setArea(units);
      setStep("photos");
      
      // Voice feedback
      if (voiceEnabled) {
        speakComplete(`${units.bigha} बीघा`);
      }
    } else {
      toast.error("कम से कम 3 कोने चाहिए");
    }
  };

  const handlePhotoCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotos(prev => [...prev, reader.result as string]);
    };
    reader.readAsDataURL(file);
  };

  const finishMapping = () => {
    // Save to localStorage with high-precision data
    const plots = JSON.parse(localStorage.getItem("datakhet_plots") || "[]");
    const newPlot = {
      id: crypto.randomUUID(),
      name: plotName || `खेत ${plots.length + 1}`,
      area,
      corners,
      allPoints: filteredPoints, // Store all points for future analysis
      photos,
      createdAt: new Date().toISOString(),
      precision: {
        averageAccuracy: corners.reduce((sum, c) => sum + c.accuracy, 0) / corners.length,
        pointCount: filteredPoints.length,
        method: 'sensor_fusion_kalman'
      }
    };
    plots.push(newPlot);
    localStorage.setItem("datakhet_plots", JSON.stringify(plots));
    
    toast.success("खेत का नक्शा सेव हो गया!");
    setStep("result");
  };

  // Warn if GPS accuracy is poor
  useEffect(() => {
    if (step === "tracking" && accuracy > 20 && voiceEnabled) {
      speakGpsWeak();
    }
  }, [step, accuracy, voiceEnabled, speakGpsWeak]);

  useEffect(() => {
    return () => {
      stopSensorTracking();
      stopSpeaking();
    };
  }, [stopSensorTracking, stopSpeaking]);

  // Intro step
  if (step === "intro") {
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
                खेत का नक्शा
              </h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className="text-primary-foreground bg-white/10 hover:bg-white/20 gap-1.5"
            >
              {voiceEnabled ? (
                <>
                  <Volume2 className="w-4 h-4" />
                  <span className="font-hindi text-xs">आवाज़ सुनें</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span className="font-hindi text-xs">आवाज़ बंद</span>
                </>
              )}
            </Button>
          </div>
        </header>

        <main className="p-4 max-w-lg mx-auto">
          <div className="text-center py-8">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 animate-pulse-gentle">
              <Navigation className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-xl font-semibold font-hindi mb-2">उच्च-सटीकता नक्शा</h2>
            <p className="text-muted-foreground font-hindi text-sm">
              सेंसर फ्यूज़न तकनीक से 2-5 मीटर सटीकता
            </p>
          </div>

          {/* Trust message */}
          <div className="bg-success/10 border border-success/20 rounded-xl p-4 mb-6 text-center">
            <p className="font-hindi text-success font-medium">
              ✓ पैदल चलकर खेत नापें — बिल्कुल सही माप मिलेगी
            </p>
          </div>

          <div className="space-y-4">
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
                <p className="text-sm text-muted-foreground font-hindi">हर कोने पर बटन दबाएं (न्यूनतम 3)</p>
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
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold font-hindi flex items-center gap-2">
              <MapPin className="w-5 h-5 animate-pulse" />
              {isCalibrated ? "चल रहे हैं..." : "GPS जांच..."}
            </h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className="text-primary-foreground bg-white/10 hover:bg-white/20 gap-1.5"
            >
              {voiceEnabled ? (
                <>
                  <Volume2 className="w-4 h-4" />
                  <span className="font-hindi text-xs">आवाज़ सुनें</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span className="font-hindi text-xs">आवाज़ बंद</span>
                </>
              )}
            </Button>
          </div>
        </header>

        <main className="p-4 max-w-lg mx-auto">
          {/* Precision indicator */}
          <div className="bg-card rounded-xl p-4 shadow-soft mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground font-hindi">सटीकता</span>
              <span className={`text-sm font-semibold ${errorEstimate <= 5 ? 'text-success' : errorEstimate <= 15 ? 'text-warning' : 'text-destructive'}`}>
                ±{Math.round(errorEstimate)}m
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all ${errorEstimate <= 5 ? 'bg-success' : errorEstimate <= 15 ? 'bg-warning' : 'bg-destructive'}`}
                style={{ width: `${Math.max(10, 100 - errorEstimate * 3)}%` }}
              />
            </div>
            {!isCalibrated && (
              <p className="text-xs text-muted-foreground font-hindi mt-2 flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" />
                GPS कैलिब्रेट हो रहा है...
              </p>
            )}
          </div>

          {/* Live stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card rounded-xl p-4 text-center shadow-soft">
              <p className="text-3xl font-bold text-primary">{filteredPoints.length}</p>
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
                {isCalibrated && (
                  <div className="absolute inset-0 rounded-full border-4 border-primary animate-ping" />
                )}
                <div className="text-center">
                  <Navigation className="w-12 h-12 text-primary mx-auto mb-1" />
                  {currentPosition && (
                    <p className="text-xs text-muted-foreground">
                      {currentPosition.lat.toFixed(6)}, {currentPosition.lng.toFixed(6)}
                    </p>
                  )}
                </div>
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
            {isSpeaking ? "🔊 बोल रहा है..." : "खेत की सीमा पर चलते रहें"}
          </p>

          {/* Action buttons */}
          <div className="mt-8 space-y-3">
            <Button 
              onClick={markCorner} 
              variant="outline" 
              size="lg" 
              className="w-full font-hindi"
              disabled={!isCalibrated}
            >
              <MapPin className="w-5 h-5 mr-2" />
              कोना चिह्नित करें ({corners.length}/4+)
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
          {/* Area result with precision info */}
          {area && (
            <div className="bg-success/10 border border-success/20 rounded-xl p-4 text-center">
              <p className="text-sm text-muted-foreground font-hindi">अनुमानित क्षेत्रफल</p>
              <p className="text-3xl font-bold text-success">{area.bigha} बीघा</p>
              <p className="text-sm text-muted-foreground">
                ({area.acre} एकड़ / {area.hectare} हेक्टेयर)
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {area.sqMeters.toLocaleString()} वर्ग मीटर | {corners.length} कोने | {filteredPoints.length} GPS पॉइंट्स
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

          <div className="mt-4 bg-muted/30 rounded-xl p-4 text-left">
            <h3 className="font-semibold font-hindi text-sm mb-2">📊 सटीकता विवरण</h3>
            <ul className="text-sm text-muted-foreground space-y-1 font-hindi">
              <li>• औसत GPS सटीकता: ±{Math.round(corners.reduce((sum, c) => sum + c.accuracy, 0) / corners.length)}m</li>
              <li>• कुल GPS पॉइंट्स: {filteredPoints.length}</li>
              <li>• तकनीक: सेंसर फ्यूज़न + Kalman फ़िल्टर</li>
            </ul>
          </div>

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
