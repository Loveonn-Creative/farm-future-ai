import { Link, useNavigate } from "react-router-dom";
import { Check, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SecondaryNav from "@/components/SecondaryNav";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

const Pricing = () => {
  const { t, isHindi } = useLanguage();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handlePlanSelect = () => {
    if (!isAuthenticated) {
      navigate("/auth?redirect=/subscribe");
    } else {
      navigate("/subscribe");
    }
  };
  
  const plans = [
    {
      name: isHindi ? "रोज़ाना" : "Daily",
      price: "₹5",
      period: isHindi ? "/दिन" : "/day",
      savings: null,
      popular: false,
    },
    {
      name: isHindi ? "6 महीने" : "6 Months",
      price: "₹499",
      period: "",
      savings: 45,
      popular: true,
    },
    {
      name: isHindi ? "1 साल" : "1 Year",
      price: "₹1499",
      period: "",
      savings: 60,
      popular: false,
    },
  ];

  const features = [
    { 
      name: isHindi ? "रोज़ाना मिट्टी जांच" : "Daily Soil Scan", 
      free: isHindi ? "1 बार" : "1x", 
      premium: isHindi ? "असीमित" : "Unlimited" 
    },
    { 
      name: isHindi ? "फसल की सलाह" : "Crop Recommendations", 
      free: false, 
      premium: true 
    },
    { 
      name: isHindi ? "कीट/रोग चेतावनी" : "Pest/Disease Alerts", 
      free: false, 
      premium: true 
    },
    { 
      name: isHindi ? "फसल बेचने में मदद" : "Market Access", 
      free: false, 
      premium: true 
    },
    { 
      name: isHindi ? "छोटा कर्ज़ (माइक्रो-लोन)" : "Micro-loans", 
      free: false, 
      premium: true 
    },
    { 
      name: isHindi ? "सटीक विश्लेषण" : "Analysis Precision", 
      free: isHindi ? "सामान्य" : "Basic", 
      premium: isHindi ? "पूर्ण" : "Full" 
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <SecondaryNav title={t('nav_pricing')} />
      
      {/* Header */}
      <header className="bg-gradient-earth text-primary-foreground p-6 text-center">
        <h1 className={`text-2xl font-bold ${isHindi ? 'font-hindi' : ''}`}>
          {isHindi ? "अपनी खेती को और बेहतर बनाएं" : "Upgrade Your Farming"}
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
                <span className={`absolute -top-3 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold ${isHindi ? 'font-hindi' : ''}`}>
                  {isHindi ? "लोकप्रिय" : "Popular"}
                </span>
              )}
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`text-lg font-semibold ${isHindi ? 'font-hindi' : ''}`}>{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                    {plan.period && (
                      <span className={`text-muted-foreground ${isHindi ? 'font-hindi' : ''}`}>{plan.period}</span>
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
                    <span className={`text-xs text-muted-foreground ${isHindi ? 'font-hindi' : ''}`}>
                      {isHindi ? "बचत" : "savings"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Feature comparison */}
        <div className="mt-10">
          <h2 className={`text-lg font-semibold mb-4 text-center ${isHindi ? 'font-hindi' : ''}`}>
            {isHindi ? "क्या-क्या मिलेगा?" : "What's Included?"}
          </h2>
          
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            {/* Header row */}
            <div className={`grid grid-cols-3 bg-muted p-3 text-sm font-semibold ${isHindi ? 'font-hindi' : ''}`}>
              <span>{isHindi ? "सुविधा" : "Feature"}</span>
              <span className="text-center">{isHindi ? "मुफ़्त" : "Free"}</span>
              <span className="text-center text-primary">{isHindi ? "प्रीमियम" : "Premium"}</span>
            </div>
            
            {/* Feature rows */}
            {features.map((feature, index) => (
              <div
                key={index}
                className="grid grid-cols-3 p-3 border-t border-border text-sm items-center"
              >
                <span className={isHindi ? 'font-hindi' : ''}>{feature.name}</span>
                <span className="text-center">
                  {typeof feature.free === "boolean" ? (
                    feature.free ? (
                      <Check className="w-5 h-5 text-success mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-muted-foreground mx-auto" />
                    )
                  ) : (
                    <span className={`text-muted-foreground ${isHindi ? 'font-hindi' : ''}`}>{feature.free}</span>
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
                    <span className={`text-primary font-semibold ${isHindi ? 'font-hindi' : ''}`}>{feature.premium}</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <Button size="lg" onClick={handlePlanSelect} className={`w-full text-lg py-6 ${isHindi ? 'font-hindi' : ''}`}>
            {isHindi ? "पूरी सुविधा जारी रखें" : "Get Full Access"}
          </Button>
          <p className={`text-xs text-muted-foreground mt-3 ${isHindi ? 'font-hindi' : ''}`}>
            {isHindi ? "कभी भी बंद कर सकते हैं" : "Cancel anytime"}
          </p>
        </div>

        {/* Cross-navigation */}
        <section className="py-6 flex flex-wrap justify-center gap-4 text-sm border-t border-border mt-8">
          <Link to="/about" className={`text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors ${isHindi ? 'font-hindi' : ''}`}>
            {t('nav_about')}
            <ArrowRight className="w-3 h-3" />
          </Link>
          <span className="text-border">•</span>
          <Link to="/how-it-works" className={`text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors ${isHindi ? 'font-hindi' : ''}`}>
            {t('nav_how_it_works')}
            <ArrowRight className="w-3 h-3" />
          </Link>
          <span className="text-border">•</span>
          <Link to="/" className={`text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors ${isHindi ? 'font-hindi' : ''}`}>
            {t('nav_home')}
            <ArrowRight className="w-3 h-3" />
          </Link>
        </section>
      </main>
    </div>
  );
};

export default Pricing;
