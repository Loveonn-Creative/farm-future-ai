import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Target, TrendingUp, Database, DollarSign, Calendar, FileText } from "lucide-react";

const Vision = () => {
  const roadmap = [
    {
      year: "Year 1",
      title: "MVP in 1 Region",
      description: "Launch in Punjab with 1,000 farmers",
      goals: ["Proof of concept", "Product-market fit", "Initial revenue"],
      status: "current"
    },
    {
      year: "Year 2", 
      title: "Fintech + Input Bundling",
      description: "Add lending and input supply services",
      goals: ["Credit scoring", "Supply chain partnerships", "5,000 farmers"],
      status: "planned"
    },
    {
      year: "Year 3",
      title: "Full-Stack Agri Platform",
      description: "Complete agricultural ecosystem",
      goals: ["100,000 farmers", "Multi-crop support", "Pan-India presence"],
      status: "planned"
    }
  ];

  const monetization = [
    {
      model: "Freemium SaaS",
      description: "Basic alerts free, premium analytics paid",
      revenue: "₹50-200/farmer/month",
      icon: TrendingUp
    },
    {
      model: "B2B Data Sales",
      description: "Anonymized agricultural data to agribusiness",
      revenue: "₹10M+ annually",
      icon: Database
    },
    {
      model: "Embedded Lending",
      description: "Credit facilitation with partner banks",
      revenue: "2-3% of loan value",
      icon: DollarSign
    },
    {
      model: "Tokenized Futures",
      description: "Pre-harvest crop financing and trading",
      revenue: "1-2% transaction fee",
      icon: Target
    }
  ];

  const dataMoats = [
    "Proprietary soil health database",
    "Crop yield prediction models",
    "Regional weather patterns",
    "Farmer behavior analytics",
    "Market price correlations"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-hero text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Redesigning the Agri-Economy
              <span className="block text-secondary">from the Ground Up</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Building the data-driven future of farming with AI, IoT, and financial inclusion
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                <FileText className="mr-2 h-5 w-5" />
                View Full Deck
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                <Calendar className="mr-2 h-5 w-5" />
                Book a Call
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-16">
            Three-Year Roadmap to Agri Dominance
          </h2>
          
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {roadmap.map((phase, index) => (
                <Card key={index} className={`border-0 shadow-soft ${phase.status === 'current' ? 'ring-2 ring-primary' : ''}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant={phase.status === 'current' ? 'default' : 'secondary'}>
                        {phase.year}
                      </Badge>
                      {phase.status === 'current' && (
                        <Badge className="bg-accent text-accent-foreground">Current</Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl text-foreground">
                      {phase.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-6">
                      {phase.description}
                    </p>
                    <ul className="space-y-2">
                      {phase.goals.map((goal, goalIndex) => (
                        <li key={goalIndex} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                          <span className="text-sm text-muted-foreground">{goal}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Data Moats */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
              Our Defensible Data Moats
            </h2>
            <p className="text-xl text-muted-foreground mb-12">
              Owning critical agricultural data creates insurmountable competitive advantages
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dataMoats.map((moat, index) => (
                <Card key={index} className="border-0 shadow-soft">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-earth rounded-full flex items-center justify-center mx-auto mb-4">
                      <Database className="h-6 w-6 text-white" />
                    </div>
                    <p className="font-semibold text-foreground">{moat}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Monetization */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-16">
            Multiple Revenue Streams
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {monetization.map((model, index) => {
              const Icon = model.icon;
              return (
                <Card key={index} className="border-0 shadow-soft">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-earth rounded-full flex items-center justify-center">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-foreground">
                          {model.model}
                        </CardTitle>
                        <Badge variant="secondary" className="mt-1">
                          {model.revenue}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {model.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Market Size */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12">
              Massive Market Opportunity
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">146M</div>
                <p className="text-muted-foreground">Agricultural Holdings</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-accent mb-2">$400B</div>
                <p className="text-muted-foreground">Indian Agriculture Market</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-secondary mb-2">86%</div>
                <p className="text-muted-foreground">Small & Marginal Farmers</p>
              </div>
            </div>

            <Card className="border-0 shadow-earth">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Total Addressable Market (TAM)
                </h3>
                <div className="text-5xl font-bold text-primary mb-4">$50B+</div>
                <p className="text-muted-foreground">
                  Combining agricultural services, financial products, and data monetization 
                  in the world's largest farming economy
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Build the Future of Farming with Us
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join us in transforming agriculture for 146 million Indian farmers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-4">
              <FileText className="mr-2 h-5 w-5" />
              Download Full Pitch Deck
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4">
              <Calendar className="mr-2 h-5 w-5" />
              Schedule Investor Call
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Vision;