import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Varied insight templates for non-generic responses
const insightTemplates = {
  nitrogen: {
    low: [
      { text: "खाद की कमी है", action: "10kg यूरिया डालें", cost: "₹200", benefit: "₹2000 की फसल बचेगी" },
      { text: "नत्रजन कम → पत्ते पीले पड़ सकते हैं", action: "जैविक खाद या यूरिया डालें", cost: "₹150-250" },
      { text: "खाद चाहिए → बढ़त रुक सकती है", action: "15 दिन में खाद दें" },
    ],
    medium: [
      { text: "खाद सही है", action: "खाद न डालें, पैसे बचाएं" },
      { text: "नत्रजन ठीक → फसल की बढ़त अच्छी रहेगी", action: "2 हफ्ते बाद फिर जांचें" },
    ],
    high: [
      { text: "खाद पर्याप्त है", action: "खाद न डालें, नुकसान हो सकता है" },
      { text: "खाद बहुत है → पैसे बचाएं", action: "अगले महीने तक खाद न डालें" },
    ],
  },
  moisture: {
    low: [
      { text: "पानी कम है", action: "आज शाम सिंचाई करें" },
      { text: "मिट्टी सूखी → फसल को पानी चाहिए", action: "सुबह या शाम पानी दें" },
      { text: "पानी जरूरी → फसल मुरझा सकती है", action: "जल्द सिंचाई करें" },
    ],
    medium: [
      { text: "पानी सही है", action: "आज सिंचाई न करें, पैसे बचाएं" },
      { text: "नमी ठीक है → अगले 2 दिन पानी नहीं चाहिए" },
    ],
    high: [
      { text: "पानी ज़्यादा है", action: "2-3 दिन सिंचाई बंद रखें" },
      { text: "मिट्टी गीली → जड़ सड़ सकती है", action: "पानी न दें, हवा लगने दें" },
    ],
  },
  ph: {
    acidic: [
      { text: "मिट्टी तेजाबी है", action: "50kg चूना डालें", cost: "₹300" },
      { text: "pH कम → ज़्यादातर फसलों के लिए समस्या", action: "चूना या राख मिलाएं" },
    ],
    neutral: [
      { text: "मिट्टी संतुलित है", action: "कोई सुधार जरूरी नहीं" },
      { text: "pH सही → सभी फसलों के लिए उपयुक्त" },
    ],
    alkaline: [
      { text: "मिट्टी क्षारीय है", action: "जिप्सम डालें" },
      { text: "pH ज़्यादा → धान के लिए ठीक नहीं", action: "जिप्सम या सल्फर डालें" },
    ],
  },
};

// Random pick from array
const randomPick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Generate varied insights based on analysis
const generateInsights = (analysis: any) => {
  const insights: any[] = [];
  
  // Nitrogen
  if (analysis.nitrogen_level) {
    const level = analysis.nitrogen_level.toLowerCase();
    if (level.includes("low") || level.includes("कम")) {
      const template = randomPick(insightTemplates.nitrogen.low);
      insights.push({ type: "warning", ...template });
    } else if (level.includes("high") || level.includes("अधिक")) {
      const template = randomPick(insightTemplates.nitrogen.high);
      insights.push({ type: "success", ...template });
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

    // STEP 1: Validate the image first
    console.log('Step 1: Validating image type...');
    
    const validationPrompt = `You are an image validation assistant. Look at this image and determine:
1. Is this a soil sample, dirt, earth, ground, or agricultural field image? 
2. OR is this a crop, plant, leaf, vegetable, or agricultural produce image?

Answer with ONLY valid JSON:
{
  "is_valid": true/false,
  "image_type": "soil" or "crop" or "invalid",
  "reason": "brief reason in Hindi if invalid"
}

IMPORTANT: 
- Buildings, concrete, roads, people, animals, vehicles, indoor scenes = INVALID
- Must be actual soil on ground OR actual plants/crops
- Blurry or unclear images = INVALID`;

    const validationMessages = [
      { role: "system", content: validationPrompt },
      { 
        role: "user", 
        content: [
          { type: "text", text: "Check if this is a valid soil or crop image." },
          { type: "image_url", image_url: { url: imageBase64 } }
        ]
      }
    ];

    const validationResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: validationMessages,
      }),
    });

    if (!validationResponse.ok) {
      const errorText = await validationResponse.text();
      console.error("Validation error:", validationResponse.status, errorText);
      throw new Error(`Validation failed: ${validationResponse.status}`);
    }

    const validationData = await validationResponse.json();
    const validationContent = validationData.choices?.[0]?.message?.content;
    console.log('Validation response:', validationContent);

    let validationResult;
    try {
      const jsonMatch = validationContent.match(/```(?:json)?\s*([\s\S]*?)```/);
      const jsonStr = jsonMatch ? jsonMatch[1].trim() : validationContent.trim();
      validationResult = JSON.parse(jsonStr);
    } catch (e) {
      console.error('Failed to parse validation:', e);
      validationResult = { is_valid: false, reason: "तस्वीर समझ नहीं आई" };
    }

    // If invalid image, return early with clear message
    if (!validationResult.is_valid || validationResult.image_type === "invalid") {
      console.log('Invalid image detected, returning error');
      return new Response(JSON.stringify({
        is_invalid_image: true,
        soil_type: "पहचान नहीं हो सकी",
        analysis_summary: validationResult.reason || "यह मिट्टी या फसल की तस्वीर नहीं है। कृपया खेत की मिट्टी या फसल की साफ़ तस्वीर लें।",
        precision_level: "low",
        confidence_score: 0,
        recommendations: ["खेत में जाकर मिट्टी की तस्वीर लें", "फ़ोटो धूप में लें", "कैमरा मिट्टी के पास रखें"],
        insights: [{
          type: "warning",
          text: "गलत तस्वीर",
          action: "कृपया मिट्टी या फसल की सही तस्वीर लें",
        }],
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // STEP 2: Proceed with actual analysis
    console.log('Step 2: Analyzing valid image...');

    let prompt: string;

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
  "analysis_summary": "किसान के लिए 1-2 वाक्य",
  "recommendations": ["आज करें", "इस हफ्ते करें"],
  "crop_recommendations": [{"crop": "गेहूं", "reason": "इस मिट्टी के लिए सबसे अच्छा"}]
}`;
    } else if (isCrop) {
      prompt = `You are an expert crop health analyst fluent in Hindi. Analyze this crop/plant image.

Evaluate:
1. Crop type identification
2. Health status (diseases, pests, deficiencies)
3. Growth stage
4. Immediate concerns

Be SPECIFIC. If you see disease or pest damage, name it.
If plant looks healthy, say so clearly.

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
  "analysis_summary": "किसान के लिए 1-2 वाक्य - क्या करना है",
  "recommendations": ["तुरंत करें", "अगले हफ्ते करें"],
  "primary_action": {
    "text": "सबसे जरूरी काम",
    "cost": "₹XXX अगर लागू हो",
    "benefit": "क्या फायदा होगा"
  },
  "soil_type": null
}`;
    } else {
      prompt = `You are an expert agricultural soil scientist fluent in Hindi. Analyze this soil image.

Evaluate from VISUAL cues:
1. Soil type (clay/sandy/loamy based on color, texture)
2. Moisture level (dry/wet/moist based on appearance)
3. Organic matter (dark = more organic matter)
4. General health

Be HONEST about confidence. If soil looks dry, say moisture is low.
If it looks dark/rich, organic matter is good.

Respond ONLY with valid JSON:
{
  "soil_type": "मिट्टी का प्रकार (दोमट/चिकनी/रेतीली)",
  "ph_level": 6.5,
  "nitrogen_level": "कम/मध्यम/अधिक",
  "phosphorus_level": "कम/मध्यम/अधिक",
  "potassium_level": "कम/मध्यम/अधिक",
  "organic_matter_percentage": 2.5,
  "moisture_percentage": 35,
  "precision_level": "low/medium/high",
  "confidence_score": 75,
  "analysis_summary": "किसान के लिए 1-2 वाक्य - क्या करना है",
  "recommendations": ["आज करें", "इस हफ्ते करें"],
  "primary_action": {
    "text": "सबसे जरूरी काम",
    "cost": "₹XXX अगर लागू हो",
    "benefit": "क्या फायदा होगा"
  },
  "crop_recommendations": [{"crop": "धान", "reason": "इस मिट्टी के लिए उपयुक्त"}]
}`;
    }

    const messages = [
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
        confidence_score: 30,
        recommendations: ["साफ़ फ़ोटो लें", "धूप में फ़ोटो लें"],
      };
    }

    // Add varied insights
    analysisResult.insights = generateInsights(analysisResult);
    analysisResult.is_invalid_image = false;

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-soil function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      is_invalid_image: false,
      soil_type: "त्रुटि",
      precision_level: "low",
      confidence_score: 0,
      recommendations: ["दोबारा कोशिश करें"],
      insights: [{ type: "warning", text: "कुछ गड़बड़ हुई", action: "दोबारा कोशिश करें" }],
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
