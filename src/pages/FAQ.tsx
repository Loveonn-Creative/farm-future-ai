import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Phone, Mail, MessageCircle, Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const FAQ = () => {
  const { toast } = useToast();
  const [contactForm, setContactForm] = useState({
    name: "",
    phone: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent! 📱",
      description: "We'll contact you within 24 hours. Thank you for your interest!",
    });
    setContactForm({ name: "", phone: "", message: "" });
  };

  const faqs = [
    {
      question: "Do I need a smartphone to use DataKhet?",
      answer: "No! DataKhet works through simple SMS and WhatsApp messages. You can receive all recommendations, alerts, and tips on any basic mobile phone. We also support voice messages in local languages."
    },
    {
      question: "How do I install the soil sensors?",
      answer: "We handle the complete installation with our local partners. Our technical team will visit your farm, install the solar-powered sensors, and train you on how to read the data. Installation takes about 2 hours and includes a 2-year warranty."
    },
    {
      question: "What crops are currently supported?",
      answer: "We currently support rice, wheat, tomatoes, onions, potatoes, and cotton. We're actively adding support for sugarcane, coffee, and pulses. Our AI models are trained specifically for Indian growing conditions and local varieties."
    },
    {
      question: "How much does it cost?",
      answer: "Basic farming tips and weather alerts are FREE. Soil sensors cost ₹5 per day (₹150/month). Premium features like disease detection and market connections are ₹10 per day. No hidden fees or long-term contracts."
    },
    {
      question: "What if I don't speak English?",
      answer: "DataKhet supports 12 local languages including Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada, Malayalam, Punjabi, and Urdu. All recommendations come in your preferred language via SMS or WhatsApp."
    },
    {
      question: "How accurate are the recommendations?",
      answer: "Our AI recommendations have shown 35% average yield improvements across 5,000+ farmers. We combine satellite data, local weather, soil sensors, and crop science to provide highly accurate, personalized advice."
    },
    {
      question: "Can I sell my crops through DataKhet?",
      answer: "Yes! Our marketplace connects you directly with verified buyers, exporters, and food processors. We help you get fair prices and handle quality certification. Our farmers typically get 15-20% better prices than local markets."
    },
    {
      question: "What if I have technical problems?",
      answer: "We provide 24/7 support through WhatsApp and phone calls. Our local field agents can visit your farm if needed. Most issues are resolved within 2 hours through remote support."
    },
    {
      question: "Is my farm data safe and private?",
      answer: "Absolutely. Your individual farm data is never shared without permission. We only use anonymized, aggregated data for research and development. You own your data and can delete it anytime."
    },
    {
      question: "How do I get started?",
      answer: "Simply fill out our registration form or call us. We'll schedule a visit to your farm within 48 hours, install sensors if needed, and start sending you personalized recommendations immediately."
    }
  ];

  const contactInfo = [
    {
      icon: Phone,
      title: "Call Us",
      detail: "+91 72600 64476",
      description: "Available 24/7 for farmers"
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      detail: "+91 72600 64476", 
      description: "Quick support and queries"
    },
    {
      icon: Mail,
      title: "Email",
      detail: "farmers@datakhet.com",
      description: "Detailed inquiries and partnerships"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Get answers to common questions about DataKhet and how we help farmers grow better crops
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border border-border rounded-lg">
                  <AccordionTrigger className="px-6 py-4 text-left hover:no-underline">
                    <span className="font-semibold text-foreground">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-16">
              Still have questions? Contact us!
            </h2>
            
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Info */}
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-8">
                  Get in Touch
                </h3>
                
                <div className="space-y-6">
                  {contactInfo.map((contact, index) => {
                    const Icon = contact.icon;
                    return (
                      <Card key={index} className="border-0 shadow-soft">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-earth rounded-full flex items-center justify-center">
                              <Icon className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-foreground">{contact.title}</h4>
                              <p className="text-lg text-primary font-semibold">{contact.detail}</p>
                              <p className="text-sm text-muted-foreground">{contact.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                <Card className="border-0 shadow-soft mt-8">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-foreground mb-4">Office Hours</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>Monday - Saturday: 8:00 AM - 8:00 PM</p>
                      <p>Sunday: 10:00 AM - 6:00 PM</p>
                      <p className="text-accent font-semibold">Emergency support: 24/7</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Form */}
              <div>
                <Card className="border-0 shadow-earth">
                  <CardHeader>
                    <CardTitle className="text-2xl text-foreground">
                      Send us a Message
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <Label htmlFor="contact-name" className="text-foreground font-semibold">
                          Your Name *
                        </Label>
                        <Input 
                          id="contact-name"
                          type="text"
                          placeholder="Enter your full name"
                          value={contactForm.name}
                          onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                          required
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="contact-phone" className="text-foreground font-semibold">
                          Mobile Number *
                        </Label>
                        <Input 
                          id="contact-phone"
                          type="tel"
                          placeholder="+91 9876543210"
                          value={contactForm.phone}
                          onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                          required
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="contact-message" className="text-foreground font-semibold">
                          Message *
                        </Label>
                        <Textarea 
                          id="contact-message"
                          placeholder="Tell us about your farm, crops, or any questions you have..."
                          value={contactForm.message}
                          onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                          required
                          className="mt-2 min-h-[120px]"
                        />
                      </div>

                      <Button type="submit" size="lg" className="w-full">
                        <Send className="mr-2 h-5 w-5" />
                        Send Message
                      </Button>

                      <p className="text-xs text-muted-foreground text-center">
                        We'll respond within 24 hours. For urgent farming issues, 
                        please call our 24/7 helpline.
                      </p>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;