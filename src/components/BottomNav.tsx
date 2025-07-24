import { Link, useLocation } from "react-router-dom";
import { Home, BookOpen, UserPlus, MessageCircle } from "lucide-react";

const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/how-it-works", label: "How It Works", icon: BookOpen },
    { href: "/onboard", label: "Join", icon: UserPlus },
    { href: "/faq", label: "Contact", icon: MessageCircle },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 md:hidden">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full space-y-1 ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              <Icon size={20} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;