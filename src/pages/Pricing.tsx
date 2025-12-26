import { Link } from "react-router-dom";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Pricing = () => {
  const plans = [
    {
      name: "रोज़ाना",
      price: "₹5",
      period: "/दिन",
      savings: null,
      popular: false,
    },
    {
      name: "6 महीने",
      price: "₹499",
      period: "",
      savings: 45, // 45% savings vs ₹5/day
      popular: true,
    },
    {
      name: "1 साल",
      price: "₹1499",
      period: "",
      savings: 60, // 60% savings vs ₹5/day
      popular: false,
    },
  ];

  const features = [
    { name: "रोज़ाना मिट्टी जांच", free: "1 बार", premium: "असीमित" },
    { name: "फसल की सलाह", free: false, premium: true },
    { name: "कीट/रोग चेतावनी", free: false, premium: true },
    { name: "फसल बेचने में मदद", free: false, premium: true },
    { name: "छोटा कर्ज़ (माइक्रो-लोन)", free: false, premium: true },
    { name: "सटीक विश्लेषण", free: "सामान्य", premium: "पूर्ण" },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-gradient-earth text-primary-foreground p-6 text-center">
        <h1 className="text-2xl font-bold font-hindi">
          अपनी खेती को और बेहतर बनाएं
        </h1>
      </header>

      <main className="p-4 max-w-lg mx-auto">
        {/* Pricing cards */}
        <div className="space-y-4 mt-6">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative p-4 rounded-xl border-2 transition-all animate-sunrise ${
                plan.popular
                  ? "border-primary bg-primary/5 shadow-earth"
                  : "border-border bg-card"
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                  लोकप्रिय
                </span>
              )}
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold font-hindi">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                    {plan.period && (
                      <span className="text-muted-foreground">{plan.period}</span>
                    )}
                  </div>
                </div>
                
                {plan.savings && (
                  <div className="text-right">
                    <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center">
                      <span className="text-success font-bold text-lg">
                        {plan.savings}%
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">बचत</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Feature comparison */}
        <div className="mt-10">
          <h2 className="text-lg font-semibold font-hindi mb-4 text-center">
            क्या-क्या मिलेगा?
          </h2>
          
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            {/* Header row */}
            <div className="grid grid-cols-3 bg-muted p-3 text-sm font-semibold">
              <span className="font-hindi">सुविधा</span>
              <span className="text-center font-hindi">मुफ़्त</span>
              <span className="text-center font-hindi text-primary">प्रीमियम</span>
            </div>
            
            {/* Feature rows */}
            {features.map((feature, index) => (
              <div
                key={index}
                className="grid grid-cols-3 p-3 border-t border-border text-sm items-center"
              >
                <span className="font-hindi">{feature.name}</span>
                <span className="text-center">
                  {typeof feature.free === "boolean" ? (
                    feature.free ? (
                      <Check className="w-5 h-5 text-success mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-muted-foreground mx-auto" />
                    )
                  ) : (
                    <span className="text-muted-foreground">{feature.free}</span>
                  )}
                </span>
                <span className="text-center">
                  {typeof feature.premium === "boolean" ? (
                    feature.premium ? (
                      <Check className="w-5 h-5 text-success mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-muted-foreground mx-auto" />
                    )
                  ) : (
                    <span className="text-primary font-semibold">{feature.premium}</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <Button size="lg" className="w-full font-hindi text-lg py-6">
            पूरी सुविधा जारी रखें
          </Button>
          <p className="text-xs text-muted-foreground mt-3 font-hindi">
            कभी भी बंद कर सकते हैं
          </p>
        </div>

        {/* Back link */}
        <div className="text-center mt-6">
          <Link to="/" className="text-muted-foreground font-hindi text-sm hover:text-primary">
            ← वापस जाएं
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Pricing;