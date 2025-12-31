import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Phone, MessageCircle, ChevronRight, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import VoiceQuestion from "@/components/VoiceQuestion";

interface LastScanContext {
  soil_type?: string;
  moisture_percentage?: number;
  nitrogen_level?: string;
  ph_level?: number;
  analysis_summary?: string;
}

const Help = () => {
  const [lastScan, setLastScan] = useState<LastScanContext | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  useEffect(() => {
    const fetchLastScan = async () => {
      const sessionId = localStorage.getItem("datakhet_session");
      if (!sessionId) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("soil_scans")
        .select("soil_type, moisture_percentage, nitrogen_level, ph_level, analysis_summary")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (data) {
        setLastScan(data);
      }
      setLoading(false);
    };

    fetchLastScan();
  }, []);

  // Context-aware FAQs based on last scan
  const getContextualFaqs = () => {
    const baseFaqs = [
      {
        question: "मिट्टी की जांच कैसे करें?",
        answer: "घर → मिट्टी जांच बटन दबाएं → कैमरे से मिट्टी की फ़ोटो लें → तुरंत रिपोर्ट मिलेगी। धूप में साफ़ फ़ोटो लेने से सही नतीजे आएंगे।"
      },
      {
        question: "प्रीमियम में क्या मिलता है?",
        answer: "असीमित जांचें, पुरानी जांचों की तुलना, विशेषज्ञ सलाह, और WhatsApp पर रिपोर्ट। ₹99/माह से शुरू।"
      },
      {
        question: "रिपोर्ट समझ नहीं आई?",
        answer: "हर रिपोर्ट में 🔊 बटन से आवाज़ में सुन सकते हैं। या नीचे बोलकर सवाल पूछें।"
      }
    ];

    // Add context-aware FAQs based on last scan
    if (lastScan) {
      if (lastScan.moisture_percentage !== undefined && lastScan.moisture_percentage < 30) {
        baseFaqs.unshift({
          question: "पानी कब और कितना दूं?",
          answer: `आपकी मिट्टी में नमी ${lastScan.moisture_percentage}% है जो कम है। आज शाम सिंचाई करें। सुबह जल्दी या शाम को पानी देना बेहतर है - धूप में पानी भाप बन जाता है।`
        });
      }

      if (lastScan.nitrogen_level?.toLowerCase().includes("कम") || lastScan.nitrogen_level?.toLowerCase().includes("low")) {
        baseFaqs.unshift({
          question: "कौन सी खाद डालूं?",
          answer: "आपकी मिट्टी में नाइट्रोजन कम है। यूरिया (10kg/बीघा) या DAP डाल सकते हैं। जैविक विकल्प: गोबर की खाद या वर्मीकंपोस्ट। बुआई के 15-20 दिन बाद डालें।"
        });
      }

      if (lastScan.ph_level !== undefined) {
        if (lastScan.ph_level < 6) {
          baseFaqs.unshift({
            question: "मिट्टी तेजाबी है, क्या करूं?",
            answer: `आपकी मिट्टी का pH ${lastScan.ph_level} है जो तेजाबी है। चूना (50kg/बीघा) या राख मिलाएं। 2-3 हफ्ते में सुधार होगा।`
          });
        } else if (lastScan.ph_level > 8) {
          baseFaqs.unshift({
            question: "मिट्टी क्षारीय है, क्या करूं?",
            answer: `आपकी मिट्टी का pH ${lastScan.ph_level} है जो क्षारीय है। जिप्सम (25kg/बीघा) या सल्फर डालें। धान के लिए यह ठीक नहीं है।`
          });
        }
      }
    }

    return baseFaqs.slice(0, 5);
  };

  const faqs = getContextualFaqs();

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
          🎤 मदद
        </h1>
      </header>

      <main className="p-4 max-w-lg mx-auto space-y-6">
        {/* Voice Q&A - Primary */}
        <div className="bg-card rounded-xl p-4 shadow-soft">
          <h2 className="font-semibold font-hindi mb-3 text-center">
            बोलकर पूछें
          </h2>
          <VoiceQuestion soilData={lastScan || undefined} />
        </div>

        {/* Context-aware FAQs */}
        <div>
          <h2 className="font-semibold font-hindi mb-3">आम सवाल</h2>
          <div className="space-y-2">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-card rounded-lg overflow-hidden shadow-soft"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full text-left p-4 font-hindi text-sm flex items-center justify-between hover:bg-muted/50 transition-colors"
                >
                  <span className="font-medium">{faq.question}</span>
                  <ChevronRight 
                    className={`w-4 h-4 text-muted-foreground transition-transform ${
                      expandedFaq === index ? "rotate-90" : ""
                    }`} 
                  />
                </button>
                {expandedFaq === index && (
                  <div className="px-4 pb-4 pt-0">
                    <p className="text-sm text-muted-foreground font-hindi leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact options */}
        <div className="space-y-3">
          <h2 className="font-semibold font-hindi">
            सीधे संपर्क करें
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

        {/* Back link */}
        <div className="text-center pt-4">
          <Link to="/" className="text-muted-foreground font-hindi text-sm hover:text-primary">
            ← वापस जाएं
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Help;
