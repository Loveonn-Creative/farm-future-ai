import { Link } from "react-router-dom";
import { ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import SecondaryNav from "@/components/SecondaryNav";
import { useLanguage } from "@/contexts/LanguageContext";

const Career = () => {
  const { t, isHindi } = useLanguage();
  
  const openings = [
    {
      title: isHindi ? "फ़ील्ड ऑपरेशंस लीड" : "Field Operations Lead",
      location: isHindi ? "उत्तर प्रदेश" : "Uttar Pradesh",
      type: isHindi ? "पूर्णकालिक" : "Full-time",
    },
    {
      title: isHindi ? "ML इंजीनियर" : "ML Engineer",
      location: isHindi ? "रिमोट" : "Remote",
      type: isHindi ? "पूर्णकालिक" : "Full-time",
    },
    {
      title: isHindi ? "कृषि विशेषज्ञ" : "Agriculture Specialist",
      location: isHindi ? "पंजाब / हरियाणा" : "Punjab / Haryana",
      type: isHindi ? "पूर्णकालिक" : "Full-time",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <SecondaryNav title={t('nav_career')} />
      
      {/* Hero - What joining means */}
      <header className="bg-gradient-earth text-primary-foreground py-16 px-4 text-center">
        <h1 className={`text-2xl md:text-3xl font-bold ${isHindi ? 'font-hindi' : ''}`}>
          {t('career_hero')}
        </h1>
      </header>

      <main className="px-4 max-w-2xl mx-auto">
        
        {/* The Work - What you'll actually do */}
        <section className="py-12 border-b border-border">
          <h2 className={`text-lg font-semibold mb-6 ${isHindi ? 'font-hindi' : ''}`}>
            {t('career_the_work')}
          </h2>
          <div className="space-y-3">
            <p className={`text-foreground ${isHindi ? 'font-hindi' : ''}`}>
              {t('career_work_line1')}
            </p>
            <p className={`text-foreground ${isHindi ? 'font-hindi' : ''}`}>
              {t('career_work_line2')}
            </p>
            <p className={`text-foreground ${isHindi ? 'font-hindi' : ''}`}>
              {t('career_work_line3')}
            </p>
          </div>
        </section>

        {/* What We Expect - Principles, not values */}
        <section className="py-12 border-b border-border">
          <h2 className={`text-lg font-semibold mb-6 ${isHindi ? 'font-hindi' : ''}`}>
            {t('career_expectations')}
          </h2>
          <div className="space-y-4">
            <p className={`text-foreground ${isHindi ? 'font-hindi' : ''}`}>
              {t('career_ownership')}
            </p>
            <p className={`text-foreground ${isHindi ? 'font-hindi' : ''}`}>
              {t('career_field')}
            </p>
            <p className={`text-foreground ${isHindi ? 'font-hindi' : ''}`}>
              {t('career_execution')}
            </p>
          </div>
        </section>

        {/* Open Roles - Clean list */}
        <section className="py-12 border-b border-border">
          <h2 className={`text-lg font-semibold mb-6 ${isHindi ? 'font-hindi' : ''}`}>
            {t('career_roles')}
          </h2>
          <div className="space-y-4">
            {openings.map((role, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-4 bg-muted/30 rounded-lg"
              >
                <div>
                  <p className={`font-medium ${isHindi ? 'font-hindi' : ''}`}>{role.title}</p>
                  <p className={`text-sm text-muted-foreground ${isHindi ? 'font-hindi' : ''}`}>
                    {role.location} · {role.type}
                  </p>
                </div>
                <a href="mailto:careers@datakhet.com">
                  <Button size="sm" variant="outline" className={`${isHindi ? 'font-hindi' : ''}`}>
                    {t('career_apply')}
                  </Button>
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* No Role Fits - Simple contact */}
        <section className="py-12 border-b border-border text-center">
          <p className={`text-muted-foreground mb-3 ${isHindi ? 'font-hindi' : ''}`}>
            {t('career_no_fit')}
          </p>
          <a 
            href="mailto:careers@datakhet.com" 
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            <Mail className="w-4 h-4" />
            careers@datakhet.com
          </a>
        </section>

        {/* Cross-navigation */}
        <section className="py-6 flex flex-wrap justify-center gap-4 text-sm border-t border-border">
          <Link to="/about" className={`text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors ${isHindi ? 'font-hindi' : ''}`}>
            {t('nav_about')}
            <ArrowRight className="w-3 h-3" />
          </Link>
          <span className="text-border">•</span>
          <Link to="/vision" className={`text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors ${isHindi ? 'font-hindi' : ''}`}>
            {t('nav_vision')}
            <ArrowRight className="w-3 h-3" />
          </Link>
        </section>
      </main>
    </div>
  );
};

export default Career;