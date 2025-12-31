import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Crop growth stages in Hindi
const growthStages = {
  wheat: ["अंकुरण", "कल्ले निकलना", "तना बढ़ना", "बालियां आना", "फूल आना", "दाना भरना", "पकाव"],
  rice: ["अंकुरण", "रोपाई", "कल्ले निकलना", "बालियां आना", "फूल आना", "दाना भरना", "पकाव"],
  vegetable: ["बीज बोना", "अंकुरण", "पौधा बढ़ना", "फूल आना", "फल आना", "पकाव"],
  general: ["अंकुरण", "बढ़त", "फूल आना", "फल/दाना", "पकाव"]
};

// Stage-appropriate recommendations
const stageRestrictions: Record<string, string[]> = {
  "फूल आना": ["खाद न डालें, फूल झड़ सकते हैं", "सिर्फ पानी दें"],
  "दाना भरना": ["खाद न डालें", "नमी बनाए रखें"],
  "पकाव": ["खाद न डालें", "पानी कम करें", "कटाई की तैयारी करें"],
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64, scanType, scanCategory, language = 'hi', sessionId } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Fetch previous scans for context
    let previousInputsContext = "";
    if (sessionId && SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
        const { data: previousScans } = await supabase
          .from("soil_scans")
          .select("created_at, nitrogen_level, phosphorus_level, potassium_level, moisture_percentage, ph_level, recommendations, analysis_summary")
          .eq("session_id", sessionId)
          .order("created_at", { ascending: false })
          .limit(3);
        
        if (previousScans && previousScans.length > 0) {
          previousInputsContext = `
PREVIOUS SCAN HISTORY (use this to avoid repeating ineffective recommendations):
${previousScans.map((scan, i) => `
Scan ${i + 1} (${new Date(scan.created_at).toLocaleDateString('hi-IN')}):
- Nitrogen: ${scan.nitrogen_level || 'N/A'}
- Phosphorus: ${scan.phosphorus_level || 'N/A'} 
- Potassium: ${scan.potassium_level || 'N/A'}
- Moisture: ${scan.moisture_percentage || 'N/A'}%
- pH: ${scan.ph_level || 'N/A'}
- Previous advice: ${scan.recommendations?.slice(0, 2).join(', ') || 'None'}
`).join('')}

IMPORTANT: Based on this history, if previous recommendations didn't help, suggest different solutions.
`;
        }
      } catch (e) {
        console.log('Could not fetch previous scans:', e);
      }
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

${previousInputsContext}

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
  "precision_level": "high",
  "confidence_score": 90,
  "analysis_summary": "किसान के लिए 1-2 वाक्य",
  "recommendations": ["आज करें", "इस हफ्ते करें"],
  "crop_recommendations": [{"crop": "गेहूं", "reason": "इस मिट्टी के लिए सबसे अच्छा"}],
  "insights": [
    {
      "type": "warning/success/info",
      "text": "मुख्य बात",
      "action": "क्या करें",
      "cost": "₹XXX",
      "benefit": "क्या फायदा"
    }
  ]
}`;
    } else if (isCrop) {
      prompt = `You are an expert crop health analyst and agricultural scientist fluent in Hindi. Analyze this crop/plant image with PRECISION.

${previousInputsContext}

CRITICAL ANALYSIS REQUIREMENTS:
1. CROP TYPE: Identify exact crop (गेहूं, धान, टमाटर, आलू, etc.)
2. GROWTH STAGE: Identify exact stage from this list:
   - अंकुरण (germination/seedling)
   - कल्ले निकलना (tillering) 
   - तना बढ़ना (stem elongation)
   - बालियां आना (heading/booting)
   - फूल आना (flowering)
   - दाना भरना (grain filling)
   - पकाव (maturity/ripening)

3. DISEASE DETECTION (if any):
   - EXACT disease name in Hindi
   - Severity: हल्का (mild) / मध्यम (moderate) / गंभीर (severe)
   - Affected area percentage

4. CONTROL STEPS - IN THIS ORDER:
   a) FREE/NATURAL remedies FIRST:
      - नीम का काढ़ा (100g नीम पत्ती को 5L पानी में उबालें)
      - गोमूत्र (1:10 पानी में मिलाकर)
      - राख छिड़काव
      - हल्दी + चूना पेस्ट
   b) PAID solutions ONLY if natural won't work:
      - Exact medicine name
      - Exact dosage (ml/gram per liter)
      - Exact timing (सुबह 7 बजे से पहले या शाम 5 बजे के बाद)
      - Cost estimate

5. STAGE-SPECIFIC WARNINGS:
   - If flowering: "फूल आ रहे हैं - खाद न डालें"
   - If grain filling: "दाना भर रहा है - सिर्फ नमी रखें"
   - If maturity: "पकाव शुरू है - पानी कम करें"

Respond ONLY with valid JSON:
{
  "crop_type": "फसल का नाम (गेहूं/धान/टमाटर/etc.)",
  "growth_stage": "exact stage from list above",
  "growth_stage_detail": "इस अवस्था में पौधे को क्या चाहिए",
  "health_status": "स्वस्थ/चिंताजनक/गंभीर",
  "disease_detected": {
    "name": "रोग का नाम or null",
    "severity": "हल्का/मध्यम/गंभीर",
    "affected_area": "10-20%"
  },
  "pest_detected": {
    "name": "कीट का नाम or null",
    "severity": "हल्का/मध्यम/गंभीर"
  },
  "deficiency": "पोषक तत्व की कमी or null",
  "precision_level": "low/medium/high",
  "confidence_score": 80,
  "analysis_summary": "किसान के लिए सीधी बात - क्या समस्या है और क्या करना है",
  "control_steps": {
    "free_remedies": [
      {
        "remedy": "नीम का काढ़ा",
        "how_to_make": "100g नीम पत्ती को 5L पानी में 20 मिनट उबालें, ठंडा करें, छान लें",
        "how_to_apply": "सुबह 7 बजे से पहले पत्तियों पर छिड़काव करें",
        "frequency": "हर 5 दिन में, 3 बार"
      }
    ],
    "paid_remedies": [
      {
        "medicine": "दवाई का नाम",
        "dosage": "2ml प्रति लीटर पानी",
        "timing": "शाम 5 बजे के बाद",
        "cost": "₹180/100ml",
        "when_needed": "अगर 7 दिन में सुधार न हो"
      }
    ]
  },
  "stage_warning": "इस अवस्था में क्या न करें",
  "recommendations": ["तुरंत करें", "अगले हफ्ते करें"],
  "primary_action": {
    "text": "सबसे जरूरी काम - बहुत स्पष्ट",
    "cost": "₹0 or ₹XXX",
    "benefit": "क्या फायदा होगा"
  },
  "insights": [
    {
      "type": "warning",
      "text": "मुख्य चेतावनी",
      "action": "क्या करें",
      "details": "विस्तृत जानकारी"
    }
  ],
  "soil_type": null
}`;
    } else {
      prompt = `You are an expert agricultural soil scientist fluent in Hindi. Analyze this soil image with PRECISION.

${previousInputsContext}

Evaluate from VISUAL cues:
1. Soil type (clay/sandy/loamy based on color, texture)
2. Moisture level (dry/wet/moist based on appearance)
3. Organic matter (dark = more organic matter)
4. General health

Be HONEST about confidence. If soil looks dry, say moisture is low.
If it looks dark/rich, organic matter is good.

IMPORTANT: Give STAGE-APPROPRIATE advice. Don't suggest compost if it's not the right time.

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
  "insights": [
    {
      "type": "warning/success/info",
      "text": "मुख्य बात",
      "action": "क्या करें",
      "cost": "₹XXX",
      "benefit": "क्या फायदा"
    }
  ],
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
