import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Handshake, Building2, CreditCard, Truck, Users, ArrowRight, TrendingUp } from "lucide-react";
import SecondaryNav from "@/components/SecondaryNav";
import { useLanguage } from "@/contexts/LanguageContext";

const Partners = () => {
  const { t, isHindi } = useLanguage();
  
  const partnerTypes = [
    {
      icon: Building2,
      title: isHindi ? "एग्री-इनपुट ब्रांड्स" : "Agri-Input Brands",
      subtitle: isHindi ? "खाद, बीज, कीटनाशक" : "Fertilizers, Seeds, Pesticides",
      description: isHindi 
        ? "असली मिट्टी डेटा के आधार पर लक्षित उत्पाद सिफारिशों के साथ किसानों तक पहुंचें"
        : "Reach farmers with targeted product recommendations based on real soil data",
      benefits: [
        isHindi ? "1,00,000+ उपयोगकर्ताओं तक सीधी पहुंच" : "Direct farmer access to 100,000+ users",
        isHindi ? "डेटा-ड्रिवन उत्पाद सिफारिशें" : "Data-driven product recommendations",
        isHindi ? "बढ़ी हुई किसान वफादारी" : "Increased farmer loyalty and retention",
        isHindi ? "मार्केटिंग खर्च पर मापने योग्य ROI" : "Measurable ROI on marketing spend"
      ],
      ctaText: isHindi ? "वितरण के लिए पार्टनर बनें" : "Partner for Distribution",
      color: "bg-primary"
    },
    {
      icon: CreditCard,
      title: isHindi ? "वित्तीय संस्थान" : "Financial Institutions",
      subtitle: isHindi ? "बैंक, NBFC, माइक्रोफाइनेंस" : "Banks, NBFCs, Microfinance",
      description: isHindi
        ? "हमारे यील्ड प्रेडिक्शन और रिस्क असेसमेंट डेटा का उपयोग करके किसानों को क्रेडिट प्रदान करें"
        : "Provide credit to farmers using our yield prediction and risk assessment data",
      benefits: [
        isHindi ? "AI प्रेडिक्शन के साथ कम लेंडिंग रिस्क" : "Reduced lending risk with AI predictions",
        isHindi ? "वैकल्पिक क्रेडिट स्कोरिंग मॉडल" : "Alternative credit scoring models",
        isHindi ? "ऑटोमेटेड लोन प्रोसेसिंग" : "Automated loan processing",
        isHindi ? "पोर्टफोलियो रिस्क मैनेजमेंट टूल्स" : "Portfolio risk management tools"
      ],
      ctaText: isHindi ? "क्रेडिट सॉल्यूशंस एक्सप्लोर करें" : "Explore Credit Solutions",
      color: "bg-accent"
    },
    {
      icon: Truck,
      title: isHindi ? "एक्सपोर्टर्स और B2B खरीदार" : "Exporters & B2B Buyers",
      subtitle: isHindi ? "फूड प्रोसेसिंग, एक्सपोर्ट हाउस" : "Food Processing, Export Houses",
      description: isHindi
        ? "हमारे सत्यापित किसानों के नेटवर्क से सीधे उच्च-गुणवत्ता उत्पाद प्राप्त करें"
        : "Source high-quality produce directly from our network of verified farmers",
      benefits: [
        isHindi ? "गुणवत्ता आश्वासित उत्पाद" : "Quality assured produce",
        isHindi ? "अनुमानित आपूर्ति योजना" : "Predictable supply planning",
        isHindi ? "सीधे किसान संबंध" : "Direct farmer relationships",
        isHindi ? "ट्रेसेबिलिटी और सर्टिफिकेशन" : "Traceability and certification"
      ],
      ctaText: isHindi ? "बेहतर उत्पाद प्राप्त करें" : "Source Better Produce",
      color: "bg-secondary"
    }
  ];

  const partnership_models = [
    {
      title: isHindi ? "रेवेन्यू शेयरिंग" : "Revenue Sharing",
      description: isHindi ? "किसान सब्सक्रिप्शन और लेनदेन से राजस्व साझा करें" : "Share revenue from farmer subscriptions and transactions",
      percentage: "20-30%"
    },
    {
      title: isHindi ? "व्हाइट लेबल सॉल्यूशंस" : "White Label Solutions",
      description: isHindi ? "अपने किसान नेटवर्क के लिए अपनी ब्रांडिंग के साथ हमारा प्लेटफॉर्म उपयोग करें" : "Use our platform with your branding for your farmer network",
      percentage: isHindi ? "कस्टम" : "Custom"
    },
    {
      title: isHindi ? "डेटा लाइसेंसिंग" : "Data Licensing",
      description: isHindi ? "मार्केट इंटेलिजेंस के लिए एग्रीगेटेड कृषि इनसाइट्स एक्सेस करें" : "Access aggregated agricultural insights for market intelligence",
      percentage: isHindi ? "फिक्स्ड फीस" : "Fixed Fee"
    },
    {
      title: isHindi ? "ज्वाइंट वेंचर्स" : "Joint Ventures",
      description: isHindi ? "विशिष्ट फसलों या क्षेत्रों के लिए स्पेशलाइज्ड सॉल्यूशंस को-डेवलप करें" : "Co-develop specialized solutions for specific crops or regions",
      percentage: isHindi ? "इक्विटी" : "Equity"
    }
  ];

  const success_metrics = [
    { metric: "1M+", label: isHindi ? "2025 तक पहुंचने वाले किसान" : "Farmers to reach by 2025" },
    { metric: "₹500Cr", label: isHindi ? "पार्टनर्स के लिए GMV पोटेंशियल" : "GMV potential for partners" },
    { metric: "35%", label: isHindi ? "औसत यील्ड सुधार" : "Average yield improvement" },
    { metric: "92%", label: isHindi ? "किसान संतुष्टि दर" : "Farmer satisfaction rate" }
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <SecondaryNav title={t('nav_partners')} />
      
      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-gradient-hero text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className={`text-3xl md:text-5xl font-bold mb-6 ${isHindi ? 'font-hindi' : ''}`}>
              {isHindi ? "1M+ किसानों तक" : "Looking to reach"}
              <span className="block text-secondary">
                {isHindi ? "पहुंचना चाहते हैं?" : "1M+ farmers?"}
              </span>
            </h1>
            <p className={`text-lg md:text-xl mb-8 opacity-90 ${isHindi ? 'font-hindi' : ''}`}>
              {isHindi 
                ? "लाभदायक व्यावसायिक संबंध बनाते हुए कृषि को बदलने के लिए DataKhet के साथ पार्टनर बनें" 
                : "Partner with DataKhet to transform agriculture while building profitable business relationships"}
            </p>
            <Button size="lg" className={`bg-secondary text-secondary-foreground hover:bg-secondary/90 ${isHindi ? 'font-hindi' : ''}`}>
              <Handshake className="mr-2 h-5 w-5" />
              {isHindi ? "पार्टनरशिप एक्सप्लोर करें" : "Explore Partnership"}
            </Button>
          </div>
        </div>
      </section>

      {/* Partner Types */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className={`text-2xl md:text-4xl font-bold text-center text-foreground mb-12 ${isHindi ? 'font-hindi' : ''}`}>
            {isHindi ? "पार्टनरशिप अवसर" : "Partnership Opportunities"}
          </h2>
          
          <div className="grid lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            {partnerTypes.map((partner, index) => {
              const Icon = partner.icon;
              return (
                <Card key={index} className="border-0 shadow-soft hover:shadow-earth transition-all duration-300 h-full">
                  <CardHeader className="pb-4">
                    <div className={`w-16 h-16 ${partner.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className={`text-lg md:text-xl text-foreground text-center ${isHindi ? 'font-hindi' : ''}`}>
                      {partner.title}
                    </CardTitle>
                    <p className={`text-sm text-muted-foreground text-center ${isHindi ? 'font-hindi' : ''}`}>
                      {partner.subtitle}
                    </p>
                  </CardHeader>
                  <CardContent className="flex flex-col h-full">
                    <p className={`text-muted-foreground mb-6 leading-relaxed ${isHindi ? 'font-hindi' : ''}`}>
                      {partner.description}
                    </p>
                    
                    <div className="flex-grow">
                      <h4 className={`font-semibold text-foreground mb-4 ${isHindi ? 'font-hindi' : ''}`}>
                        {isHindi ? "पार्टनर लाभ:" : "Partner Benefits:"}
                      </h4>
                      <ul className="space-y-3 mb-6">
                        {partner.benefits.map((benefit, benefitIndex) => (
                          <li key={benefitIndex} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-accent rounded-full flex-shrink-0 mt-2" />
                            <span className={`text-sm text-muted-foreground ${isHindi ? 'font-hindi' : ''}`}>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Button className={`w-full mt-auto ${isHindi ? 'font-hindi' : ''}`}>
                      {partner.ctaText}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Success Metrics */}
      <section className="py-12 md:py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className={`text-2xl md:text-4xl font-bold text-foreground mb-6 ${isHindi ? 'font-hindi' : ''}`}>
              {isHindi ? "पार्टनरशिप सफलता मेट्रिक्स" : "Partnership Success Metrics"}
            </h2>
            <p className={`text-lg md:text-xl text-muted-foreground ${isHindi ? 'font-hindi' : ''}`}>
              {isHindi ? "हमारे बढ़ते किसान नेटवर्क से असली नंबर" : "Real numbers from our growing farmer network"}
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-4xl mx-auto">
            {success_metrics.map((item, index) => (
              <Card key={index} className="border-0 shadow-soft text-center">
                <CardContent className="p-6 md:p-8">
                  <div className="text-2xl md:text-4xl font-bold text-primary mb-2">
                    {item.metric}
                  </div>
                  <p className={`text-sm md:text-base text-muted-foreground ${isHindi ? 'font-hindi' : ''}`}>
                    {item.label}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Models */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className={`text-2xl md:text-4xl font-bold text-center text-foreground mb-12 ${isHindi ? 'font-hindi' : ''}`}>
            {isHindi ? "लचीले पार्टनरशिप मॉडल" : "Flexible Partnership Models"}
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
            {partnership_models.map((model, index) => (
              <Card key={index} className="border-0 shadow-soft">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className={`text-lg md:text-xl text-foreground ${isHindi ? 'font-hindi' : ''}`}>
                      {model.title}
                    </CardTitle>
                    <Badge variant="secondary" className={isHindi ? 'font-hindi' : ''}>
                      {model.percentage}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className={`text-muted-foreground ${isHindi ? 'font-hindi' : ''}`}>
                    {model.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Case Study */}
      <section className="py-12 md:py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className={`text-2xl md:text-4xl font-bold text-center text-foreground mb-12 ${isHindi ? 'font-hindi' : ''}`}>
              {isHindi ? "पार्टनरशिप सक्सेस स्टोरी" : "Partnership Success Story"}
            </h2>
            
            <Card className="border-0 shadow-earth">
              <CardContent className="p-6 md:p-12">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className={`text-xl md:text-2xl font-bold text-foreground mb-4 ${isHindi ? 'font-hindi' : ''}`}>
                      {isHindi ? "पंजाब एग्रीकल्चरल बैंक" : "Punjab Agricultural Bank"}
                    </h3>
                    <p className={`text-muted-foreground mb-6 leading-relaxed ${isHindi ? 'font-hindi' : ''}`}>
                      {isHindi 
                        ? "\"DataKhet के साथ पार्टनरशिप ने किसान संतुष्टि बढ़ाते हुए हमारे कृषि ऋण डिफॉल्ट को 40% कम कर दिया। उनकी यील्ड प्रेडिक्शन हमें बेहतर लेंडिंग निर्णय लेने में मदद करती है।\""
                        : "\"Partnering with AgriAI reduced our agricultural loan defaults by 40% while increasing farmer satisfaction. Their yield predictions help us make better lending decisions.\""}
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-accent" />
                        <span className={`text-sm text-muted-foreground ${isHindi ? 'font-hindi' : ''}`}>
                          {isHindi ? "5,000+ किसानों की सेवा" : "5,000+ farmers served"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <TrendingUp className="h-5 w-5 text-accent" />
                        <span className={`text-sm text-muted-foreground ${isHindi ? 'font-hindi' : ''}`}>
                          {isHindi ? "डिफॉल्ट में 40% कमी" : "40% reduction in defaults"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5 text-accent" />
                        <span className={`text-sm text-muted-foreground ${isHindi ? 'font-hindi' : ''}`}>
                          {isHindi ? "₹50Cr+ ऋण सुविधा" : "₹50Cr+ loans facilitated"}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-5xl md:text-6xl font-bold text-primary mb-4">40%</div>
                    <p className={`text-muted-foreground ${isHindi ? 'font-hindi' : ''}`}>
                      {isHindi ? "ऋण डिफॉल्ट में कमी" : "Reduction in loan defaults"}
                    </p>
                    <div className="mt-8 text-3xl md:text-4xl font-bold text-accent mb-2">₹50Cr+</div>
                    <p className={`text-muted-foreground ${isHindi ? 'font-hindi' : ''}`}>
                      {isHindi ? "कुल ऋण सुविधा" : "Total loans facilitated"}
                    </p>
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
            {isHindi ? "मिलकर कृषि बदलने के लिए तैयार?" : "Ready to Transform Agriculture Together?"}
          </h2>
          <p className={`text-lg md:text-xl text-muted-foreground mb-8 ${isHindi ? 'font-hindi' : ''}`}>
            {isHindi 
              ? "पहले से DataKhet के साथ पार्टनरशिप कर रहे प्रमुख संगठनों से जुड़ें" 
              : "Join leading organizations already partnering with DataKhet"}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className={`text-lg px-8 py-4 ${isHindi ? 'font-hindi' : ''}`}>
              <Handshake className="mr-2 h-5 w-5" />
              {isHindi ? "पार्टनरशिप चर्चा शुरू करें" : "Start Partnership Discussion"}
            </Button>
            <Button size="lg" variant="outline" className={`text-lg px-8 py-4 ${isHindi ? 'font-hindi' : ''}`}>
              {isHindi ? "पार्टनरशिप डेक डाउनलोड करें" : "Download Partnership Deck"}
            </Button>
          </div>
        </div>
      </section>
      
      {/* Cross-navigation */}
      <section className="py-6 flex flex-wrap justify-center gap-4 text-sm border-t border-border mx-4">
        <Link to="/vision" className={`text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors ${isHindi ? 'font-hindi' : ''}`}>
          {t('nav_vision')}
          <ArrowRight className="w-3 h-3" />
        </Link>
        <span className="text-border">•</span>
        <Link to="/about" className={`text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors ${isHindi ? 'font-hindi' : ''}`}>
          {t('nav_about')}
          <ArrowRight className="w-3 h-3" />
        </Link>
      </section>
    </div>
  );
};

export default Partners;
