import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Target, TrendingUp, Database, DollarSign, Calendar, FileText, ArrowRight } from "lucide-react";
import SecondaryNav from "@/components/SecondaryNav";
import { useLanguage } from "@/contexts/LanguageContext";

const Vision = () => {
  const { t, isHindi } = useLanguage();
  
  const roadmap = [
    {
      year: isHindi ? "साल 1" : "Year 1",
      title: isHindi ? "1 क्षेत्र में MVP" : "MVP in 1 Region",
      description: isHindi ? "पंजाब में 1,000 किसानों के साथ लॉन्च" : "Launch in Punjab with 1,000 farmers",
      goals: [
        isHindi ? "प्रूफ ऑफ कॉन्सेप्ट" : "Proof of concept", 
        isHindi ? "प्रोडक्ट-मार्केट फिट" : "Product-market fit", 
        isHindi ? "प्रारंभिक राजस्व" : "Initial revenue"
      ],
      status: "current"
    },
    {
      year: isHindi ? "साल 2" : "Year 2", 
      title: isHindi ? "फिनटेक + इनपुट बंडलिंग" : "Fintech + Input Bundling",
      description: isHindi ? "ऋण और इनपुट आपूर्ति सेवाएं जोड़ें" : "Add lending and input supply services",
      goals: [
        isHindi ? "क्रेडिट स्कोरिंग" : "Credit scoring", 
        isHindi ? "सप्लाई चेन पार्टनरशिप" : "Supply chain partnerships", 
        isHindi ? "5,000 किसान" : "5,000 farmers"
      ],
      status: "planned"
    },
    {
      year: isHindi ? "साल 3" : "Year 3",
      title: isHindi ? "फुल-स्टैक एग्री प्लेटफॉर्म" : "Full-Stack Agri Platform",
      description: isHindi ? "पूर्ण कृषि इकोसिस्टम" : "Complete agricultural ecosystem",
      goals: [
        isHindi ? "1,00,000 किसान" : "100,000 farmers", 
        isHindi ? "मल्टी-क्रॉप सपोर्ट" : "Multi-crop support", 
        isHindi ? "पैन-इंडिया उपस्थिति" : "Pan-India presence"
      ],
      status: "planned"
    }
  ];

  const monetization = [
    {
      model: isHindi ? "फ्रीमियम SaaS" : "Freemium SaaS",
      description: isHindi ? "बेसिक मुफ्त, प्रीमियम पेड" : "Basic alerts free, premium analytics paid",
      revenue: isHindi ? "₹50-200/किसान/महीना" : "₹50-200/farmer/month",
      icon: TrendingUp
    },
    {
      model: isHindi ? "B2B डेटा सेल्स" : "B2B Data Sales",
      description: isHindi ? "एग्रीबिजनेस को डेटा" : "Anonymized agricultural data to agribusiness",
      revenue: isHindi ? "₹10M+ सालाना" : "₹10M+ annually",
      icon: Database
    },
    {
      model: isHindi ? "एम्बेडेड लेंडिंग" : "Embedded Lending",
      description: isHindi ? "पार्टनर बैंकों से क्रेडिट" : "Credit facilitation with partner banks",
      revenue: isHindi ? "लोन वैल्यू का 2-3%" : "2-3% of loan value",
      icon: DollarSign
    },
    {
      model: isHindi ? "टोकनाइज्ड फ्यूचर्स" : "Tokenized Futures",
      description: isHindi ? "प्री-हार्वेस्ट क्रॉप फाइनेंसिंग" : "Pre-harvest crop financing and trading",
      revenue: isHindi ? "1-2% ट्रांजैक्शन फीस" : "1-2% transaction fee",
      icon: Target
    }
  ];

  const dataMoats = [
    isHindi ? "प्रोप्राइटरी सॉइल हेल्थ डेटाबेस" : "Proprietary soil health database",
    isHindi ? "क्रॉप यील्ड प्रेडिक्शन मॉडल" : "Crop yield prediction models",
    isHindi ? "रीजनल वेदर पैटर्न" : "Regional weather patterns",
    isHindi ? "फार्मर बिहेवियर एनालिटिक्स" : "Farmer behavior analytics",
    isHindi ? "मार्केट प्राइस कोरिलेशन" : "Market price correlations"
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <SecondaryNav title={t('nav_vision')} />
      
      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-gradient-hero text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className={`text-3xl md:text-5xl font-bold mb-6 ${isHindi ? 'font-hindi' : ''}`}>
              {isHindi ? "एग्री-इकॉनमी को" : "Redesigning the Agri-Economy"}
              <span className="block text-secondary">
                {isHindi ? "नए सिरे से डिज़ाइन करना" : "from the Ground Up"}
              </span>
            </h1>
            <p className={`text-lg md:text-xl mb-8 opacity-90 ${isHindi ? 'font-hindi' : ''}`}>
              {isHindi 
                ? "AI, IoT और वित्तीय समावेशन के साथ खेती का डेटा-ड्रिवन भविष्य बनाना" 
                : "Building the data-driven future of farming with AI, IoT, and financial inclusion"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className={`bg-secondary text-secondary-foreground hover:bg-secondary/90 ${isHindi ? 'font-hindi' : ''}`}>
                <FileText className="mr-2 h-5 w-5" />
                {isHindi ? "पूरा डेक देखें" : "View Full Deck"}
              </Button>
              <Button size="lg" variant="outline" className={`border-white text-white hover:bg-white hover:text-primary ${isHindi ? 'font-hindi' : ''}`}>
                <Calendar className="mr-2 h-5 w-5" />
                {isHindi ? "कॉल बुक करें" : "Book a Call"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className={`text-2xl md:text-4xl font-bold text-center text-foreground mb-12 ${isHindi ? 'font-hindi' : ''}`}>
            {isHindi ? "तीन साल का रोडमैप" : "Three-Year Roadmap to Agri Dominance"}
          </h2>
          
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              {roadmap.map((phase, index) => (
                <Card key={index} className={`border-0 shadow-soft ${phase.status === 'current' ? 'ring-2 ring-primary' : ''}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant={phase.status === 'current' ? 'default' : 'secondary'} className={isHindi ? 'font-hindi' : ''}>
                        {phase.year}
                      </Badge>
                      {phase.status === 'current' && (
                        <Badge className={`bg-accent text-accent-foreground ${isHindi ? 'font-hindi' : ''}`}>
                          {isHindi ? "वर्तमान" : "Current"}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className={`text-lg md:text-xl text-foreground ${isHindi ? 'font-hindi' : ''}`}>
                      {phase.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className={`text-muted-foreground mb-6 ${isHindi ? 'font-hindi' : ''}`}>
                      {phase.description}
                    </p>
                    <ul className="space-y-2">
                      {phase.goals.map((goal, goalIndex) => (
                        <li key={goalIndex} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                          <span className={`text-sm text-muted-foreground ${isHindi ? 'font-hindi' : ''}`}>{goal}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Data Moats */}
      <section className="py-12 md:py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className={`text-2xl md:text-4xl font-bold text-foreground mb-8 ${isHindi ? 'font-hindi' : ''}`}>
              {isHindi ? "हमारे डिफेंसिबल डेटा मोट्स" : "Our Defensible Data Moats"}
            </h2>
            <p className={`text-lg md:text-xl text-muted-foreground mb-12 ${isHindi ? 'font-hindi' : ''}`}>
              {isHindi 
                ? "महत्वपूर्ण कृषि डेटा का मालिकाना अजेय प्रतिस्पर्धात्मक लाभ बनाता है" 
                : "Owning critical agricultural data creates insurmountable competitive advantages"}
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {dataMoats.map((moat, index) => (
                <Card key={index} className="border-0 shadow-soft">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-earth rounded-full flex items-center justify-center mx-auto mb-4">
                      <Database className="h-6 w-6 text-white" />
                    </div>
                    <p className={`font-semibold text-foreground ${isHindi ? 'font-hindi' : ''}`}>{moat}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Monetization */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className={`text-2xl md:text-4xl font-bold text-center text-foreground mb-12 ${isHindi ? 'font-hindi' : ''}`}>
            {isHindi ? "मल्टीपल रेवेन्यू स्ट्रीम्स" : "Multiple Revenue Streams"}
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
            {monetization.map((model, index) => {
              const Icon = model.icon;
              return (
                <Card key={index} className="border-0 shadow-soft">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-earth rounded-full flex items-center justify-center">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className={`text-lg md:text-xl text-foreground ${isHindi ? 'font-hindi' : ''}`}>
                          {model.model}
                        </CardTitle>
                        <Badge variant="secondary" className={`mt-1 ${isHindi ? 'font-hindi' : ''}`}>
                          {model.revenue}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className={`text-muted-foreground ${isHindi ? 'font-hindi' : ''}`}>
                      {model.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Market Size */}
      <section className="py-12 md:py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className={`text-2xl md:text-4xl font-bold text-foreground mb-12 ${isHindi ? 'font-hindi' : ''}`}>
              {isHindi ? "विशाल बाज़ार अवसर" : "Massive Market Opportunity"}
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6 md:gap-8 mb-12">
              <div>
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">146M</div>
                <p className={`text-muted-foreground ${isHindi ? 'font-hindi' : ''}`}>
                  {isHindi ? "कृषि होल्डिंग्स" : "Agricultural Holdings"}
                </p>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-accent mb-2">$400B</div>
                <p className={`text-muted-foreground ${isHindi ? 'font-hindi' : ''}`}>
                  {isHindi ? "भारतीय कृषि बाज़ार" : "Indian Agriculture Market"}
                </p>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-secondary mb-2">86%</div>
                <p className={`text-muted-foreground ${isHindi ? 'font-hindi' : ''}`}>
                  {isHindi ? "छोटे और सीमांत किसान" : "Small & Marginal Farmers"}
                </p>
              </div>
            </div>

            <Card className="border-0 shadow-earth">
              <CardContent className="p-8">
                <h3 className={`text-xl md:text-2xl font-bold text-foreground mb-4 ${isHindi ? 'font-hindi' : ''}`}>
                  {isHindi ? "कुल एड्रेसेबल मार्केट (TAM)" : "Total Addressable Market (TAM)"}
                </h3>
                <div className="text-4xl md:text-5xl font-bold text-primary mb-4">$50B+</div>
                <p className={`text-muted-foreground ${isHindi ? 'font-hindi' : ''}`}>
                  {isHindi 
                    ? "दुनिया की सबसे बड़ी कृषि अर्थव्यवस्था में कृषि सेवाओं, वित्तीय उत्पादों और डेटा मॉनेटाइजेशन को मिलाकर" 
                    : "Combining agricultural services, financial products, and data monetization in the world's largest farming economy"}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className={`text-2xl md:text-4xl font-bold text-foreground mb-6 ${isHindi ? 'font-hindi' : ''}`}>
            {isHindi ? "हमारे साथ खेती का भविष्य बनाएं" : "Build the Future of Farming with Us"}
          </h2>
          <p className={`text-lg md:text-xl text-muted-foreground mb-8 ${isHindi ? 'font-hindi' : ''}`}>
            {isHindi 
              ? "146 मिलियन भारतीय किसानों के लिए कृषि को बदलने में हमारे साथ जुड़ें" 
              : "Join us in transforming agriculture for 146 million Indian farmers"}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className={`text-lg px-8 py-4 ${isHindi ? 'font-hindi' : ''}`}>
              <FileText className="mr-2 h-5 w-5" />
              {isHindi ? "पूरा पिच डेक डाउनलोड करें" : "Download Full Pitch Deck"}
            </Button>
            <Button size="lg" variant="outline" className={`text-lg px-8 py-4 ${isHindi ? 'font-hindi' : ''}`}>
              <Calendar className="mr-2 h-5 w-5" />
              {isHindi ? "इन्वेस्टर कॉल शेड्यूल करें" : "Schedule Investor Call"}
            </Button>
          </div>
        </div>
      </section>
      
      {/* Cross-navigation */}
      <section className="py-6 flex flex-wrap justify-center gap-4 text-sm border-t border-border mx-4">
        <Link to="/partners" className={`text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors ${isHindi ? 'font-hindi' : ''}`}>
          {t('nav_partners')}
          <ArrowRight className="w-3 h-3" />
        </Link>
        <span className="text-border">•</span>
        <Link to="/about" className={`text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors ${isHindi ? 'font-hindi' : ''}`}>
          {t('nav_about')}
          <ArrowRight className="w-3 h-3" />
        </Link>
        <span className="text-border">•</span>
        <Link to="/career" className={`text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors ${isHindi ? 'font-hindi' : ''}`}>
          {t('nav_career')}
          <ArrowRight className="w-3 h-3" />
        </Link>
      </section>
    </div>
  );
};

export default Vision;
