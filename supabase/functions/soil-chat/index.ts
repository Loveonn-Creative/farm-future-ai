import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question, soilData } = await req.json();
    
    if (!question) {
      throw new Error("No question provided");
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Answering farmer question:', question.substring(0, 100));

    const systemPrompt = `आप एक अनुभवी कृषि विशेषज्ञ हैं जो किसानों की मदद करते हैं। आप हिंदी में जवाब देते हैं।
    
किसान की मिट्टी की जानकारी:
${soilData ? JSON.stringify(soilData, null, 2) : 'कोई जानकारी उपलब्ध नहीं'}

महत्वपूर्ण नियम:
1. हमेशा सरल हिंदी में जवाब दें
2. जवाब छोटा और व्यावहारिक रखें (2-3 वाक्य)
3. अगर लागत हो तो रुपये में बताएं
4. किसान को क्या करना है वो साफ बताएं
5. तकनीकी शब्द न इस्तेमाल करें`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: question }
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "बहुत ज़्यादा सवाल पूछे गए। कृपया थोड़ी देर बाद पूछें।" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error('AI error:', response.status, errorText);
      throw new Error(`AI error: ${response.status}`);
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content || "माफ करें, जवाब नहीं मिला।";
    
    console.log('AI answer:', answer.substring(0, 100));

    return new Response(JSON.stringify({ answer }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error('Chat error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
