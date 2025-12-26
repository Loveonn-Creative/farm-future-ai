import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Varied insight templates for non-generic responses
const insightTemplates = {
  nitrogen: {
    low: [
      { text: "नाइट्रोजन कम → फसल की बढ़त धीमी हो सकती है", detail: "यूरिया डालने से सुधार होगा" },
      { text: "नत्रजन की कमी → पत्ते पीले पड़ सकते हैं", detail: "जैविक खाद का उपयोग करें" },
      { text: "N कम दिख रहा है → बढ़त रुक सकती है", detail: "15-20 दिन में खाद दें" },
    ],
    medium: [
      { text: "नाइट्रोजन ठीक → फिलहाल खाद न डालें", detail: "अगली जांच 2 हफ्ते बाद" },
      { text: "नत्रजन सही → फसल की बढ़त अच्छी रहेगी", detail: null },
    ],
    high: [
      { text: "नाइट्रोजन पर्याप्त → अतिरिक्त खाद न डालें", detail: "ज़्यादा खाद से नुकसान हो सकता है" },
      { text: "N अच्छा है → खर्च बचाएं, खाद न डालें", detail: null },
    ],
  },
  moisture: {
    low: [
      { text: "नमी कम → आज सिंचाई करें", detail: "सुबह या शाम पानी दें" },
      { text: "मिट्टी सूखी → फसल को पानी चाहिए", detail: "हल्की सिंचाई करें" },
      { text: "पानी की कमी → जल्द सिंचाई ज़रूरी", detail: null },
    ],
    medium: [
      { text: "पानी सही → आज सिंचाई की जरूरत नहीं", detail: "कल फिर जांचें" },
      { text: "नमी ठीक है → पैसे बचाएं, सिंचाई न करें", detail: null },
    ],
    high: [
      { text: "नमी ज़्यादा → 2-3 दिन पानी न दें", detail: "जड़ सड़न का खतरा" },
      { text: "मिट्टी गीली → सिंचाई बंद रखें", detail: "हवा लगने दें" },
    ],
  },
  ph: {
    acidic: [
      { text: "मिट्टी तेजाबी → चूना डालने से सुधार होगा", detail: "50kg/एकड़ चूना डालें" },
      { text: "pH कम → ज़्यादातर फसलों के लिए समस्या", detail: "चूना या राख मिलाएं" },
    ],
    neutral: [
      { text: "pH सही → ज़्यादातर फसलों के लिए उपयुक्त", detail: null },
      { text: "मिट्टी का pH अच्छा है → कोई सुधार ज़रूरी नहीं", detail: null },
    ],
    alkaline: [
      { text: "मिट्टी क्षारीय → जिप्सम से सुधार करें", detail: "धान के लिए अच्छा नहीं" },
      { text: "pH ज़्यादा → कुछ फसलें कमज़ोर होंगी", detail: "जिप्सम या सल्फर डालें" },
    ],
  },
  pest: [
    { text: "5-7 दिन में कीट का खतरा → जल्दी कार्रवाई करें", detail: "नीम का तेल छिड़कें" },
    { text: "मौसम से कीट बढ़ सकते हैं → निगरानी रखें", detail: "सुबह खेत देखें" },
    { text: "फसल पर धब्बे → जल्द इलाज करें", detail: "बोर्डो मिश्रण लगाएं" },
  ],
};

// Random pick from array
const randomPick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Generate varied insights based on analysis
const generateInsights = (analysis: any, language: string) => {
  const insights: any[] = [];
  
  // Nitrogen
  if (analysis.nitrogen_level) {
    const level = analysis.nitrogen_level.toLowerCase();
    if (level.includes("low") || level.includes("कम")) {
      const template = randomPick(insightTemplates.nitrogen.low);
      insights.push({ type: "warning", ...template });
    } else if (level.includes("high") || level.includes("अधिक")) {
      const template = randomPick(insightTemplates.nitrogen.high);
      insights.push({ type: "info", ...template });
    } else {
      const template = randomPick(insightTemplates.nitrogen.medium);
      insights.push({ type: "success", ...template });
    }
  }

  // Moisture
  if (analysis.moisture_percentage !== undefined) {
    if (analysis.moisture_percentage < 30) {
      const template = randomPick(insightTemplates.moisture.low);
      insights.push({ type: "warning", ...template });
    } else if (analysis.moisture_percentage > 70) {
      const template = randomPick(insightTemplates.moisture.high);
      insights.push({ type: "info", ...template });
    } else {
      const template = randomPick(insightTemplates.moisture.medium);
      insights.push({ type: "success", ...template });
    }
  }

  // pH
  if (analysis.ph_level !== undefined) {
    if (analysis.ph_level < 6) {
      const template = randomPick(insightTemplates.ph.acidic);
      insights.push({ type: "warning", ...template });
    } else if (analysis.ph_level > 8) {
      const template = randomPick(insightTemplates.ph.alkaline);
      insights.push({ type: "warning", ...template });
    } else {
      const template = randomPick(insightTemplates.ph.neutral);
      insights.push({ type: "success", ...template });
    }
  }

  // Random pest warning (20% chance)
  if (Math.random() < 0.2) {
    const template = randomPick(insightTemplates.pest);
    insights.push({ type: "warning", ...template });
  }

  return insights.slice(0, 4);
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64, scanType, scanCategory, language = 'hi' } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const isCrop = scanCategory === 'crop';
    const isHindi = language === 'hi' || language === 'bh';

    let prompt: string;
    let messages: any[];

    if (scanType === 'ocr') {
      prompt = `You are an expert agricultural soil scientist fluent in Hindi. Analyze this soil report image.
Extract all visible data and provide analysis in Hindi for a farmer.

Respond ONLY with valid JSON:
{
  "extracted_text": "full OCR text",
  "soil_type": "मिट्टी का प्रकार",
  "ph_level": 6.5,
  "nitrogen_level": "कम/मध्यम/अधिक",
  "phosphorus_level": "कम/मध्यम/अधिक",
  "potassium_level": "कम/मध्यम/अधिक",
  "organic_matter_percentage": 2.5,
  "moisture_percentage": 35,
  "precision_level": "low/medium/high",
  "confidence_score": 85,
  "analysis_summary": "किसान के लिए सारांश (2-3 वाक्य)",
  "recommendations": ["सलाह 1", "सलाह 2"],
  "crop_recommendations": [{"crop": "गेहूं", "reason": "इस मिट्टी के लिए सबसे अच्छा"}]
}`;
    } else if (isCrop) {
      prompt = `You are an expert crop health analyst fluent in Hindi. Analyze this crop/plant image.

Evaluate:
1. Crop type identification
2. Health status (diseases, pests, deficiencies)
3. Growth stage
4. Immediate concerns

Respond ONLY with valid JSON:
{
  "crop_type": "फसल का नाम",
  "health_status": "स्वस्थ/चिंताजनक/गंभीर",
  "growth_stage": "अंकुरण/बढ़त/फूल/फल",
  "disease_detected": null or "रोग का नाम",
  "pest_detected": null or "कीट का नाम",
  "deficiency": null or "कमी का नाम",
  "precision_level": "low/medium/high",
  "confidence_score": 80,
  "analysis_summary": "किसान के लिए सारांश (2-3 वाक्य)",
  "recommendations": ["तुरंत करें", "अगले हफ्ते करें"],
  "soil_type": null
}`;
    } else {
      prompt = `You are an expert agricultural soil scientist fluent in Hindi. Analyze this soil image.

Evaluate:
1. Soil type (clay/sandy/loamy/silty/peaty/chalky)
2. Estimated pH, nutrients (N/P/K), organic matter, moisture
3. Health indicators

Respond ONLY with valid JSON:
{
  "soil_type": "मिट्टी का प्रकार (e.g., दोमट, चिकनी, रेतीली)",
  "ph_level": 6.5,
  "nitrogen_level": "कम/मध्यम/अधिक",
  "phosphorus_level": "कम/मध्यम/अधिक",
  "potassium_level": "कम/मध्यम/अधिक",
  "organic_matter_percentage": 2.5,
  "moisture_percentage": 35,
  "precision_level": "low/medium/high",
  "confidence_score": 75,
  "analysis_summary": "किसान के लिए सारांश (2-3 वाक्य)",
  "recommendations": ["आज करें", "इस हफ्ते करें"],
  "crop_recommendations": [{"crop": "धान", "reason": "इस मिट्टी के लिए उपयुक्त"}]
}`;
    }

    messages = [
      { role: "system", content: prompt },
      { 
        role: "user", 
        content: [
          { type: "text", text: isCrop ? "Analyze this crop image." : "Analyze this soil sample." },
          { type: "image_url", image_url: { url: imageBase64 } }
        ]
      }
    ];

    console.log('Sending request to Lovable AI Gateway...');
    
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "थोड़ी देर बाद कोशिश करें" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "सेवा अभी उपलब्ध नहीं है" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    console.log('Raw AI response:', content);

    let analysisResult;
    try {
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      const jsonStr = jsonMatch ? jsonMatch[1].trim() : content.trim();
      analysisResult = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      analysisResult = {
        soil_type: "पहचान नहीं हो सकी",
        analysis_summary: "कृपया साफ़ फ़ोटो से दोबारा कोशिश करें",
        precision_level: "low",
        confidence_score: 0,
        recommendations: ["साफ़ फ़ोटो लें", "धूप में फ़ोटो लें"],
      };
    }

    // Add varied insights
    analysisResult.insights = generateInsights(analysisResult, language);

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-soil function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      soil_type: "त्रुटि",
      precision_level: "low",
      confidence_score: 0,
      recommendations: ["दोबारा कोशिश करें"],
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});