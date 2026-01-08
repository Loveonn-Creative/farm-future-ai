import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = 'hi' | 'en' | 'bn' | 'ta' | 'te' | 'mr' | 'gu' | 'pa';

interface Translations {
  [key: string]: {
    [lang in Language]?: string;
  };
}

const translations: Translations = {
  // Navigation
  nav_home: { hi: 'होम', en: 'Home' },
  nav_scan: { hi: 'जांच', en: 'Scan' },
  nav_history: { hi: 'इतिहास', en: 'History' },
  nav_help: { hi: 'मदद', en: 'Help' },
  nav_subscribe: { hi: 'सदस्यता लें', en: 'Subscribe' },
  nav_more: { hi: 'और देखें', en: 'More' },
  
  // Secondary pages
  nav_about: { hi: 'हमारे बारे में', en: 'About Us' },
  nav_how_it_works: { hi: 'कैसे काम करता है', en: 'How It Works' },
  nav_pricing: { hi: 'मूल्य', en: 'Pricing' },
  nav_career: { hi: 'करियर', en: 'Career' },
  nav_vision: { hi: 'हमारा विज़न', en: 'Our Vision' },
  nav_partners: { hi: 'साझेदार', en: 'Partners' },
  nav_faq: { hi: 'सवाल-जवाब', en: 'FAQ' },
  nav_features: { hi: 'विशेषताएं', en: 'Features' },
  
  // Common
  back: { hi: 'वापस जाएं', en: 'Go Back' },
  learn_more: { hi: 'और जानें', en: 'Learn More' },
  start_now: { hi: 'अभी शुरू करें', en: 'Start Now' },
  contact_us: { hi: 'संपर्क करें', en: 'Contact Us' },
  
  // About Page - Enterprise Grade
  about_hero_new: { hi: 'मिट्टी की समझ से सही दाम तक।', en: 'From soil intelligence to fair prices.' },
  about_what_we_do: { hi: 'हम क्या करते हैं', en: 'What We Do' },
  about_soil_line: { hi: 'मिट्टी का विश्लेषण। सही खाद की सलाह।', en: 'Soil analysis. Right fertilizer advice.' },
  about_crop_line: { hi: 'फसल की बीमारी पहचानें। समय पर इलाज।', en: 'Identify crop disease. Treat in time.' },
  about_market_line: { hi: 'बाज़ार से जुड़ें। उचित दाम पाएं।', en: 'Connect to markets. Get fair value.' },
  about_how_title: { hi: 'कैसे काम करता है', en: 'How It Works' },
  about_how_line: { hi: 'आप स्कैन करें। हम जांचें। आप फ़ैसला लें।', en: 'You scan. We analyze. You decide.' },
  about_outcomes: { hi: 'तीन नतीजे', en: 'Three Outcomes' },
  about_outcome1_title: { hi: 'स्वस्थ मिट्टी', en: 'Healthier soil' },
  about_outcome1_desc: { hi: 'सही खाद, सही मात्रा — बर्बादी नहीं।', en: 'Right fertilizer, right amount — no waste.' },
  about_outcome2_title: { hi: 'सुरक्षित फसल', en: 'Protected crops' },
  about_outcome2_desc: { hi: 'बीमारी जल्दी पकड़ें, नुकसान रोकें।', en: 'Catch disease early, prevent loss.' },
  about_outcome3_title: { hi: 'उचित दाम', en: 'Better prices' },
  about_outcome3_desc: { hi: 'बिचौलियों के बिना बाज़ार तक पहुंच।', en: 'Market access without middlemen.' },
  about_who_we_are: { hi: 'हम कौन हैं', en: 'Who We Are' },
  about_company_line: { hi: 'भारत में बना। पंजाब, यूपी, महाराष्ट्र के किसान इस्तेमाल करते हैं।', en: 'Built in India. Used by farmers in Punjab, UP, Maharashtra.' },
  about_cta: { hi: 'पहला स्कैन करें', en: 'Start your first scan' },
  
  // Career Page - Enterprise Grade
  career_hero: { hi: 'किसान जो काम में लाएं, वो बनाओ।', en: 'Build tools farmers actually use.' },
  career_the_work: { hi: 'काम कैसा होगा', en: 'The Work' },
  career_work_line1: { hi: 'किसानों से बात करोगे।', en: "You'll talk to farmers." },
  career_work_line2: { hi: 'कोड शिप करोगे।', en: "You'll ship code." },
  career_work_line3: { hi: 'असर मापोगे।', en: "You'll measure impact." },
  career_expectations: { hi: 'हमारी अपेक्षाएं', en: 'What We Expect' },
  career_ownership: { hi: 'Ownership — काम नहीं, नतीजा तुम्हारा है।', en: 'Ownership — You own the outcome, not just the task.' },
  career_field: { hi: 'Field Accountability — काम गांव में टेस्ट होता है, बोर्डरूम में नहीं।', en: 'Field Accountability — Work is tested in villages, not boardrooms.' },
  career_execution: { hi: 'Execution — पहले शिप करो, फिर सुधारो।', en: 'Execution — Ship first, iterate after.' },
  career_roles: { hi: 'खुले पद', en: 'Open Roles' },
  career_apply: { hi: 'आवेदन करें', en: 'Apply' },
  career_no_fit: { hi: 'कोई पद नहीं मिला?', en: 'No role fits?' },
  
  // Legacy keys (kept for backward compatibility)
  about_hero_title: { hi: 'मिट्टी से बाज़ार तक', en: 'From Soil to Market' },
  about_hero_subtitle: { hi: 'Soil to Sales', en: 'Soil to Sales' },
  about_product_title: { hi: 'DataKhet क्या है?', en: 'What is DataKhet?' },
  about_product_desc: { 
    hi: 'DataKhet एक AI-संचालित प्लेटफॉर्म है जो किसानों को मिट्टी और फसल का विश्लेषण, व्यक्तिगत सलाह, और बाज़ार से सीधा जुड़ाव प्रदान करता है।', 
    en: 'DataKhet is an AI-powered platform providing farmers with soil and crop analysis, personalized recommendations, and direct market access.' 
  },
  about_mission_title: { hi: 'हमारा मिशन', en: 'Our Mission' },
  about_mission_desc: { 
    hi: 'हम किसानों को AI की ताकत देते हैं — ताकि वे अपनी मिट्टी समझें, फसल बचाएं, और सही दाम पाएं।', 
    en: 'We empower farmers with AI — so they understand their soil, protect crops, and get fair prices.' 
  },
  about_company_title: { hi: 'हमारी कंपनी', en: 'Our Company' },
  about_company_desc: { 
    hi: 'भारत में बना, किसानों के लिए बना। हम एक टीम हैं जो तकनीक और खेती के बीच की खाई पाटने के लिए समर्पित है।', 
    en: 'Made in India, made for farmers. We are a team dedicated to bridging the gap between technology and farming.' 
  },
  pillar_soil: { hi: 'मिट्टी देखभाल', en: 'Soil Care' },
  pillar_soil_desc: { hi: 'AI से मिट्टी जांचें, सही खाद डालें', en: 'Analyze soil with AI, apply the right fertilizer' },
  pillar_crop: { hi: 'फसल देखभाल', en: 'Crop Care' },
  pillar_crop_desc: { hi: 'बीमारी पहचानें, समय पर इलाज करें', en: 'Identify diseases, treat in time' },
  pillar_price: { hi: 'सही दाम', en: 'Fair Prices' },
  pillar_price_desc: { hi: 'बाज़ार से जुड़ें, उचित मूल्य पाएं', en: 'Connect to markets, get fair value' },
  career_title: { hi: 'हमारे साथ जुड़ें', en: 'Join Our Team' },
  career_subtitle: { hi: 'भारत की खेती बदलने में हमारा साथ दें', en: 'Help us transform Indian agriculture' },
  career_culture_title: { hi: 'हमारी संस्कृति', en: 'Our Culture' },
  career_culture_desc: { 
    hi: 'हम एक मिशन-ड्रिवन टीम हैं जो किसानों की समस्याओं को हल करने के लिए प्रतिबद्ध है।', 
    en: 'We are a mission-driven team committed to solving farmers\' problems.' 
  },
  career_why_join: { hi: 'क्यों जुड़ें?', en: 'Why Join Us?' },
  career_openings: { hi: 'वर्तमान पद', en: 'Current Openings' },
  career_no_openings: { 
    hi: 'अभी कोई पद खुला नहीं है, लेकिन हम हमेशा प्रतिभाशाली लोगों की तलाश में रहते हैं।', 
    en: 'No openings right now, but we\'re always looking for talented people.' 
  },
  
  // How It Works
  how_step1_title: { hi: 'डेटा इकट्ठा करें', en: 'Collect Data' },
  how_step1_desc: { hi: 'फ़ोटो लें या अपलोड करें', en: 'Take or upload a photo' },
  how_step2_title: { hi: 'AI विश्लेषण', en: 'AI Analysis' },
  how_step2_desc: { hi: 'हमारा AI तुरंत जांच करता है', en: 'Our AI analyzes instantly' },
  how_step3_title: { hi: 'सलाह पाएं', en: 'Get Advice' },
  how_step3_desc: { hi: 'व्यक्तिगत सुझाव और समाधान', en: 'Personalized suggestions and solutions' },
  
  // Stats
  stat_scans: { hi: 'जांचें हुईं', en: 'Scans Done' },
  stat_accuracy: { hi: 'सटीकता', en: 'Accuracy' },
  stat_free: { hi: 'पहली जांच', en: 'First Scan' },
  
  // Footer
  footer_about: { hi: 'हमारे बारे में', en: 'About' },
  footer_pricing: { hi: 'मूल्य', en: 'Pricing' },
  footer_career: { hi: 'करियर', en: 'Career' },
  footer_help: { hi: 'मदद', en: 'Help' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isHindi: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const detectBrowserLanguage = (): Language => {
  const saved = localStorage.getItem('datakhet_language') as Language;
  if (saved && ['hi', 'en', 'bn', 'ta', 'te', 'mr', 'gu', 'pa'].includes(saved)) {
    return saved;
  }
  
  const browserLang = navigator.language.split('-')[0];
  if (['hi', 'bn', 'ta', 'te', 'mr', 'gu', 'pa'].includes(browserLang)) {
    return browserLang as Language;
  }
  
  // Check for Indian locale
  const fullLang = navigator.language.toLowerCase();
  if (fullLang.includes('in') || fullLang.includes('india')) {
    return 'hi';
  }
  
  return 'en'; // Default to English for non-Indian browsers
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => detectBrowserLanguage());
  
  useEffect(() => {
    localStorage.setItem('datakhet_language', language);
  }, [language]);
  
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };
  
  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) return key;
    
    // Try exact language match
    if (translation[language]) return translation[language];
    
    // Fallback to Hindi for Indian languages
    if (['bn', 'ta', 'te', 'mr', 'gu', 'pa'].includes(language) && translation.hi) {
      return translation.hi;
    }
    
    // Fallback to English
    if (translation.en) return translation.en;
    
    // Fallback to Hindi
    if (translation.hi) return translation.hi;
    
    return key;
  };
  
  const isHindi = language === 'hi' || ['bn', 'ta', 'te', 'mr', 'gu', 'pa'].includes(language);
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isHindi }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
