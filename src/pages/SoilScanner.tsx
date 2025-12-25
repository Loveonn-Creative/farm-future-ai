import { useState, useRef, useCallback } from 'react';
import { Camera, Upload, FileText, Leaf, Droplets, FlaskConical, Loader2, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';

interface SoilAnalysis {
  soil_type?: string;
  ph_level?: number;
  nitrogen_level?: string;
  phosphorus_level?: string;
  potassium_level?: string;
  organic_matter_percentage?: number;
  moisture_percentage?: number;
  precision_level?: string;
  confidence_score?: number;
  extracted_text?: string;
  analysis_summary?: string;
  recommendations?: string[];
  error?: string;
}

const SoilScanner = () => {
  const [activeTab, setActiveTab] = useState<'camera' | 'upload' | 'ocr'>('camera');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<SoilAnalysis | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: 1280, height: 720 }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setIsCameraActive(true);
      }
    } catch (error) {
      console.error('Camera access error:', error);
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsCameraActive(false);
    }
  }, [stream]);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(imageData);
        stopCamera();
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 10MB",
          variant: "destructive"
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setCapturedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeSoil = async (scanType: 'image' | 'ocr') => {
    if (!capturedImage) {
      toast({
        title: "No image",
        description: "Please capture or upload an image first",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysis(null);

    try {
      const { data, error } = await supabase.functions.invoke('analyze-soil', {
        body: { 
          imageBase64: capturedImage,
          scanType
        }
      });

      if (error) throw error;

      setAnalysis(data);

      // Store result in database
      const sessionId = localStorage.getItem('soil_session_id') || crypto.randomUUID();
      localStorage.setItem('soil_session_id', sessionId);

      await supabase.from('soil_scans').insert({
        scan_type: scanType,
        soil_type: data.soil_type,
        ph_level: data.ph_level,
        nitrogen_level: data.nitrogen_level,
        phosphorus_level: data.phosphorus_level,
        potassium_level: data.potassium_level,
        organic_matter_percentage: data.organic_matter_percentage,
        moisture_percentage: data.moisture_percentage,
        precision_level: data.precision_level,
        confidence_score: data.confidence_score,
        extracted_text: data.extracted_text,
        analysis_summary: data.analysis_summary,
        recommendations: data.recommendations,
        raw_response: data,
        session_id: sessionId
      });

      toast({
        title: "Analysis Complete",
        description: `Soil analysis completed with ${data.precision_level || 'medium'} precision`,
      });

    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Unable to analyze soil",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetScanner = () => {
    setCapturedImage(null);
    setAnalysis(null);
    stopCamera();
  };

  const getPrecisionColor = (level?: string) => {
    switch (level) {
      case 'high': return 'bg-accent text-accent-foreground';
      case 'medium': return 'bg-secondary text-secondary-foreground';
      case 'low': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getNutrientLevel = (level?: string) => {
    if (!level) return { color: 'bg-muted', label: 'N/A' };
    const lower = level.toLowerCase();
    if (lower.includes('high') || lower.includes('adequate')) return { color: 'bg-accent', label: level };
    if (lower.includes('medium') || lower.includes('moderate')) return { color: 'bg-secondary', label: level };
    if (lower.includes('low') || lower.includes('deficient')) return { color: 'bg-destructive', label: level };
    return { color: 'bg-muted', label: level };
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">AI Soil Scanner</h1>
            <p className="text-muted-foreground">
              Real-time soil analysis powered by Gemini AI with precision-level reporting
            </p>
          </div>

          {/* Scanner Tabs */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="camera" className="flex items-center gap-2">
                <Camera className="h-4 w-4" />
                Camera
              </TabsTrigger>
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload
              </TabsTrigger>
              <TabsTrigger value="ocr" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                OCR Report
              </TabsTrigger>
            </TabsList>

            <TabsContent value="camera" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Capture Soil Sample</CardTitle>
                  <CardDescription>
                    Point your camera at a soil sample for instant AI analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!capturedImage ? (
                    <>
                      <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                        <video 
                          ref={videoRef} 
                          autoPlay 
                          playsInline 
                          className="w-full h-full object-cover"
                        />
                        {!isCameraActive && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Camera className="h-16 w-16 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <canvas ref={canvasRef} className="hidden" />
                      <div className="flex gap-2">
                        {!isCameraActive ? (
                          <Button onClick={startCamera} className="flex-1" variant="earth">
                            <Camera className="mr-2 h-4 w-4" />
                            Start Camera
                          </Button>
                        ) : (
                          <Button onClick={capturePhoto} className="flex-1" variant="earth">
                            <Camera className="mr-2 h-4 w-4" />
                            Capture Photo
                          </Button>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                        <img src={capturedImage} alt="Captured soil" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={resetScanner} variant="outline" className="flex-1">
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Retake
                        </Button>
                        <Button 
                          onClick={() => analyzeSoil('image')} 
                          disabled={isAnalyzing}
                          className="flex-1"
                          variant="earth"
                        >
                          {isAnalyzing ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <FlaskConical className="mr-2 h-4 w-4" />
                          )}
                          Analyze Soil
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="upload" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Soil Image</CardTitle>
                  <CardDescription>
                    Upload a photo of your soil sample for detailed analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!capturedImage ? (
                    <>
                      <div 
                        className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">Click or drag to upload soil image</p>
                        <p className="text-sm text-muted-foreground mt-1">JPG, PNG up to 10MB</p>
                      </div>
                      <input 
                        ref={fileInputRef}
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleFileUpload}
                      />
                    </>
                  ) : (
                    <>
                      <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                        <img src={capturedImage} alt="Uploaded soil" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={resetScanner} variant="outline" className="flex-1">
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Change Image
                        </Button>
                        <Button 
                          onClick={() => analyzeSoil('image')} 
                          disabled={isAnalyzing}
                          className="flex-1"
                          variant="earth"
                        >
                          {isAnalyzing ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <FlaskConical className="mr-2 h-4 w-4" />
                          )}
                          Analyze Soil
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ocr" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>OCR Soil Report Analysis</CardTitle>
                  <CardDescription>
                    Upload a lab soil report image - AI will extract and analyze all data
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!capturedImage ? (
                    <>
                      <div 
                        className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">Upload your soil test report</p>
                        <p className="text-sm text-muted-foreground mt-1">PDF scans, photos of lab reports</p>
                      </div>
                      <input 
                        ref={fileInputRef}
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleFileUpload}
                      />
                    </>
                  ) : (
                    <>
                      <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                        <img src={capturedImage} alt="Soil report" className="w-full h-full object-contain" />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={resetScanner} variant="outline" className="flex-1">
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Change Report
                        </Button>
                        <Button 
                          onClick={() => analyzeSoil('ocr')} 
                          disabled={isAnalyzing}
                          className="flex-1"
                          variant="earth"
                        >
                          {isAnalyzing ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <FileText className="mr-2 h-4 w-4" />
                          )}
                          Extract & Analyze
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Analysis Results */}
          {analysis && (
            <Card className="border-primary/20 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    {analysis.error ? (
                      <AlertCircle className="h-5 w-5 text-destructive" />
                    ) : (
                      <CheckCircle2 className="h-5 w-5 text-accent" />
                    )}
                    Analysis Results
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className={getPrecisionColor(analysis.precision_level)}>
                      {analysis.precision_level?.toUpperCase() || 'N/A'} Precision
                    </Badge>
                    {analysis.confidence_score && (
                      <Badge variant="outline">
                        {analysis.confidence_score}% Confidence
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Soil Type */}
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">Soil Type</h3>
                  <p className="text-foreground">{analysis.soil_type || 'Unable to determine'}</p>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* pH Level */}
                  <div className="p-4 bg-card border rounded-lg text-center">
                    <FlaskConical className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-sm text-muted-foreground">pH Level</p>
                    <p className="text-2xl font-bold text-foreground">
                      {analysis.ph_level ?? 'N/A'}
                    </p>
                  </div>

                  {/* Moisture */}
                  <div className="p-4 bg-card border rounded-lg text-center">
                    <Droplets className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                    <p className="text-sm text-muted-foreground">Moisture</p>
                    <p className="text-2xl font-bold text-foreground">
                      {analysis.moisture_percentage ? `${analysis.moisture_percentage}%` : 'N/A'}
                    </p>
                  </div>

                  {/* Organic Matter */}
                  <div className="p-4 bg-card border rounded-lg text-center">
                    <Leaf className="h-6 w-6 mx-auto mb-2 text-accent" />
                    <p className="text-sm text-muted-foreground">Organic Matter</p>
                    <p className="text-2xl font-bold text-foreground">
                      {analysis.organic_matter_percentage ? `${analysis.organic_matter_percentage}%` : 'N/A'}
                    </p>
                  </div>

                  {/* Confidence */}
                  <div className="p-4 bg-card border rounded-lg text-center">
                    <CheckCircle2 className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-sm text-muted-foreground">Confidence</p>
                    <p className="text-2xl font-bold text-foreground">
                      {analysis.confidence_score ? `${analysis.confidence_score}%` : 'N/A'}
                    </p>
                  </div>
                </div>

                {/* NPK Levels */}
                <div className="space-y-3">
                  <h3 className="font-semibold">Nutrient Levels (N-P-K)</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {/* Nitrogen */}
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Nitrogen (N)</span>
                        <Badge className={getNutrientLevel(analysis.nitrogen_level).color}>
                          {getNutrientLevel(analysis.nitrogen_level).label}
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Phosphorus */}
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Phosphorus (P)</span>
                        <Badge className={getNutrientLevel(analysis.phosphorus_level).color}>
                          {getNutrientLevel(analysis.phosphorus_level).label}
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Potassium */}
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Potassium (K)</span>
                        <Badge className={getNutrientLevel(analysis.potassium_level).color}>
                          {getNutrientLevel(analysis.potassium_level).label}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Extracted Text (for OCR) */}
                {analysis.extracted_text && (
                  <div className="space-y-2">
                    <h3 className="font-semibold">Extracted Report Data</h3>
                    <div className="p-4 bg-muted/50 rounded-lg max-h-40 overflow-y-auto">
                      <pre className="text-sm whitespace-pre-wrap font-mono">
                        {analysis.extracted_text}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Analysis Summary */}
                {analysis.analysis_summary && (
                  <div className="space-y-2">
                    <h3 className="font-semibold">Analysis Summary</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {analysis.analysis_summary}
                    </p>
                  </div>
                )}

                {/* Recommendations */}
                {analysis.recommendations && analysis.recommendations.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold">Recommendations</h3>
                    <ul className="space-y-2">
                      {analysis.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Leaf className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Loading State */}
          {isAnalyzing && (
            <Card className="border-primary/20">
              <CardContent className="py-8">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  <div className="text-center">
                    <p className="font-semibold">Analyzing Soil Sample...</p>
                    <p className="text-sm text-muted-foreground">
                      Gemini AI is processing your image with precision analysis
                    </p>
                  </div>
                  <Progress value={66} className="w-48" />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SoilScanner;
