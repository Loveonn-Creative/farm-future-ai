import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Smartphone, Brain, ShoppingCart, ArrowRight, CheckCircle } from "lucide-react";
import SecondaryNav from "@/components/SecondaryNav";
import { useLanguage } from "@/contexts/LanguageContext";
import aerialFarm from "@/assets/aerial-farm.jpg";

const HowItWorks = () => {
  const { t, isHindi } = useLanguage();
  
  const steps = [
    {
      number: "01",
      icon: Smartphone,
      title: isHindi ? "डेटा इकट्ठा करें" : "Smart Data Collection",
      description: isHindi ? "फ़ोटो लें या अपलोड करें" : "Soil sensors + satellite data → get WhatsApp/SMS insights",
      details: isHindi 
        ? "अपने खेत की मिट्टी या फसल की तस्वीर लें। हमारा सिस्टम GPS से स्थान भी पकड़ता है।"
        : "We install affordable sensors on your farm and combine data from satellites to monitor your soil health, moisture levels, and crop conditions in real-time."
    },
    {
      number: "02", 
      icon: Brain,
      title: isHindi ? "AI विश्लेषण" : "AI Recommendations",
      description: isHindi ? "हमारा AI तुरंत जांच करता है" : "AI tells you exactly what to do (fertilizer, watering)",
      details: isHindi
        ? "हमारा AI मिट्टी का प्रकार, पोषक तत्व, नमी, और फसल की स्थिति का विश्लेषण करता है।"
        : "Our AI analyzes your farm data and sends you personalized recommendations via WhatsApp or SMS - no smartphone required. Get daily tips in your local language."
    },
    {
      number: "03",
      icon: ShoppingCart,
      title: isHindi ? "सलाह और बिक्री" : "Direct Sales",
      description: isHindi ? "व्यक्तिगत सुझाव पाएं" : "You sell directly to buyers using our app",
      details: isHindi
        ? "मुफ्त और भुगतान वाले उपाय पाएं। सीधे खरीदारों से जुड़ें और उचित दाम पाएं।"
        : "Connect with verified buyers, get fair prices, and arrange pickup directly through our platform. Skip the middleman and maximize your profits."
    }
  ];

  const testimonial = {
    name: "Rajesh Kumar",
    location: isHindi ? "पंजाब, भारत" : "Punjab, India",
    crop: isHindi ? "धान और गेहूं" : "Rice & Wheat",
    quote: isHindi 
      ? "DataKhet ने मेरी उपज 35% बढ़ाई और खाद पर ₹15,000 बचाए। WhatsApp की सलाह बहुत आसान है!"
      : "DataKhet increased my yield by 35% and saved ₹15,000 on fertilizers in just one season. The WhatsApp tips are so easy to follow!",
    results: [
      isHindi ? "35% उपज में वृद्धि" : "35% increase in yield",
      isHindi ? "₹15,000 खाद पर बचत" : "₹15,000 saved on fertilizers", 
      isHindi ? "20% बेहतर बाज़ार दाम" : "20% better market prices"
    ]
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <SecondaryNav title={t('nav_how_it_works')} />
      
      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className={`text-3xl md:text-5xl font-bold text-foreground mb-6 ${isHindi ? 'font-hindi' : ''}`}>
              {isHindi ? "DataKhet कैसे काम करता है?" : "How DataKhet Works for You"}
            </h1>
            <p className={`text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto ${isHindi ? 'font-hindi' : ''}`}>
              {isHindi ? "तीन आसान कदम में स्मार्ट खेती। कोई तकनीकी ज्ञान ज़रूरी नहीं।" : "Three simple steps to smarter farming. No technical knowledge required."}
            </p>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 1;
              
              return (
                <div key={index} className={`flex flex-col ${isEven ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-8 md:gap-12 mb-16 md:mb-20`}>
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4 md:mb-6">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-lg md:text-xl font-bold">
                        {step.number}
                      </div>
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-earth rounded-full flex items-center justify-center">
                        <Icon className="h-6 w-6 md:h-8 md:w-8 text-white" />
                      </div>
                    </div>
                    <h3 className={`text-xl md:text-2xl font-bold text-foreground mb-3 md:mb-4 ${isHindi ? 'font-hindi' : ''}`}>
                      {step.title}
                    </h3>
                    <p className={`text-base md:text-lg text-accent font-semibold mb-3 md:mb-4 ${isHindi ? 'font-hindi' : ''}`}>
                      {step.description}
                    </p>
                    <p className={`text-muted-foreground leading-relaxed ${isHindi ? 'font-hindi' : ''}`}>
                      {step.details}
                    </p>
                  </div>
                  
                  <div className="flex-1 w-full">
                    <Card className="border-0 shadow-soft">
                      <CardContent className="p-4 md:p-8">
                        <div 
                          className="h-48 md:h-64 bg-cover bg-center rounded-lg"
                          style={{ backgroundImage: `url(${aerialFarm})` }}
                        />
                      </CardContent>
                    </Card>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-12 md:py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className={`text-2xl md:text-4xl font-bold text-center text-foreground mb-12 md:mb-16 ${isHindi ? 'font-hindi' : ''}`}>
              {isHindi ? "असली किसानों के असली नतीजे" : "Real Results from Real Farmers"}
            </h2>
            
            <Card className="border-0 shadow-earth">
              <CardContent className="p-6 md:p-12">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <blockquote className={`text-base md:text-lg text-foreground mb-6 italic leading-relaxed ${isHindi ? 'font-hindi' : ''}`}>
                      "{testimonial.quote}"
                    </blockquote>
                    <div className="mb-6">
                      <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                      <p className={`text-muted-foreground ${isHindi ? 'font-hindi' : ''}`}>{testimonial.location}</p>
                      <p className={`text-sm text-accent ${isHindi ? 'font-hindi' : ''}`}>{testimonial.crop}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className={`font-semibold text-foreground mb-4 ${isHindi ? 'font-hindi' : ''}`}>
                      {isHindi ? "नतीजे:" : "Results:"}
                    </h5>
                    <ul className="space-y-3">
                      {testimonial.results.map((result, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                          <span className={`text-muted-foreground ${isHindi ? 'font-hindi' : ''}`}>{result}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className={`text-2xl md:text-4xl font-bold text-foreground mb-6 ${isHindi ? 'font-hindi' : ''}`}>
            {isHindi ? "अपनी खेती बदलने के लिए तैयार?" : "Ready to Transform Your Farm?"}
          </h2>
          <p className={`text-lg md:text-xl text-muted-foreground mb-8 ${isHindi ? 'font-hindi' : ''}`}>
            {isHindi ? "हज़ारों किसान पहले से AI का फायदा उठा रहे हैं" : "Join thousands of farmers already using AI to grow better crops"}
          </p>
          <Button asChild size="lg" className={`text-lg px-8 py-4 ${isHindi ? 'font-hindi' : ''}`}>
            <Link to="/">
              {t('start_now')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
      
      {/* Cross-navigation */}
      <section className="py-6 flex flex-wrap justify-center gap-4 text-sm border-t border-border mx-4">
        <Link to="/about" className={`text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors ${isHindi ? 'font-hindi' : ''}`}>
          {t('nav_about')}
          <ArrowRight className="w-3 h-3" />
        </Link>
        <span className="text-border">•</span>
        <Link to="/pricing" className={`text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors ${isHindi ? 'font-hindi' : ''}`}>
          {t('nav_pricing')}
          <ArrowRight className="w-3 h-3" />
        </Link>
      </section>
    </div>
  );
};

export default HowItWorks;
