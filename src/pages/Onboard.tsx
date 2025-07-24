import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Camera, Smartphone, MapPin } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Onboard = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    crop: "",
    farmSize: "",
    region: "",
    language: "",
    whatsappTips: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Welcome to DataKhet! 🌱",
      description: "We'll contact you within 24 hours to get you started.",
    });
  };

  const crops = [
    "Rice", "Wheat", "Corn", "Tomatoes", "Potatoes", "Onions", 
    "Cotton", "Sugarcane", "Soybeans", "Coffee", "Tea", "Other"
  ];

  const languages = [
    "English", "Hindi", "Tamil", "Telugu", "Bengali", "Marathi", 
    "Gujarati", "Kannada", "Malayalam", "Punjabi", "Urdu", "Other"
  ];

  const regions = [
    "Punjab", "Haryana", "Uttar Pradesh", "Madhya Pradesh", "Maharashtra", 
    "Karnataka", "Tamil Nadu", "Andhra Pradesh", "West Bengal", "Bihar", "Other"
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Join the Farming Revolution
            </h1>
            <p className="text-xl text-muted-foreground">
              Get started with AI-powered farming in just 2 minutes
            </p>
          </div>

          <Card className="border-0 shadow-earth">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl text-foreground">Farmer Registration</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="text-foreground font-semibold">
                      Full Name *
                    </Label>
                    <Input 
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="mobile" className="text-foreground font-semibold">
                      Mobile Number *
                    </Label>
                    <Input 
                      id="mobile"
                      type="tel"
                      placeholder="+91 9876543210"
                      value={formData.mobile}
                      onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                      required
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="crop" className="text-foreground font-semibold">
                      Primary Crop *
                    </Label>
                    <Select onValueChange={(value) => setFormData({...formData, crop: value})}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select your main crop" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        {crops.map((crop) => (
                          <SelectItem key={crop} value={crop}>{crop}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="farmSize" className="text-foreground font-semibold">
                      Farm Size (Acres) *
                    </Label>
                    <Input 
                      id="farmSize"
                      type="number"
                      placeholder="e.g. 5"
                      value={formData.farmSize}
                      onChange={(e) => setFormData({...formData, farmSize: e.target.value})}
                      required
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="region" className="text-foreground font-semibold">
                      Region/State *
                    </Label>
                    <Select onValueChange={(value) => setFormData({...formData, region: value})}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select your state" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        {regions.map((region) => (
                          <SelectItem key={region} value={region}>{region}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="language" className="text-foreground font-semibold">
                      Preferred Language *
                    </Label>
                    <Select onValueChange={(value) => setFormData({...formData, language: value})}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Choose language" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        {languages.map((language) => (
                          <SelectItem key={language} value={language}>{language}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="whatsapp"
                    checked={formData.whatsappTips}
                    onCheckedChange={(checked) => setFormData({...formData, whatsappTips: checked as boolean})}
                  />
                  <Label htmlFor="whatsapp" className="text-sm text-foreground flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    Send daily farming tips on WhatsApp
                  </Label>
                </div>

                <div className="border-t border-border pt-6">
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <Camera className="h-6 w-6 text-accent" />
                      <div>
                        <p className="font-semibold text-foreground">Optional: Soil Analysis</p>
                        <p className="text-sm text-muted-foreground">Scan your soil with mobile camera</p>
                      </div>
                    </div>
                    <Button variant="outline" type="button">
                      Scan Soil
                    </Button>
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full text-lg py-6">
                  <MapPin className="mr-2 h-5 w-5" />
                  Start My Farming Journey
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  By registering, you agree to receive farming tips and updates. 
                  We respect your privacy and never share your data.
                </p>
              </form>
            </CardContent>
          </Card>

          <div className="mt-12 text-center">
            <h3 className="text-xl font-semibold text-foreground mb-4">What happens next?</h3>
            <div className="grid md:grid-cols-3 gap-6 text-sm text-muted-foreground">
              <div>
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">1</div>
                We'll call you within 24 hours
              </div>
              <div>
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">2</div>
                Schedule sensor installation
              </div>
              <div>
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">3</div>
                Start receiving AI recommendations
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboard;