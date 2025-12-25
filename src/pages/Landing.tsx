import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sprout, CloudRain, TrendingUp, ArrowRight, ScanLine } from "lucide-react";
import heroImage from "@/assets/hero-farmer.jpg";

const Landing = () => {
  const features = [
    {
      icon: Sprout,
      title: "Smart Fertilizer Use",
      description: "AI-powered soil analysis tells you exactly what nutrients your crops need"
    },
    {
      icon: CloudRain,
      title: "Weather + Crop Health AI",
      description: "Real-time alerts for weather changes and early disease detection"
    },
    {
      icon: TrendingUp,
      title: "Direct-to-Market Sales",
      description: "Connect directly with buyers and get better prices for your harvest"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 bg-foreground/20" />
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              From Soil to Sale —{" "}
              <span className="text-secondary">AI That Puts Farmers First</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
              Get daily tips, maximize your crop, and sell at better prices — powered by real data.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center flex-wrap">
              <Button asChild size="lg" variant="earth">
                <Link to="/soil-scanner">
                  <ScanLine className="mr-2 h-5 w-5" />
                  AI Soil Scanner
                </Link>
              </Button>
              <Button asChild size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                <Link to="/onboard">
                  Join as Farmer
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="hero">
                <Link to="/partners">Partner With Us</Link>
              </Button>
              <Button asChild size="lg" variant="hero">
                <Link to="/vision">Investor Deck</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Three Ways We Help You Grow
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Simple technology that makes farming smarter, not harder
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-0 shadow-soft hover:shadow-earth transition-all duration-300">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-gradient-earth rounded-full flex items-center justify-center mx-auto mb-6">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Join 10,000+ farmers growing smarter
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Try AI farming for just ₹5 a day
          </p>
          <Button asChild size="lg" className="text-lg px-8 py-4">
            <Link to="/onboard">
              Start Growing Smarter Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Landing;