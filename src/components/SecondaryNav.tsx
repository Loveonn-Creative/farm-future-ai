import { Link, useLocation } from "react-router-dom";
import { ChevronLeft, Menu, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useLanguage } from "@/contexts/LanguageContext";

interface SecondaryNavProps {
  title?: string;
  showBack?: boolean;
}

const SecondaryNav = ({ title, showBack = true }: SecondaryNavProps) => {
  const location = useLocation();
  const { t, isHindi } = useLanguage();
  
  const secondaryPages = [
    { path: "/about", label: t('nav_about') },
    { path: "/how-it-works", label: t('nav_how_it_works') },
    { path: "/pricing", label: t('nav_pricing') },
    { path: "/career", label: t('nav_career') },
    { path: "/vision", label: t('nav_vision') },
    { path: "/partners", label: t('nav_partners') },
    { path: "/faq", label: t('nav_faq') },
  ];
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-sm border-b border-border">
      <div className="flex items-center justify-between px-4 py-3 max-w-5xl mx-auto">
        {/* Left: Back button or Logo */}
        <div className="flex items-center gap-3">
          {showBack && (
            <Link to="/" className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </Link>
          )}
          <Link to="/" className="flex items-center gap-2">
            <Sprout className="w-6 h-6 text-primary" />
            <span className="font-bold text-primary hidden sm:inline">DataKhet</span>
          </Link>
        </div>
        
        {/* Center: Page title */}
        {title && (
          <h1 className={`text-lg font-semibold ${isHindi ? 'font-hindi' : ''} text-foreground`}>
            {title}
          </h1>
        )}
        
        {/* Right: Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetHeader className="pb-4 border-b border-border">
              <SheetTitle className="flex items-center gap-2">
                <Sprout className="w-5 h-5 text-primary" />
                DataKhet
              </SheetTitle>
            </SheetHeader>
            
            <nav className="mt-6 space-y-1">
              {/* Primary action */}
              <Link
                to="/"
                className={`block px-4 py-3 rounded-lg ${isHindi ? 'font-hindi' : ''} font-medium text-primary bg-primary/10 hover:bg-primary/20 transition-colors mb-4`}
              >
                {t('nav_scan')}
              </Link>
              
              {/* Secondary pages */}
              {secondaryPages.map((page) => (
                <Link
                  key={page.path}
                  to={page.path}
                  className={`block px-4 py-2.5 rounded-lg ${isHindi ? 'font-hindi' : ''} transition-colors ${
                    isActive(page.path)
                      ? "bg-muted text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {page.label}
                </Link>
              ))}
              
              {/* Subscribe CTA */}
              <div className="pt-4 mt-4 border-t border-border">
                <Link to="/subscribe">
                  <Button className={`w-full ${isHindi ? 'font-hindi' : ''}`}>
                    {t('nav_subscribe')}
                  </Button>
                </Link>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default SecondaryNav;
