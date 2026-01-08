import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Satellite, Smartphone, Brain, AlertTriangle, ShoppingCart, Zap } from "lucide-react";
import SecondaryNav from "@/components/SecondaryNav";
import { useLanguage } from "@/contexts/LanguageContext";

const Features = () => {
  const { isHindi } = useLanguage();

  const features = [
    {
      icon: Zap,
      title: isHindi ? "IoT मिट्टी सेंसर" : "IoT Soil Sensors",
      price: "₹5/farm/month",
      description: isHindi 
        ? "मिट्टी की नमी, pH, पोषक तत्वों और तापमान की रियल-टाइम निगरानी" 
        : "Real-time monitoring of soil moisture, pH, nutrients, and temperature",
      benefits: isHindi ? [
        "वायरलेस, सोलर-पावर्ड सेंसर",
        "हर घंटे डेटा संग्रह",
        "महत्वपूर्ण बदलावों पर अलर्ट",
        "5 साल बैटरी लाइफ"
      ] : [
        "Wireless, solar-powered sensors",
        "Data collected every hour",
        "Alerts for critical changes",
        "5-year battery life"
      ],
      color: "bg-primary"
    },
    {
      icon: Satellite,
      title: isHindi ? "सैटेलाइट इंटीग्रेशन" : "Satellite Integration",
      price: isHindi ? "शामिल" : "Included",
      description: isHindi 
        ? "Sentinel-2 और Planet Labs की उन्नत सैटेलाइट इमेजरी से फसल निगरानी" 
        : "Advanced satellite imagery from Sentinel-2 and Planet Labs for crop monitoring",
      benefits: isHindi ? [
        "साप्ताहिक फसल स्वास्थ्य विश्लेषण",
        "विकास पैटर्न ट्रैकिंग",
        "उपज भविष्यवाणी मॉडल",
        "कीट/रोग जल्दी पहचान"
      ] : [
        "Weekly crop health analysis",
        "Growth pattern tracking",
        "Yield prediction models",
        "Pest/disease early detection"
      ],
      color: "bg-accent"
    },
    {
      icon: Brain,
      title: isHindi ? "AI कृषि विशेषज्ञ" : "AI Agronomist",
      price: isHindi ? "मुफ्त" : "Free",
      description: isHindi 
        ? "आपके खेत की अनूठी स्थितियों के आधार पर व्यक्तिगत दैनिक सलाह" 
        : "Personalized daily recommendations based on your farm's unique conditions",
      benefits: isHindi ? [
        "कस्टम खाद शेड्यूल",
        "सिंचाई समय अनुकूलन",
        "मौसम-आधारित सलाह",
        "स्थानीय भाषा समर्थन"
      ] : [
        "Custom fertilizer schedules",
        "Irrigation timing optimization",
        "Weather-based advice",
        "Local language support"
      ],
      color: "bg-secondary"
    },
    {
      icon: AlertTriangle,
      title: isHindi ? "रोग अलर्ट" : "Disease Alerts",
      price: isHindi ? "प्रीमियम" : "Premium",
      description: isHindi 
        ? "शुरुआती रोग और कीट पहचान के लिए AI-संचालित छवि पहचान" 
        : "AI-powered image recognition for early disease and pest detection",
      benefits: isHindi ? [
        "फ़ोटो-आधारित निदान",
        "उपचार सिफारिशें",
        "गंभीरता आकलन",
        "रोकथाम रणनीतियां"
      ] : [
        "Photo-based diagnosis",
        "Treatment recommendations",
        "Severity assessment",
        "Prevention strategies"
      ],
      color: "bg-earth-clay"
    },
    {
      icon: Smartphone,
      title: isHindi ? "SMS/WhatsApp इंटरफेस" : "SMS/WhatsApp Interface",
      price: isHindi ? "मुफ्त" : "Free",
      description: isHindi 
        ? "बिना स्मार्टफोन के जानकारी पाएं - SMS और WhatsApp पर काम करता है" 
        : "Get insights without a smartphone - works via SMS and WhatsApp",
      benefits: isHindi ? [
        "इंटरनेट की जरूरत नहीं",
        "वॉइस मैसेज समर्थन",
        "कई भाषा विकल्प",
        "किसी भी फोन पर काम करता है"
      ] : [
        "No internet required",
        "Voice message support",
        "Multiple language options",
        "Works on any phone"
      ],
      color: "bg-earth-green"
    },
    {
      icon: ShoppingCart,
      title: isHindi ? "डायरेक्ट मार्केटप्लेस" : "Direct Marketplace",
      price: isHindi ? "3% कमीशन" : "3% commission",
      description: isHindi 
        ? "सीधे खरीदारों से जुड़ें और बिचौलिया खर्च खत्म करें" 
        : "Connect directly with buyers and eliminate middleman costs",
      benefits: isHindi ? [
        "सत्यापित खरीदार नेटवर्क",
        "उचित मूल्य गारंटी",
        "गुणवत्ता प्रमाणन",
        "लॉजिस्टिक्स सहायता"
      ] : [
        "Verified buyer network",
        "Fair price guarantee",
        "Quality certification",
        "Logistics support"
      ],
      color: "bg-earth-brown"
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <SecondaryNav title={isHindi ? "विशेषताएं" : "Features"} />
      
      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className={`text-3xl md:text-4xl font-bold text-foreground mb-4 ${isHindi ? 'font-hindi' : ''}`}>
              {isHindi ? "पूर्ण कृषि तकनीक स्टैक" : "Complete Farming Technology Stack"}
            </h1>
            <p className={`text-lg text-muted-foreground max-w-2xl mx-auto ${isHindi ? 'font-hindi' : ''}`}>
              {isHindi 
                ? "मिट्टी सेंसर से सैटेलाइट डेटा तक, स्मार्ट खेती के लिए सब कुछ" 
                : "From soil sensors to satellite data, everything you need for smart farming"}
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-8 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-0 shadow-soft hover:shadow-earth transition-all duration-300 h-full">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 ${feature.color} rounded-full flex items-center justify-center`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <Badge variant="secondary" className={`text-sm font-semibold ${isHindi ? 'font-hindi' : ''}`}>
                        {feature.price}
                      </Badge>
                    </div>
                    <CardTitle className={`text-xl text-foreground ${isHindi ? 'font-hindi' : ''}`}>
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className={`text-muted-foreground mb-6 leading-relaxed ${isHindi ? 'font-hindi' : ''}`}>
                      {feature.description}
                    </p>
                    <ul className="space-y-3">
                      {feature.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-accent rounded-full flex-shrink-0" />
                          <span className={`text-sm text-muted-foreground ${isHindi ? 'font-hindi' : ''}`}>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Technical Overview */}
      <section className="py-12 md:py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className={`text-2xl md:text-3xl font-bold text-center text-foreground mb-12 ${isHindi ? 'font-hindi' : ''}`}>
              {isHindi ? "हमारी तकनीक कैसे काम करती है" : "How Our Technology Works Together"}
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
              <div>
                <h3 className={`text-xl font-bold text-foreground mb-6 ${isHindi ? 'font-hindi' : ''}`}>
                  {isHindi ? "डेटा संग्रह परत" : "Data Collection Layer"}
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                      <span className="text-xs text-white font-bold">1</span>
                    </div>
                    <div>
                      <h4 className={`font-semibold text-foreground ${isHindi ? 'font-hindi' : ''}`}>
                        {isHindi ? "IoT सेंसर" : "IoT Sensors"}
                      </h4>
                      <p className={`text-sm text-muted-foreground ${isHindi ? 'font-hindi' : ''}`}>
                        {isHindi ? "निरंतर मिट्टी और पर्यावरण निगरानी" : "Continuous soil and environmental monitoring"}
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                      <span className="text-xs text-white font-bold">2</span>
                    </div>
                    <div>
                      <h4 className={`font-semibold text-foreground ${isHindi ? 'font-hindi' : ''}`}>
                        {isHindi ? "सैटेलाइट डेटा" : "Satellite Data"}
                      </h4>
                      <p className={`text-sm text-muted-foreground ${isHindi ? 'font-hindi' : ''}`}>
                        {isHindi ? "उच्च-रिज़ॉल्यूशन इमेजरी और फसल विश्लेषण" : "High-resolution imagery and crop analysis"}
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                      <span className="text-xs text-white font-bold">3</span>
                    </div>
                    <div>
                      <h4 className={`font-semibold text-foreground ${isHindi ? 'font-hindi' : ''}`}>
                        {isHindi ? "मौसम एकीकरण" : "Weather Integration"}
                      </h4>
                      <p className={`text-sm text-muted-foreground ${isHindi ? 'font-hindi' : ''}`}>
                        {isHindi ? "रियल-टाइम और पूर्वानुमानित मौसम डेटा" : "Real-time and forecasted weather data"}
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className={`text-xl font-bold text-foreground mb-6 ${isHindi ? 'font-hindi' : ''}`}>
                  {isHindi ? "AI प्रोसेसिंग परत" : "AI Processing Layer"}
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                      <span className="text-xs text-white font-bold">4</span>
                    </div>
                    <div>
                      <h4 className={`font-semibold text-foreground ${isHindi ? 'font-hindi' : ''}`}>
                        {isHindi ? "मशीन लर्निंग मॉडल" : "Machine Learning Models"}
                      </h4>
                      <p className={`text-sm text-muted-foreground ${isHindi ? 'font-hindi' : ''}`}>
                        {isHindi ? "स्थानीय परिस्थितियों पर प्रशिक्षित फसल-विशिष्ट AI" : "Crop-specific AI trained on local conditions"}
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                      <span className="text-xs text-white font-bold">5</span>
                    </div>
                    <div>
                      <h4 className={`font-semibold text-foreground ${isHindi ? 'font-hindi' : ''}`}>
                        {isHindi ? "भविष्यवाणी विश्लेषण" : "Predictive Analytics"}
                      </h4>
                      <p className={`text-sm text-muted-foreground ${isHindi ? 'font-hindi' : ''}`}>
                        {isHindi ? "उपज पूर्वानुमान और जोखिम मूल्यांकन" : "Yield forecasting and risk assessment"}
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                      <span className="text-xs text-white font-bold">6</span>
                    </div>
                    <div>
                      <h4 className={`font-semibold text-foreground ${isHindi ? 'font-hindi' : ''}`}>
                        {isHindi ? "व्यक्तिगत सिफारिशें" : "Personalized Recommendations"}
                      </h4>
                      <p className={`text-sm text-muted-foreground ${isHindi ? 'font-hindi' : ''}`}>
                        {isHindi ? "दैनिक कार्रवाई योग्य अंतर्दृष्टि" : "Actionable insights delivered daily"}
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;
