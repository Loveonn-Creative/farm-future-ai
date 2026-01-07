import { Link } from "react-router-dom";
import { Sprout, TrendingUp, IndianRupee, ArrowRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const About = () => {
  const pillars = [
    {
      icon: <Sprout className="w-8 h-8" />,
      title: "मिट्टी देखभाल",
      description: "AI से मिट्टी जांचें, सही खाद डालें",
      color: "bg-earth-brown/10 text-earth-brown",
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "फसल देखभाल",
      description: "बीमारी पहचानें, समय पर इलाज करें",
      color: "bg-success/10 text-success",
    },
    {
      icon: <IndianRupee className="w-8 h-8" />,
      title: "सही दाम",
      description: "बाज़ार से जुड़ें, उचित मूल्य पाएं",
      color: "bg-primary/10 text-primary",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-gradient-earth text-primary-foreground p-6 text-center">
        <h1 className="text-3xl font-bold font-hindi animate-sunrise">
          मिट्टी से बाज़ार तक
        </h1>
        <p className="text-primary-foreground/80 mt-2 font-hindi">
          Soil to Sales
        </p>
      </header>

      <main className="p-4 max-w-2xl mx-auto">
        {/* Mission Statement */}
        <div className="text-center py-8">
          <p className="text-xl font-hindi text-foreground leading-relaxed">
            हम किसानों को <span className="text-primary font-semibold">AI की ताकत</span> देते हैं —
            <br />
            ताकि वे अपनी मिट्टी समझें, फसल बचाएं, और सही दाम पाएं।
          </p>
        </div>

        {/* Three Pillars */}
        <div className="space-y-4 mt-6">
          {pillars.map((pillar, index) => (
            <div
              key={index}
              className={`${pillar.color} rounded-xl p-5 animate-slide-up`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">{pillar.icon}</div>
                <div>
                  <h3 className="text-lg font-semibold font-hindi">{pillar.title}</h3>
                  <p className="text-sm opacity-80 font-hindi">{pillar.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div className="mt-10 text-center">
          <h2 className="text-lg font-semibold font-hindi mb-4">कैसे काम करता है?</h2>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground font-hindi flex-wrap">
            <span className="bg-muted px-3 py-1 rounded-full">फ़ोटो लो</span>
            <ArrowRight className="w-4 h-4" />
            <span className="bg-muted px-3 py-1 rounded-full">AI जांचे</span>
            <ArrowRight className="w-4 h-4" />
            <span className="bg-muted px-3 py-1 rounded-full">सलाह पाओ</span>
            <ArrowRight className="w-4 h-4" />
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">कमाई बढ़ाओ</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-10">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">10,000+</p>
            <p className="text-xs text-muted-foreground font-hindi">जांचें हुईं</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-success">85%</p>
            <p className="text-xs text-muted-foreground font-hindi">सटीकता</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-accent">₹0</p>
            <p className="text-xs text-muted-foreground font-hindi">पहली जांच</p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <Link to="/">
            <Button size="lg" className="font-hindi text-lg w-full max-w-xs">
              अभी जांच करें
            </Button>
          </Link>
        </div>

        {/* Back link */}
        <div className="text-center mt-6">
          <Link to="/" className="text-muted-foreground font-hindi text-sm hover:text-primary flex items-center justify-center gap-1">
            <ChevronLeft className="w-4 h-4" />
            वापस जाएं
          </Link>
        </div>
      </main>
    </div>
  );
};

export default About;
