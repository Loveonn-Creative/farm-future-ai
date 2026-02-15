import { Link, useLocation } from "react-router-dom";
import { Scan, History, HelpCircle, ChevronDown, Crown, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

const DesktopNav = () => {
  const location = useLocation();
  const { t, isHindi } = useLanguage();
  const { isAuthenticated, isPremium } = useAuth();

  const navItems = [
    { path: "/", label: t('nav_scan'), icon: Scan },
    { path: "/history", label: t('nav_history'), icon: History },
    { path: "/help", label: t('nav_help'), icon: HelpCircle },
  ];

  const moreItems = [
    { path: "/about", label: t('nav_about') },
    { path: "/how-it-works", label: t('nav_how_it_works') },
    { path: "/pricing", label: t('nav_pricing') },
    { path: "/career", label: t('nav_career') },
    { path: "/vision", label: t('nav_vision') },
    { path: "/partners", label: t('nav_partners') },
  ];

  const isActive = (path: string) => location.pathname === path;

  // Determine CTA button
  const ctaLink = !isAuthenticated ? "/pricing" : isPremium ? "/profile" : "/pricing";
  const ctaLabel = !isAuthenticated
    ? t('nav_subscribe')
    : isPremium
      ? (isHindi ? "प्रोफ़ाइल" : "Profile")
      : (isHindi ? "अपग्रेड करें" : "Upgrade");
  const CtaIcon = isPremium ? User : Crown;

  return (
    <nav className="hidden md:flex items-center justify-between px-6 py-3 bg-card border-b border-border">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <span className="text-2xl">🌱</span>
        <span className="text-xl font-bold text-primary">DataKhet</span>
      </Link>

      {/* Nav links */}
      <div className="flex items-center gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isHindi ? 'font-hindi' : ''} transition-colors ${
                isActive(item.path)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
        
        {/* More dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className={`flex items-center gap-1 px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors ${isHindi ? 'font-hindi' : ''}`}>
              {t('nav_more')}
              <ChevronDown className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {moreItems.map((item) => (
              <DropdownMenuItem key={item.path} asChild>
                <Link to={item.path} className={`w-full ${isHindi ? 'font-hindi' : ''}`}>
                  {item.label}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* CTA */}
      <Link to={ctaLink}>
        <Button className={`bg-primary hover:bg-primary-hover ${isHindi ? 'font-hindi' : ''}`}>
          <CtaIcon className="w-4 h-4 mr-2" />
          {ctaLabel}
        </Button>
      </Link>
    </nav>
  );
};

export default DesktopNav;
