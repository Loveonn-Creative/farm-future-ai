import { useState } from "react";
import { Link } from "react-router-dom";
import { Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const Help = () => {
  const [isListening, setIsListening] = useState(false);

  const startVoiceHelp = () => {
    setIsListening(true);
    // Voice recognition would be implemented here
    // For now, just show the listening state
    setTimeout(() => setIsListening(false), 3000);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-gradient-earth text-primary-foreground p-4">
        <h1 className="text-xl font-bold font-hindi text-center">
          🎤 मदद
        </h1>
      </header>

      <main className="p-6 max-w-lg mx-auto">
        {/* Voice help button */}
        <div className="text-center mb-8">
          <button
            onClick={startVoiceHelp}
            className={`w-32 h-32 rounded-full flex items-center justify-center mx-auto transition-all ${
              isListening
                ? "bg-destructive animate-pulse"
                : "bg-primary hover:bg-primary-hover"
            }`}
          >
            <MessageCircle className="w-12 h-12 text-primary-foreground" />
          </button>
          <p className="mt-4 font-hindi text-lg">
            {isListening ? "सुन रहे हैं..." : "बोलकर पूछें"}
          </p>
        </div>

        {/* Quick help options */}
        <div className="space-y-4">
          <h2 className="font-semibold font-hindi text-center">
            या सीधे संपर्क करें
          </h2>
          
          <a
            href="tel:+919876543210"
            className="flex items-center gap-4 p-4 bg-card rounded-lg shadow-soft hover:shadow-earth transition-shadow"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Phone className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="font-semibold font-hindi">फ़ोन करें</p>
              <p className="text-sm text-muted-foreground">सुबह 8 बजे - रात 8 बजे</p>
            </div>
          </a>

          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 bg-card rounded-lg shadow-soft hover:shadow-earth transition-shadow"
          >
            <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="font-semibold font-hindi">WhatsApp</p>
              <p className="text-sm text-muted-foreground">जल्दी जवाब मिलेगा</p>
            </div>
          </a>
        </div>

        {/* FAQ links */}
        <div className="mt-8">
          <h2 className="font-semibold font-hindi mb-4">आम सवाल</h2>
          <div className="space-y-2">
            {[
              "मिट्टी की जांच कैसे करें?",
              "प्रीमियम में क्या मिलता है?",
              "पैसे कैसे भरें?",
            ].map((question, index) => (
              <button
                key={index}
                className="w-full text-left p-3 bg-muted rounded-lg font-hindi text-sm hover:bg-muted/80 transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        {/* Back link */}
        <div className="text-center mt-8">
          <Link to="/" className="text-muted-foreground font-hindi text-sm hover:text-primary">
            ← वापस जाएं
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Help;