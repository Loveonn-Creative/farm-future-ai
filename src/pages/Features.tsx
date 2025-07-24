import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Satellite, Smartphone, Brain, AlertTriangle, ShoppingCart, Zap } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Zap,
      title: "IoT Soil Sensors",
      price: "₹5/farm/month",
      description: "Real-time monitoring of soil moisture, pH, nutrients, and temperature",
      benefits: [
        "Wireless, solar-powered sensors",
        "Data collected every hour",
        "Alerts for critical changes",
        "5-year battery life"
      ],
      color: "bg-primary"
    },
    {
      icon: Satellite,
      title: "Satellite Integration",
      price: "Included",
      description: "Advanced satellite imagery from Sentinel-2 and Planet Labs for crop monitoring",
      benefits: [
        "Weekly crop health analysis",
        "Growth pattern tracking",
        "Yield prediction models",
        "Pest/disease early detection"
      ],
      color: "bg-accent"
    },
    {
      icon: Brain,
      title: "AI Agronomist",
      price: "Free",
      description: "Personalized daily recommendations based on your farm's unique conditions",
      benefits: [
        "Custom fertilizer schedules",
        "Irrigation timing optimization",
        "Weather-based advice",
        "Local language support"
      ],
      color: "bg-secondary"
    },
    {
      icon: AlertTriangle,
      title: "Disease Alerts",
      price: "Premium",
      description: "AI-powered image recognition for early disease and pest detection",
      benefits: [
        "Photo-based diagnosis",
        "Treatment recommendations",
        "Severity assessment",
        "Prevention strategies"
      ],
      color: "bg-earth-clay"
    },
    {
      icon: Smartphone,
      title: "SMS/WhatsApp Interface",
      price: "Free",
      description: "Get insights without a smartphone - works via SMS and WhatsApp",
      benefits: [
        "No internet required",
        "Voice message support",
        "Multiple language options",
        "Works on any phone"
      ],
      color: "bg-earth-green"
    },
    {
      icon: ShoppingCart,
      title: "Direct Marketplace",
      price: "3% commission",
      description: "Connect directly with buyers and eliminate middleman costs",
      benefits: [
        "Verified buyer network",
        "Fair price guarantee",
        "Quality certification",
        "Logistics support"
      ],
      color: "bg-earth-brown"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Complete Farming Technology Stack
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From soil sensors to satellite data, we provide everything you need for smart farming
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-0 shadow-soft hover:shadow-earth transition-all duration-300 h-full">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 ${feature.color} rounded-full flex items-center justify-center`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <Badge variant="secondary" className="text-sm font-semibold">
                        {feature.price}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl text-foreground">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {feature.description}
                    </p>
                    <ul className="space-y-3">
                      {feature.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-accent rounded-full flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Technical Overview */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-16">
              How Our Technology Works Together
            </h2>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-6">Data Collection Layer</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center mt-1">
                      <span className="text-xs text-white font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">IoT Sensors</h4>
                      <p className="text-sm text-muted-foreground">Continuous soil and environmental monitoring</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center mt-1">
                      <span className="text-xs text-white font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Satellite Data</h4>
                      <p className="text-sm text-muted-foreground">High-resolution imagery and crop analysis</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center mt-1">
                      <span className="text-xs text-white font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Weather Integration</h4>
                      <p className="text-sm text-muted-foreground">Real-time and forecasted weather data</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-foreground mb-6">AI Processing Layer</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center mt-1">
                      <span className="text-xs text-white font-bold">4</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Machine Learning Models</h4>
                      <p className="text-sm text-muted-foreground">Crop-specific AI trained on local conditions</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center mt-1">
                      <span className="text-xs text-white font-bold">5</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Predictive Analytics</h4>
                      <p className="text-sm text-muted-foreground">Yield forecasting and risk assessment</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center mt-1">
                      <span className="text-xs text-white font-bold">6</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Personalized Recommendations</h4>
                      <p className="text-sm text-muted-foreground">Actionable insights delivered daily</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;