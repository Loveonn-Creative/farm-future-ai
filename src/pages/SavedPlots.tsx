import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, ChevronLeft, Calendar, Ruler, Trash2, ImageIcon, ChevronRight } from "lucide-react";
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

const SavedPlots = () => {
  const navigate = useNavigate();
  const [plots, setPlots] = useState<PlotData[]>([]);
  const [selectedPlot, setSelectedPlot] = useState<PlotData | null>(null);

  useEffect(() => {
    const savedPlots = JSON.parse(localStorage.getItem("datakhet_plots") || "[]");
    setPlots(savedPlots.sort((a: PlotData, b: PlotData) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ));
  }, []);

  const deletePlot = (plotId: string) => {
    const updatedPlots = plots.filter(p => p.id !== plotId);
    localStorage.setItem("datakhet_plots", JSON.stringify(updatedPlots));
    setPlots(updatedPlots);
    setSelectedPlot(null);
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

  // Plot detail view
  if (selectedPlot) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <header className="bg-gradient-earth text-primary-foreground p-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setSelectedPlot(null)} className="text-primary-foreground">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold font-hindi">{selectedPlot.name}</h1>
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

          {/* Corner Coordinates */}
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
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-primary-foreground">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold font-hindi flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            मेरे खेत
          </h1>
        </div>
      </header>

      <main className="p-4 max-w-lg mx-auto">
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
            {plots.map((plot) => (
              <Card 
                key={plot.id}
                className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedPlot(plot)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold font-hindi">{plot.name}</h3>
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
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </Card>
            ))}

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
