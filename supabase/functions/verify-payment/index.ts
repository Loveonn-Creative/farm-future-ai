import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const EXPECTED_UPI_ID = "7260064476@pz";

const PLAN_AMOUNTS: Record<string, number> = {
  'daily': 5,
  '6month': 499,
  '1year': 1499,
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { screenshotBase64, planType, userId } = await req.json();

    if (!screenshotBase64 || !planType || !userId) {
      return new Response(JSON.stringify({ success: false, message: "Missing required fields" }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const expectedAmount = PLAN_AMOUNTS[planType];
    if (!expectedAmount) {
      return new Response(JSON.stringify({ success: false, message: "Invalid plan type" }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Use Gemini to analyze the payment screenshot
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a UPI payment verification assistant. Analyze UPI payment screenshots and extract:
1. Whether the payment was SUCCESSFUL (look for "Success", "Completed", "Paid", green checkmark, etc.)
2. The UPI ID the payment was sent TO (receiver/payee)
3. The amount paid (in INR)
4. Transaction ID/UTR number if visible

You MUST respond using the verify_payment tool.`
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analyze this UPI payment screenshot. Expected payment: ₹${expectedAmount} to UPI ID: ${EXPECTED_UPI_ID}. Extract payment status, receiver UPI ID, amount, and transaction ID.`
              },
              {
                type: "image_url",
                image_url: { url: `data:image/jpeg;base64,${screenshotBase64}` }
              }
            ]
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "verify_payment",
              description: "Verify UPI payment details from screenshot",
              parameters: {
                type: "object",
                properties: {
                  payment_successful: { type: "boolean", description: "Whether the payment shows as successful/completed" },
                  receiver_upi_id: { type: "string", description: "UPI ID of the receiver/payee shown in screenshot" },
                  amount_paid: { type: "number", description: "Amount paid in INR" },
                  transaction_id: { type: "string", description: "Transaction ID or UTR number if visible" },
                  confidence: { type: "number", description: "Confidence score 0-100 of the verification" },
                  reason: { type: "string", description: "Brief explanation of verification result" }
                },
                required: ["payment_successful", "receiver_upi_id", "amount_paid", "confidence", "reason"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "verify_payment" } },
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errText);
      
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ success: false, message: "सर्वर व्यस्त है, कृपया कुछ देर बाद कोशिश करें।" }), {
          status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      return new Response(JSON.stringify({ success: false, message: "विश्लेषण में त्रुटि हुई।" }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    
    if (!toolCall) {
      console.error("No tool call in AI response:", JSON.stringify(aiData));
      return new Response(JSON.stringify({ success: false, message: "स्क्रीनशॉट पढ़ने में त्रुटि हुई।" }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const verification = JSON.parse(toolCall.function.arguments);
    console.log("AI verification result:", verification);

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Store verification record
    await supabase.from('payment_verifications').insert({
      user_id: userId,
      screenshot_url: 'analyzed-via-base64',
      plan_type: planType,
      amount_expected: expectedAmount,
      upi_id_verified: verification.receiver_upi_id || '',
      amount_verified: verification.amount_paid || 0,
      transaction_id: verification.transaction_id || null,
      ai_confidence: verification.confidence || 0,
      verification_status: verification.payment_successful ? 'verified' : 'rejected',
      ai_response: verification,
    });

    // Check verification criteria
    const upiMatch = verification.receiver_upi_id?.toLowerCase().includes('7260064476') || 
                     verification.receiver_upi_id?.toLowerCase() === EXPECTED_UPI_ID.toLowerCase();
    const amountMatch = Math.abs((verification.amount_paid || 0) - expectedAmount) <= 1; // ₹1 tolerance
    const isSuccessful = verification.payment_successful === true;
    const highConfidence = (verification.confidence || 0) >= 60;

    const verified = isSuccessful && upiMatch && amountMatch && highConfidence;

    if (verified) {
      // Auto-activate subscription
      const now = new Date();
      let expiresAt = new Date();
      switch (planType) {
        case 'daily': expiresAt.setDate(expiresAt.getDate() + 1); break;
        case '6month': expiresAt.setMonth(expiresAt.getMonth() + 6); break;
        case '1year': expiresAt.setFullYear(expiresAt.getFullYear() + 1); break;
      }

      // Upsert user_subscription
      await supabase.from('user_subscriptions').upsert({
        user_id: userId,
        plan_type: planType,
        activated_at: now.toISOString(),
        expires_at: expiresAt.toISOString(),
        is_active: true,
      }, { onConflict: 'user_id' });

      // Assign premium role
      await supabase.from('user_roles').upsert({
        user_id: userId,
        role: 'premium',
      }, { onConflict: 'user_id,role' });

      return new Response(JSON.stringify({
        success: true,
        verified: true,
        message: "भुगतान सत्यापित! आपकी सदस्यता सक्रिय हो गई है। 🎉",
        plan_type: planType,
        expires_at: expiresAt.toISOString(),
        details: verification.reason,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Build rejection reason
    let rejectReason = "भुगतान सत्यापित नहीं हो सका। कारण: ";
    if (!isSuccessful) rejectReason += "भुगतान सफल नहीं दिख रहा। ";
    if (!upiMatch) rejectReason += `UPI ID मेल नहीं खाती (${EXPECTED_UPI_ID} होनी चाहिए)। `;
    if (!amountMatch) rejectReason += `राशि मेल नहीं खाती (₹${expectedAmount} होनी चाहिए)। `;
    if (!highConfidence) rejectReason += "स्क्रीनशॉट स्पष्ट नहीं है। ";

    return new Response(JSON.stringify({
      success: true,
      verified: false,
      message: rejectReason,
      details: verification.reason,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in verify-payment:', error);
    return new Response(JSON.stringify({ success: false, message: "कुछ गड़बड़ हुई। कृपया दोबारा कोशिश करें।" }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
