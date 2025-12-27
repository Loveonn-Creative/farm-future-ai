import { Link, useLocation } from "react-router-dom";
import { Scan, History, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const DesktopNav = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "जांच", icon: Scan },
    { path: "/history", label: "इतिहास", icon: History },
    { path: "/help", label: "मदद", icon: HelpCircle },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="hidden md:flex items-center justify-between px-6 py-3 bg-card border-b border-border">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <span className="text-2xl">🌱</span>
        <span className="text-xl font-bold text-primary font-hindi">DataKhet</span>
      </Link>

      {/* Nav links */}
      <div className="flex items-center gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-hindi transition-colors ${
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
      </div>

      {/* Subscribe CTA */}
      <Link to="/subscribe">
        <Button className="font-hindi bg-primary hover:bg-primary-hover">
          सदस्यता लें
        </Button>
      </Link>
    </nav>
  );
};

export default DesktopNav;
