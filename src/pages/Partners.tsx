import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Handshake, Building2, CreditCard, Truck, Users, ArrowRight, TrendingUp } from "lucide-react";

const Partners = () => {
  const partnerTypes = [
    {
      icon: Building2,
      title: "Agri-Input Brands",
      subtitle: "Fertilizers, Seeds, Pesticides",
      description: "Reach farmers with targeted product recommendations based on real soil data",
      benefits: [
        "Direct farmer access to 100,000+ users",
        "Data-driven product recommendations",
        "Increased farmer loyalty and retention",
        "Measurable ROI on marketing spend"
      ],
      ctaText: "Partner for Distribution",
      color: "bg-primary"
    },
    {
      icon: CreditCard,
      title: "Financial Institutions",
      subtitle: "Banks, NBFCs, Microfinance",
      description: "Provide credit to farmers using our yield prediction and risk assessment data",
      benefits: [
        "Reduced lending risk with AI predictions",
        "Alternative credit scoring models",
        "Automated loan processing",
        "Portfolio risk management tools"
      ],
      ctaText: "Explore Credit Solutions",
      color: "bg-accent"
    },
    {
      icon: Truck,
      title: "Exporters & B2B Buyers",
      subtitle: "Food Processing, Export Houses",
      description: "Source high-quality produce directly from our network of verified farmers",
      benefits: [
        "Quality assured produce",
        "Predictable supply planning",
        "Direct farmer relationships",
        "Traceability and certification"
      ],
      ctaText: "Source Better Produce",
      color: "bg-secondary"
    }
  ];

  const partnership_models = [
    {
      title: "Revenue Sharing",
      description: "Share revenue from farmer subscriptions and transactions",
      percentage: "20-30%"
    },
    {
      title: "White Label Solutions",
      description: "Use our platform with your branding for your farmer network",
      percentage: "Custom"
    },
    {
      title: "Data Licensing",
      description: "Access aggregated agricultural insights for market intelligence",
      percentage: "Fixed Fee"
    },
    {
      title: "Joint Ventures",
      description: "Co-develop specialized solutions for specific crops or regions",
      percentage: "Equity"
    }
  ];

  const success_metrics = [
    { metric: "1M+", label: "Farmers to reach by 2025" },
    { metric: "₹500Cr", label: "GMV potential for partners" },
    { metric: "35%", label: "Average yield improvement" },
    { metric: "92%", label: "Farmer satisfaction rate" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-hero text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Looking to reach
              <span className="block text-secondary">1M+ farmers?</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Partner with AgriAI to transform agriculture while building profitable business relationships
            </p>
            <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              <Handshake className="mr-2 h-5 w-5" />
              Explore Partnership
            </Button>
          </div>
        </div>
      </section>

      {/* Partner Types */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-16">
            Partnership Opportunities
          </h2>
          
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {partnerTypes.map((partner, index) => {
              const Icon = partner.icon;
              return (
                <Card key={index} className="border-0 shadow-soft hover:shadow-earth transition-all duration-300 h-full">
                  <CardHeader className="pb-4">
                    <div className={`w-16 h-16 ${partner.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl text-foreground text-center">
                      {partner.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground text-center">
                      {partner.subtitle}
                    </p>
                  </CardHeader>
                  <CardContent className="flex flex-col h-full">
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {partner.description}
                    </p>
                    
                    <div className="flex-grow">
                      <h4 className="font-semibold text-foreground mb-4">Partner Benefits:</h4>
                      <ul className="space-y-3 mb-6">
                        {partner.benefits.map((benefit, benefitIndex) => (
                          <li key={benefitIndex} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-accent rounded-full flex-shrink-0 mt-2" />
                            <span className="text-sm text-muted-foreground">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Button className="w-full mt-auto">
                      {partner.ctaText}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Success Metrics */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Partnership Success Metrics
            </h2>
            <p className="text-xl text-muted-foreground">
              Real numbers from our growing farmer network
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {success_metrics.map((item, index) => (
              <Card key={index} className="border-0 shadow-soft text-center">
                <CardContent className="p-8">
                  <div className="text-4xl font-bold text-primary mb-2">
                    {item.metric}
                  </div>
                  <p className="text-muted-foreground">
                    {item.label}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Models */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-16">
            Flexible Partnership Models
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {partnership_models.map((model, index) => (
              <Card key={index} className="border-0 shadow-soft">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl text-foreground">
                      {model.title}
                    </CardTitle>
                    <Badge variant="secondary">
                      {model.percentage}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {model.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Case Study */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-16">
              Partnership Success Story
            </h2>
            
            <Card className="border-0 shadow-earth">
              <CardContent className="p-8 md:p-12">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-4">
                      Punjab Agricultural Bank
                    </h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      "Partnering with AgriAI reduced our agricultural loan defaults by 40% 
                      while increasing farmer satisfaction. Their yield predictions help us 
                      make better lending decisions."
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-accent" />
                        <span className="text-sm text-muted-foreground">5,000+ farmers served</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <TrendingUp className="h-5 w-5 text-accent" />
                        <span className="text-sm text-muted-foreground">40% reduction in defaults</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5 text-accent" />
                        <span className="text-sm text-muted-foreground">₹50Cr+ loans facilitated</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-6xl font-bold text-primary mb-4">40%</div>
                    <p className="text-muted-foreground">Reduction in loan defaults</p>
                    <div className="mt-8 text-4xl font-bold text-accent mb-2">₹50Cr+</div>
                    <p className="text-muted-foreground">Total loans facilitated</p>
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
            Ready to Transform Agriculture Together?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join leading organizations already partnering with AgriAI
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-4">
              <Handshake className="mr-2 h-5 w-5" />
              Start Partnership Discussion
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4">
              Download Partnership Deck
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Partners;