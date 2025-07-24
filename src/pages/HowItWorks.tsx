import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Smartphone, Brain, ShoppingCart, ArrowRight, CheckCircle } from "lucide-react";
import aerialFarm from "@/assets/aerial-farm.jpg";

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      icon: Smartphone,
      title: "Smart Data Collection",
      description: "Soil sensors + satellite data → get WhatsApp/SMS insights",
      details: "We install affordable sensors on your farm and combine data from satellites to monitor your soil health, moisture levels, and crop conditions in real-time."
    },
    {
      number: "02", 
      icon: Brain,
      title: "AI Recommendations",
      description: "AI tells you exactly what to do (fertilizer, watering)",
      details: "Our AI analyzes your farm data and sends you personalized recommendations via WhatsApp or SMS - no smartphone required. Get daily tips in your local language."
    },
    {
      number: "03",
      icon: ShoppingCart,
      title: "Direct Sales",
      description: "You sell directly to buyers using our app",
      details: "Connect with verified buyers, get fair prices, and arrange pickup directly through our platform. Skip the middleman and maximize your profits."
    }
  ];

  const testimonial = {
    name: "Rajesh Kumar",
    location: "Punjab, India",
    crop: "Rice & Wheat",
    quote: "AgriAI increased my yield by 35% and saved ₹15,000 on fertilizers in just one season. The WhatsApp tips are so easy to follow!",
    results: [
      "35% increase in yield",
      "₹15,000 saved on fertilizers", 
      "20% better market prices"
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              How AgriAI Works for You
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Three simple steps to smarter farming. No technical knowledge required.
            </p>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 1;
              
              return (
                <div key={index} className={`flex flex-col ${isEven ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 mb-20`}>
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold">
                        {step.number}
                      </div>
                      <div className="w-16 h-16 bg-gradient-earth rounded-full flex items-center justify-center">
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-4">
                      {step.title}
                    </h3>
                    <p className="text-lg text-accent font-semibold mb-4">
                      {step.description}
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.details}
                    </p>
                  </div>
                  
                  <div className="flex-1">
                    <Card className="border-0 shadow-soft">
                      <CardContent className="p-8">
                        <div 
                          className="h-64 bg-cover bg-center rounded-lg"
                          style={{ backgroundImage: `url(${aerialFarm})` }}
                        />
                      </CardContent>
                    </Card>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-16">
              Real Results from Real Farmers
            </h2>
            
            <Card className="border-0 shadow-earth">
              <CardContent className="p-8 md:p-12">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <blockquote className="text-lg text-foreground mb-6 italic leading-relaxed">
                      "{testimonial.quote}"
                    </blockquote>
                    <div className="mb-6">
                      <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                      <p className="text-muted-foreground">{testimonial.location}</p>
                      <p className="text-sm text-accent">{testimonial.crop}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-semibold text-foreground mb-4">Results:</h5>
                    <ul className="space-y-3">
                      {testimonial.results.map((result, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-accent" />
                          <span className="text-muted-foreground">{result}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Ready to Transform Your Farm?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of farmers already using AI to grow better crops
          </p>
          <Button asChild size="lg" className="text-lg px-8 py-4">
            <Link to="/onboard">
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;