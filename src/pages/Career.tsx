import { Link } from "react-router-dom";
import { Users, Heart, Lightbulb, Globe, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SecondaryNav from "@/components/SecondaryNav";
import { useLanguage } from "@/contexts/LanguageContext";

const Career = () => {
  const { t, isHindi } = useLanguage();
  
  const values = [
    {
      icon: Heart,
      title: isHindi ? "किसान पहले" : "Farmer First",
      description: isHindi 
        ? "हर फैसला किसानों की भलाई को ध्यान में रखकर लिया जाता है" 
        : "Every decision is made keeping farmers' welfare in mind"
    },
    {
      icon: Lightbulb,
      title: isHindi ? "नवाचार" : "Innovation",
      description: isHindi 
        ? "हम समस्याओं को नए तरीके से सुलझाते हैं" 
        : "We solve problems in new ways"
    },
    {
      icon: Users,
      title: isHindi ? "टीमवर्क" : "Teamwork",
      description: isHindi 
        ? "मिलकर काम करना, मिलकर बढ़ना" 
        : "Work together, grow together"
    },
    {
      icon: Globe,
      title: isHindi ? "प्रभाव" : "Impact",
      description: isHindi 
        ? "लाखों किसानों के जीवन में बदलाव लाना" 
        : "Transforming lives of millions of farmers"
    }
  ];
  
  const openings = [
    {
      title: isHindi ? "AI/ML इंजीनियर" : "AI/ML Engineer",
      location: isHindi ? "रिमोट / बेंगलुरु" : "Remote / Bangalore",
      type: isHindi ? "पूर्णकालिक" : "Full-time"
    },
    {
      title: isHindi ? "फील्ड ऑपरेशन्स मैनेजर" : "Field Operations Manager",
      location: isHindi ? "पंजाब" : "Punjab",
      type: isHindi ? "पूर्णकालिक" : "Full-time"
    },
    {
      title: isHindi ? "प्रोडक्ट डिज़ाइनर" : "Product Designer",
      location: isHindi ? "रिमोट" : "Remote",
      type: isHindi ? "पूर्णकालिक" : "Full-time"
    }
  ];
  
  const benefits = [
    isHindi ? "लचीला काम का समय" : "Flexible working hours",
    isHindi ? "प्रतिस्पर्धी वेतन" : "Competitive salary",
    isHindi ? "स्वास्थ्य बीमा" : "Health insurance",
    isHindi ? "सीखने का बजट" : "Learning budget",
    isHindi ? "इक्विटी विकल्प" : "Equity options",
    isHindi ? "रिमोट-फ्रेंडली" : "Remote-friendly"
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <SecondaryNav title={t('career_title')} />
      
      {/* Hero */}
      <section className="bg-gradient-earth text-primary-foreground py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${isHindi ? 'font-hindi' : ''}`}>
            {t('career_title')}
          </h1>
          <p className={`text-lg opacity-90 ${isHindi ? 'font-hindi' : ''}`}>
            {t('career_subtitle')}
          </p>
        </div>
      </section>
      
      <main className="px-4 max-w-4xl mx-auto">
        {/* Our Culture */}
        <section className="py-10">
          <h2 className={`text-2xl font-bold mb-6 text-center ${isHindi ? 'font-hindi' : ''}`}>
            {t('career_culture_title')}
          </h2>
          <p className={`text-center text-muted-foreground mb-8 max-w-2xl mx-auto ${isHindi ? 'font-hindi' : ''}`}>
            {t('career_culture_desc')}
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="border-0 shadow-soft text-center">
                  <CardContent className="p-5">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className={`font-semibold mb-1 ${isHindi ? 'font-hindi' : ''}`}>{value.title}</h3>
                    <p className={`text-xs text-muted-foreground ${isHindi ? 'font-hindi' : ''}`}>{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
        
        {/* Why Join */}
        <section className="py-10 bg-muted/30 -mx-4 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className={`text-2xl font-bold mb-6 text-center ${isHindi ? 'font-hindi' : ''}`}>
              {t('career_why_join')}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {benefits.map((benefit, index) => (
                <div key={index} className={`bg-card rounded-lg p-4 text-center shadow-soft ${isHindi ? 'font-hindi' : ''}`}>
                  {benefit}
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Current Openings */}
        <section className="py-10">
          <h2 className={`text-2xl font-bold mb-6 text-center ${isHindi ? 'font-hindi' : ''}`}>
            {t('career_openings')}
          </h2>
          
          {openings.length > 0 ? (
            <div className="space-y-4">
              {openings.map((job, index) => (
                <Card key={index} className="border-0 shadow-soft hover:shadow-earth transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div>
                        <h3 className={`font-semibold text-lg ${isHindi ? 'font-hindi' : ''}`}>{job.title}</h3>
                        <p className={`text-sm text-muted-foreground ${isHindi ? 'font-hindi' : ''}`}>
                          {job.location} • {job.type}
                        </p>
                      </div>
                      <Button size="sm" className={isHindi ? 'font-hindi' : ''}>
                        {t('career_apply')}
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className={`text-center text-muted-foreground ${isHindi ? 'font-hindi' : ''}`}>
              {t('career_no_openings')}
            </p>
          )}
        </section>
        
        {/* Contact CTA */}
        <section className="py-10 text-center">
          <Card className="border-0 shadow-earth bg-gradient-to-br from-primary/5 to-accent/5">
            <CardContent className="p-8">
              <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className={`text-xl font-bold mb-2 ${isHindi ? 'font-hindi' : ''}`}>
                {isHindi ? "कोई सवाल है?" : "Have Questions?"}
              </h3>
              <p className={`text-muted-foreground mb-4 ${isHindi ? 'font-hindi' : ''}`}>
                {isHindi ? "हमें ईमेल करें" : "Email us at"}
              </p>
              <a 
                href="mailto:careers@datakhet.com" 
                className="text-primary font-semibold hover:underline"
              >
                careers@datakhet.com
              </a>
            </CardContent>
          </Card>
        </section>
        
        {/* Navigation Links */}
        <section className="py-6 flex flex-wrap justify-center gap-4 text-sm">
          <Link to="/about" className={`text-muted-foreground hover:text-primary transition-colors ${isHindi ? 'font-hindi' : ''}`}>
            {t('nav_about')}
          </Link>
          <span className="text-border">•</span>
          <Link to="/vision" className={`text-muted-foreground hover:text-primary transition-colors ${isHindi ? 'font-hindi' : ''}`}>
            {t('nav_vision')}
          </Link>
          <span className="text-border">•</span>
          <Link to="/" className={`text-muted-foreground hover:text-primary transition-colors ${isHindi ? 'font-hindi' : ''}`}>
            {t('nav_home')}
          </Link>
        </section>
      </main>
    </div>
  );
};

export default Career;
