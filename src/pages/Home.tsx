import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Camera, Upload, Loader2, Sprout, Wheat, Flower2, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import DesktopNav from "@/components/DesktopNav";
import MobileMenu from "@/components/MobileMenu";

type ScanCategory = "soil" | "crop" | "kitchen";

const Home = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCapturing, setIsCapturing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanCategory, setScanCategory] = useState<ScanCategory | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Get or create session ID for anonymous tracking
  const getSessionId = () => {
    let sessionId = localStorage.getItem("datakhet_session");
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem("datakhet_session", sessionId);
    }
    return sessionId;
  };

  // Detect browser language
  const detectLanguage = () => {
    const browserLang = navigator.language.split("-")[0];
    if (["hi", "bn", "ta", "te", "mr", "gu", "pa", "bh"].includes(browserLang)) {
      return browserLang;
    }
    return "hi"; // Default to Hindi
  };

  // Get location silently
  const getLocation = (): Promise<{ lat: number; lng: number } | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => resolve(null),
        { timeout: 5000 }
      );
    });
  };

  const startCamera = async (category: ScanCategory) => {
    setScanCategory(category);
    setShowCamera(true);
    setIsCapturing(true);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Camera access error:", error);
      toast({
        title: "कैमरा नहीं मिला",
        description: "कृपया फोटो अपलोड करें",
        variant: "destructive",
      });
      setShowCamera(false);
      setIsCapturing(false);
      // Fallback to file upload
      fileInputRef.current?.click();
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
    setIsCapturing(false);
  };

  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      const imageData = canvas.toDataURL("image/jpeg", 0.8);
      stopCamera();
      await analyzeImage(imageData);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const imageData = reader.result as string;
      await analyzeImage(imageData);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async (imageBase64: string) => {
    setIsAnalyzing(true);

    try {
      const location = await getLocation();
      const language = detectLanguage();
      const sessionId = getSessionId();

      const { data, error } = await supabase.functions.invoke("analyze-soil", {
        body: {
          imageBase64,
          scanType: "image",
          scanCategory: scanCategory || "soil",
          language,
        },
      });

      if (error) throw error;

      // Check if image was rejected as invalid
      if (data.is_invalid_image) {
        toast({
          title: "गलत तस्वीर",
          description: data.analysis_summary || "कृपया मिट्टी या फसल की सही तस्वीर लें",
          variant: "destructive",
        });
        setIsAnalyzing(false);
        setScanCategory(null);
        return;
      }

      // Store scan result silently
      const { error: insertError } = await supabase.from("soil_scans").insert({
        session_id: sessionId,
        scan_type: "image",
        scan_category: scanCategory || "soil",
        language,
        latitude: location?.lat,
        longitude: location?.lng,
        image_url: imageBase64.substring(0, 100), // Store reference only
        soil_type: data.soil_type,
        ph_level: data.ph_level,
        nitrogen_level: data.nitrogen_level,
        phosphorus_level: data.phosphorus_level,
        potassium_level: data.potassium_level,
        organic_matter_percentage: data.organic_matter_percentage,
        moisture_percentage: data.moisture_percentage,
        confidence_score: data.confidence_score,
        precision_level: data.precision_level,
        analysis_summary: data.analysis_summary,
        recommendations: data.recommendations,
        insights: data.insights,
        crop_type: data.crop_type,
      });

      if (insertError) console.error("Failed to save scan:", insertError);

      // Navigate to results with data
      navigate("/scan-results", { state: { analysis: data, category: scanCategory } });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "विश्लेषण विफल",
        description: "कृपया दोबारा कोशिश करें",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
      setScanCategory(null);
    }
  };

  const handleScanClick = (category: ScanCategory) => {
    setScanCategory(category);
    // On mobile, prefer camera; on desktop, show choice
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      startCamera(category);
    } else {
      fileInputRef.current?.click();
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Full screen camera view
  if (showCamera) {
    return (
      <div className="fixed inset-0 bg-earth-dark z-50 flex flex-col">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="flex-1 object-cover"
        />
        <canvas ref={canvasRef} className="hidden" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-earth-dark/90 to-transparent">
          <div className="flex items-center justify-center gap-6">
            <button
              onClick={stopCamera}
              className="w-14 h-14 rounded-full bg-muted/20 backdrop-blur-sm flex items-center justify-center text-primary-foreground"
            >
              ✕
            </button>
            <button
              onClick={captureImage}
              className="w-20 h-20 rounded-full bg-primary border-4 border-primary-foreground flex items-center justify-center shadow-glow animate-pulse"
            >
              <div className="w-16 h-16 rounded-full bg-primary-foreground/20" />
            </button>
            <div className="w-14 h-14" /> {/* Spacer for balance */}
          </div>
          <p className="text-center text-primary-foreground/80 mt-4 font-hindi">
            {scanCategory === "soil" ? "मिट्टी को फ्रेम में रखें" : scanCategory === "kitchen" ? "पौधे को फ्रेम में रखें" : "फसल को फ्रेम में रखें"}
          </p>
        </div>
      </div>
    );
  }

  // Loading state during analysis
  if (isAnalyzing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
        <div className="relative">
          <div className="w-32 h-32 rounded-full bg-gradient-earth flex items-center justify-center animate-soil-settle">
            <Loader2 className="w-12 h-12 text-primary-foreground animate-spin" />
          </div>
          <div className="absolute inset-0 rounded-full border-4 border-primary/30 animate-scan-ring" />
        </div>
        <p className="mt-8 text-xl font-hindi text-foreground text-center animate-fade-in">
          {scanCategory === "soil" ? "मिट्टी की जांच हो रही है..." : scanCategory === "kitchen" ? "पौधे की जांच हो रही है..." : "फसल की जांच हो रही है..."}
        </p>
        <p className="mt-2 text-muted-foreground font-hindi animate-fade-in">
          कृपया प्रतीक्षा करें
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Mobile Menu */}
      <MobileMenu />
      
      {/* Desktop Navigation */}
      <DesktopNav />

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Main content - centered */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-20 md:pb-8 pt-16 md:pt-0">
        {/* Single powerful headline */}
        <h1 className="text-2xl md:text-3xl font-bold text-foreground text-center font-hindi animate-sunrise mb-12 leading-relaxed">
          मिट्टी देखो। फसल जानो।<br />
          <span className="text-primary">बेहतर कमाओ।</span>
        </h1>

        {/* Scan buttons - Grid layout for 3 buttons */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 w-full max-w-2xl">
          {/* Soil Scan Button */}
          <button
            onClick={() => handleScanClick("soil")}
            disabled={isCapturing}
            className="group relative aspect-square max-w-[160px] md:max-w-[180px] mx-auto w-full rounded-full bg-gradient-soil flex flex-col items-center justify-center shadow-earth hover:shadow-glow transition-all duration-500 animate-soil-settle"
          >
            <div className="absolute inset-2 rounded-full border-2 border-primary-foreground/20 group-hover:border-primary-foreground/40 transition-colors" />
            <Wheat className="w-8 h-8 text-primary-foreground mb-1 animate-pulse-gentle" />
            <span className="text-sm md:text-base font-semibold text-primary-foreground font-hindi mb-1">
              मिट्टी जांचो
            </span>
            <div className="flex items-center gap-1 bg-primary-foreground/10 rounded-full px-2 py-0.5">
              <Camera className="w-3 h-3 text-primary-foreground/80" />
              <span className="text-primary-foreground/50 text-xs">|</span>
              <Upload className="w-3 h-3 text-primary-foreground/80" />
            </div>
          </button>

          {/* Crop Scan Button */}
          <button
            onClick={() => handleScanClick("crop")}
            disabled={isCapturing}
            className="group relative aspect-square max-w-[160px] md:max-w-[180px] mx-auto w-full rounded-full bg-gradient-crop flex flex-col items-center justify-center shadow-earth hover:shadow-glow transition-all duration-500 animate-leaf-pulse"
          >
            <div className="absolute inset-2 rounded-full border-2 border-primary-foreground/20 group-hover:border-primary-foreground/40 transition-colors" />
            <Sprout className="w-8 h-8 text-primary-foreground mb-1 animate-grow" />
            <span className="text-sm md:text-base font-semibold text-primary-foreground font-hindi mb-1">
              फसल जांचो
            </span>
            <div className="flex items-center gap-1 bg-primary-foreground/10 rounded-full px-2 py-0.5">
              <Camera className="w-3 h-3 text-primary-foreground/80" />
              <span className="text-primary-foreground/50 text-xs">|</span>
              <Upload className="w-3 h-3 text-primary-foreground/80" />
            </div>
          </button>

          {/* Kitchen Garden Button - spans full width on mobile */}
          <button
            onClick={() => handleScanClick("kitchen")}
            disabled={isCapturing}
            className="group relative aspect-square max-w-[160px] md:max-w-[180px] mx-auto w-full rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex flex-col items-center justify-center shadow-earth hover:shadow-glow transition-all duration-500 animate-sprout col-span-2 md:col-span-1"
          >
            <div className="absolute inset-2 rounded-full border-2 border-primary-foreground/20 group-hover:border-primary-foreground/40 transition-colors" />
            <Flower2 className="w-8 h-8 text-primary-foreground mb-1 animate-grow" />
            <span className="text-sm md:text-base font-semibold text-primary-foreground font-hindi mb-1">
              घर का बगीचा
            </span>
            <span className="text-xs text-primary-foreground/70 font-hindi -mt-1 mb-1">गमले / छत</span>
            <div className="flex items-center gap-1 bg-primary-foreground/10 rounded-full px-2 py-0.5">
              <Camera className="w-3 h-3 text-primary-foreground/80" />
              <span className="text-primary-foreground/50 text-xs">|</span>
              <Upload className="w-3 h-3 text-primary-foreground/80" />
            </div>
          </button>
        </div>

        {/* Land Mapping Link */}
        <Link to="/land-mapping" className="mt-6 flex items-center justify-center gap-2 text-muted-foreground hover:text-primary transition-colors font-hindi text-sm">
          <MapPin className="w-4 h-4" />
          खेत का नक्शा बनाएं
        </Link>

        {/* Helper text for desktop */}
        <p className="hidden md:block mt-4 text-sm text-muted-foreground font-hindi">
          फ़ोटो अपलोड करें या कैमरा खोलें
        </p>
      </main>
    </div>
  );
};

export default Home;
