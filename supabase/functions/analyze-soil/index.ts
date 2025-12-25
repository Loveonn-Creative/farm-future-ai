import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64, scanType, extractedText } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    let prompt: string;
    let messages: any[];

    if (scanType === 'ocr') {
      // OCR mode: Extract and analyze text from soil report images
      prompt = `You are an expert agricultural soil scientist. Analyze this soil report image and extract all text/data using OCR, then provide a comprehensive analysis.

Extract the following information if visible:
1. Soil type classification
2. pH level (if shown)
3. Nutrient levels (N, P, K values)
4. Organic matter percentage
5. Moisture content
6. Any other soil parameters

After extraction, provide:
- Precision level assessment (low/medium/high based on image clarity)
- Confidence score (0-100%)
- Detailed recommendations for farming

Respond ONLY with valid JSON in this exact format:
{
  "extracted_text": "full OCR extracted text here",
  "soil_type": "soil classification",
  "ph_level": 6.5,
  "nitrogen_level": "low/medium/high or actual value",
  "phosphorus_level": "low/medium/high or actual value",
  "potassium_level": "low/medium/high or actual value",
  "organic_matter_percentage": 2.5,
  "moisture_percentage": 35,
  "precision_level": "low/medium/high",
  "confidence_score": 85,
  "analysis_summary": "detailed summary of soil health",
  "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"]
}`;

      messages = [
        { role: "system", content: prompt },
        { 
          role: "user", 
          content: [
            { type: "text", text: "Please analyze this soil report image, extract all visible text and data, then provide comprehensive soil analysis." },
            { type: "image_url", image_url: { url: imageBase64 } }
          ]
        }
      ];
    } else {
      // Image analysis mode: Direct soil sample analysis
      prompt = `You are an expert agricultural soil scientist with advanced computer vision capabilities. Analyze this soil image and provide a detailed real-time assessment.

Evaluate the following based on visual analysis:
1. Soil type (clay, sandy, loamy, silty, peaty, chalky, etc.)
2. Estimated pH level based on color and texture
3. Nutrient indicators (visual signs of deficiency/abundance)
4. Organic matter estimation based on color darkness
5. Moisture level estimation
6. Soil structure and health indicators

Provide precision levels for each measurement based on image quality and clarity.

Respond ONLY with valid JSON in this exact format:
{
  "soil_type": "soil classification with confidence",
  "ph_level": 6.5,
  "nitrogen_level": "estimated level with reasoning",
  "phosphorus_level": "estimated level with reasoning",
  "potassium_level": "estimated level with reasoning",
  "organic_matter_percentage": 2.5,
  "moisture_percentage": 35,
  "precision_level": "low/medium/high",
  "confidence_score": 75,
  "analysis_summary": "detailed visual analysis summary",
  "recommendations": ["actionable recommendation 1", "actionable recommendation 2", "actionable recommendation 3"]
}`;

      messages = [
        { role: "system", content: prompt },
        { 
          role: "user", 
          content: [
            { type: "text", text: "Analyze this soil sample image and provide a comprehensive real-time soil health assessment." },
            { type: "image_url", image_url: { url: imageBase64 } }
          ]
        }
      ];
    }

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
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI usage limit reached, please check your workspace credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    console.log('Raw AI response:', content);

    // Parse JSON from the response
    let analysisResult;
    try {
      // Try to extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      const jsonStr = jsonMatch ? jsonMatch[1].trim() : content.trim();
      analysisResult = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      // Return a structured error response
      analysisResult = {
        soil_type: "Unable to determine",
        analysis_summary: content,
        precision_level: "low",
        confidence_score: 0,
        recommendations: ["Please try with a clearer image", "Ensure proper lighting", "Focus on the soil sample"],
        error: "Could not parse structured analysis"
      };
    }

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-soil function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      soil_type: "Error",
      precision_level: "low",
      confidence_score: 0
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
