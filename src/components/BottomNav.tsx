import { Link, useLocation } from "react-router-dom";
import { ScanLine, ScrollText, Headphones } from "lucide-react";

const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    { href: "/", label: "जांच", icon: ScanLine },
    { href: "/history", label: "इतिहास", icon: ScrollText },
    { href: "/help", label: "मदद", icon: Headphones },
  ];

  // Hide on camera/full-screen pages
  if (location.pathname === "/scan-results") {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 md:hidden safe-area-bottom">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full space-y-1 transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-xs font-medium font-hindi">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;