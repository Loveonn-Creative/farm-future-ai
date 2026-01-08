import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SecondaryNav from "@/components/SecondaryNav";
import { useLanguage } from "@/contexts/LanguageContext";

const About = () => {
  const { t, isHindi } = useLanguage();

  return (
    <div className="min-h-screen bg-background pb-24">
      <SecondaryNav title={t('nav_about')} />
      
      {/* Hero - One line, let it breathe */}
      <header className="bg-gradient-earth text-primary-foreground py-16 px-4 text-center">
        <h1 className={`text-2xl md:text-3xl font-bold ${isHindi ? 'font-hindi' : ''}`}>
          {t('about_hero_new')}
        </h1>
      </header>

      <main className="px-4 max-w-2xl mx-auto">
        
        {/* What We Do - Three precise lines */}
        <section className="py-12 border-b border-border">
          <h2 className={`text-lg font-semibold mb-6 ${isHindi ? 'font-hindi' : ''}`}>
            {t('about_what_we_do')}
          </h2>
          <div className="space-y-4">
            <p className={`text-foreground ${isHindi ? 'font-hindi' : ''}`}>
              {t('about_soil_line')}
            </p>
            <p className={`text-foreground ${isHindi ? 'font-hindi' : ''}`}>
              {t('about_crop_line')}
            </p>
            <p className={`text-foreground ${isHindi ? 'font-hindi' : ''}`}>
              {t('about_market_line')}
            </p>
          </div>
        </section>

        {/* How It Works - Simple, farmer language */}
        <section className="py-12 border-b border-border">
          <h2 className={`text-lg font-semibold mb-4 ${isHindi ? 'font-hindi' : ''}`}>
            {t('about_how_title')}
          </h2>
          <p className={`text-muted-foreground ${isHindi ? 'font-hindi' : ''}`}>
            {t('about_how_line')}
          </p>
        </section>

        {/* Three Outcomes - Not pillars, outcomes */}
        <section className="py-12 border-b border-border">
          <h2 className={`text-lg font-semibold mb-6 ${isHindi ? 'font-hindi' : ''}`}>
            {t('about_outcomes')}
          </h2>
          <div className="space-y-6">
            <div>
              <p className={`font-medium text-foreground ${isHindi ? 'font-hindi' : ''}`}>
                {t('about_outcome1_title')}
              </p>
              <p className={`text-sm text-muted-foreground mt-1 ${isHindi ? 'font-hindi' : ''}`}>
                {t('about_outcome1_desc')}
              </p>
            </div>
            <div>
              <p className={`font-medium text-foreground ${isHindi ? 'font-hindi' : ''}`}>
                {t('about_outcome2_title')}
              </p>
              <p className={`text-sm text-muted-foreground mt-1 ${isHindi ? 'font-hindi' : ''}`}>
                {t('about_outcome2_desc')}
              </p>
            </div>
            <div>
              <p className={`font-medium text-foreground ${isHindi ? 'font-hindi' : ''}`}>
                {t('about_outcome3_title')}
              </p>
              <p className={`text-sm text-muted-foreground mt-1 ${isHindi ? 'font-hindi' : ''}`}>
                {t('about_outcome3_desc')}
              </p>
            </div>
          </div>
        </section>

        {/* Who We Are - Specific, grounded */}
        <section className="py-12 border-b border-border">
          <h2 className={`text-lg font-semibold mb-4 ${isHindi ? 'font-hindi' : ''}`}>
            {t('about_who_we_are')}
          </h2>
          <p className={`text-muted-foreground ${isHindi ? 'font-hindi' : ''}`}>
            {t('about_company_line')}
          </p>
        </section>

        {/* CTA - Simple action */}
        <section className="py-12 text-center">
          <Link to="/">
            <Button size="lg" className={`${isHindi ? 'font-hindi' : ''}`}>
              {t('about_cta')}
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