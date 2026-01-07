import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Smartphone, ChevronLeft, ArrowRight } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const Onboard = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    mobile: "",
    region: "",
    whatsappTips: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save to localStorage
    localStorage.setItem("datakhet_user", JSON.stringify(formData));
    
    toast.success("स्वागत है! 🌱");
    navigate("/");
  };

  const regions = [
    { value: "up", label: "उत्तर प्रदेश" },
    { value: "punjab", label: "पंजाब" },
    { value: "haryana", label: "हरियाणा" },
    { value: "mp", label: "मध्य प्रदेश" },
    { value: "maharashtra", label: "महाराष्ट्र" },
    { value: "rajasthan", label: "राजस्थान" },
    { value: "bihar", label: "बिहार" },
    { value: "gujarat", label: "गुजरात" },
    { value: "other", label: "अन्य" },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-gradient-earth text-primary-foreground p-6 text-center">
        <h1 className="text-2xl font-bold font-hindi animate-sunrise">
          DataKhet में आपका स्वागत है
        </h1>
        <p className="text-primary-foreground/80 mt-1 text-sm font-hindi">
          बस 30 सेकंड में शुरू करें
        </p>
      </header>

      <main className="p-4 max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Mobile */}
          <div>
            <label className="text-sm font-hindi text-foreground font-medium">
              मोबाइल नंबर *
            </label>
            <Input
              type="tel"
              placeholder="9876543210"
              value={formData.mobile}
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              required
              className="mt-1 font-hindi text-lg"
            />
          </div>

          {/* Region */}
          <div>
            <label className="text-sm font-hindi text-foreground font-medium">
              राज्य *
            </label>
            <Select onValueChange={(value) => setFormData({ ...formData, region: value })}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="अपना राज्य चुनें" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                {regions.map((region) => (
                  <SelectItem key={region.value} value={region.value} className="font-hindi">
                    {region.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* WhatsApp opt-in */}
          <div className="flex items-center space-x-3 bg-muted/50 rounded-lg p-4">
            <Checkbox
              id="whatsapp"
              checked={formData.whatsappTips}
              onCheckedChange={(checked) => setFormData({ ...formData, whatsappTips: checked as boolean })}
            />
            <label htmlFor="whatsapp" className="text-sm font-hindi flex items-center gap-2 cursor-pointer">
              <Smartphone className="h-4 w-4 text-success" />
              WhatsApp पर रोज़ खेती की टिप्स भेजें
            </label>
          </div>

          <Button type="submit" size="lg" className="w-full font-hindi text-lg">
            शुरू करें
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </form>

        {/* Skip option */}
        <div className="text-center mt-6">
          <Link to="/" className="text-muted-foreground font-hindi text-sm hover:text-primary">
            बाद में करें, पहले जांच करें →
          </Link>
        </div>

        {/* What happens next */}
        <div className="mt-10 bg-muted/30 rounded-xl p-4">
          <h3 className="font-semibold font-hindi text-center mb-4">आगे क्या होगा?</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">1</div>
              <p className="text-sm font-hindi">मिट्टी/फसल की फ़ोटो लें</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">2</div>
              <p className="text-sm font-hindi">AI तुरंत जांच करेगा</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">3</div>
              <p className="text-sm font-hindi">सलाह आवाज़ में सुनें</p>
            </div>
          </div>
        </div>

        {/* Back link */}
        <div className="text-center mt-6">
          <Link to="/" className="text-muted-foreground font-hindi text-sm hover:text-primary flex items-center justify-center gap-1">
            <ChevronLeft className="w-4 h-4" />
            वापस जाएं
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Onboard;