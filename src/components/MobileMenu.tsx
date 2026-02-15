import { Link } from "react-router-dom";
import { Menu, Sprout, Crown, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

const MobileMenu = () => {
  const { t, isHindi } = useLanguage();
  const { isAuthenticated, isPremium } = useAuth();
  
  const menuItems = [
    { path: "/about", label: t('nav_about') },
    { path: "/how-it-works", label: t('nav_how_it_works') },
    { path: "/features", label: isHindi ? 'विशेषताएं' : 'Features' },
    { path: "/pricing", label: t('nav_pricing') },
    { path: "/career", label: t('nav_career') },
    { path: "/partners", label: t('nav_partners') },
    { path: "/faq", label: t('nav_faq') },
  ];

  // Determine CTA
  const ctaLink = !isAuthenticated ? "/pricing" : "/profile";
  const ctaLabel = !isAuthenticated
    ? t('nav_subscribe')
    : (isHindi ? "प्रोफ़ाइल" : "Profile");
  
  return (
    <div className="fixed top-0 left-0 right-0 z-40 md:hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-background/95 backdrop-blur-sm border-b border-border">
        <Link to="/" className="flex items-center gap-2">
          <Sprout className="w-6 h-6 text-primary" />
          <span className="font-bold text-primary">DataKhet</span>
        </Link>
        
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
              
              {/* Menu items */}
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-4 py-2.5 rounded-lg ${isHindi ? 'font-hindi' : ''} transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/50`}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Auth-aware CTA */}
              <div className="pt-4 mt-4 border-t border-border space-y-2">
                <Link to={ctaLink}>
                  <Button className={`w-full ${isHindi ? 'font-hindi' : ''}`}>
                    {isAuthenticated ? <User className="w-4 h-4 mr-2" /> : <Crown className="w-4 h-4 mr-2" />}
                    {ctaLabel}
                  </Button>
                </Link>
                {!isAuthenticated && (
                  <Link to="/auth" className="block">
                    <Button variant="outline" className={`w-full ${isHindi ? 'font-hindi' : ''}`}>
                      {isHindi ? "लॉगिन करें" : "Sign In"}
                    </Button>
                  </Link>
                )}
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default MobileMenu;
