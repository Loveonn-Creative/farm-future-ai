import { Link } from "react-router-dom";
import { Sprout, TrendingUp, IndianRupee, ArrowRight, Users, Target, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SecondaryNav from "@/components/SecondaryNav";
import { useLanguage } from "@/contexts/LanguageContext";

const About = () => {
  const { t, isHindi } = useLanguage();
  
  const pillars = [
    {
      icon: <Sprout className="w-8 h-8" />,
      title: t('pillar_soil'),
      description: t('pillar_soil_desc'),
      color: "bg-earth-brown/10 text-earth-brown",
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: t('pillar_crop'),
      description: t('pillar_crop_desc'),
      color: "bg-success/10 text-success",
    },
    {
      icon: <IndianRupee className="w-8 h-8" />,
      title: t('pillar_price'),
      description: t('pillar_price_desc'),
      color: "bg-primary/10 text-primary",
    },
  ];
  
  const features = [
    {
      icon: Smartphone,
      title: isHindi ? "सरल इंटरफ़ेस" : "Simple Interface",
      desc: isHindi ? "कोई भी किसान आसानी से उपयोग कर सकता है" : "Any farmer can use it easily"
    },
    {
      icon: Target,
      title: isHindi ? "सटीक विश्लेषण" : "Accurate Analysis",
      desc: isHindi ? "AI-संचालित मिट्टी और फसल जांच" : "AI-powered soil and crop analysis"
    },
    {
      icon: Users,
      title: isHindi ? "किसान समुदाय" : "Farmer Community",
      desc: isHindi ? "हज़ारों किसानों का भरोसा" : "Trusted by thousands of farmers"
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <SecondaryNav title={t('nav_about')} />
      
      {/* Hero */}
      <header className="bg-gradient-earth text-primary-foreground py-10 px-4 text-center">
        <h1 className={`text-3xl md:text-4xl font-bold animate-sunrise ${isHindi ? 'font-hindi' : ''}`}>
          {t('about_hero_title')}
        </h1>
        <p className="text-primary-foreground/80 mt-2">
          {t('about_hero_subtitle')}
        </p>
      </header>

      <main className="px-4 max-w-3xl mx-auto">
        {/* Product Section */}
        <section className="py-10">
          <h2 className={`text-2xl font-bold text-center mb-4 ${isHindi ? 'font-hindi' : ''}`}>
            {t('about_product_title')}
          </h2>
          <p className={`text-center text-muted-foreground leading-relaxed ${isHindi ? 'font-hindi' : ''}`}>
            {t('about_product_desc')}
          </p>
          
          <div className="grid md:grid-cols-3 gap-4 mt-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-0 shadow-soft text-center">
                  <CardContent className="p-5">
                    <Icon className="w-10 h-10 text-primary mx-auto mb-3" />
                    <h3 className={`font-semibold mb-1 ${isHindi ? 'font-hindi' : ''}`}>{feature.title}</h3>
                    <p className={`text-sm text-muted-foreground ${isHindi ? 'font-hindi' : ''}`}>{feature.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Mission Statement */}
        <section className="py-8 bg-muted/30 -mx-4 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className={`text-2xl font-bold mb-4 ${isHindi ? 'font-hindi' : ''}`}>
              {t('about_mission_title')}
            </h2>
            <p className={`text-xl leading-relaxed ${isHindi ? 'font-hindi' : ''}`}>
              {t('about_mission_desc')}
            </p>
          </div>
        </section>

        {/* Three Pillars */}
        <section className="py-10">
          <h2 className={`text-xl font-semibold text-center mb-6 ${isHindi ? 'font-hindi' : ''}`}>
            {isHindi ? "हमारे तीन स्तंभ" : "Our Three Pillars"}
          </h2>
          <div className="space-y-4">
            {pillars.map((pillar, index) => (
              <div
                key={index}
                className={`${pillar.color} rounded-xl p-5 animate-slide-up`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">{pillar.icon}</div>
                  <div>
                    <h3 className={`text-lg font-semibold ${isHindi ? 'font-hindi' : ''}`}>{pillar.title}</h3>
                    <p className={`text-sm opacity-80 ${isHindi ? 'font-hindi' : ''}`}>{pillar.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Company Section */}
        <section className="py-8">
          <h2 className={`text-2xl font-bold text-center mb-4 ${isHindi ? 'font-hindi' : ''}`}>
            {t('about_company_title')}
          </h2>
          <p className={`text-center text-muted-foreground leading-relaxed ${isHindi ? 'font-hindi' : ''}`}>
            {t('about_company_desc')}
          </p>
        </section>

        {/* Stats */}
        <section className="py-8">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">10,000+</p>
              <p className={`text-xs text-muted-foreground ${isHindi ? 'font-hindi' : ''}`}>{t('stat_scans')}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-success">85%</p>
              <p className={`text-xs text-muted-foreground ${isHindi ? 'font-hindi' : ''}`}>{t('stat_accuracy')}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-accent">₹0</p>
              <p className={`text-xs text-muted-foreground ${isHindi ? 'font-hindi' : ''}`}>{t('stat_free')}</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-8 text-center">
          <Link to="/">
            <Button size="lg" className={`text-lg w-full max-w-xs ${isHindi ? 'font-hindi' : ''}`}>
              {t('start_now')}
            </Button>
          </Link>
        </section>
        
        {/* Cross-navigation */}
        <section className="py-6 flex flex-wrap justify-center gap-4 text-sm border-t border-border">
          <Link to="/how-it-works" className={`text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors ${isHindi ? 'font-hindi' : ''}`}>
            {t('nav_how_it_works')}
            <ArrowRight className="w-3 h-3" />
          </Link>
          <span className="text-border">•</span>
          <Link to="/pricing" className={`text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors ${isHindi ? 'font-hindi' : ''}`}>
            {t('nav_pricing')}
            <ArrowRight className="w-3 h-3" />
          </Link>
          <span className="text-border">•</span>
          <Link to="/career" className={`text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors ${isHindi ? 'font-hindi' : ''}`}>
            {t('nav_career')}
            <ArrowRight className="w-3 h-3" />
          </Link>
        </section>
      </main>
    </div>
  );
};

export default About;
