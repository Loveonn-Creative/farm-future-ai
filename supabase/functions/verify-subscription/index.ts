import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phone, accessCode, sessionId, userId } = await req.json();
    
    console.log('Verifying subscription:', { phone, accessCode: accessCode?.substring(0, 3) + '***', userId: userId ? 'present' : 'none' });

    // Validate inputs
    if (!phone || phone.length < 10) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: "गलत फ़ोन नंबर" 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!accessCode || accessCode.length !== 9) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: "गलत कोड - 9 अंक होने चाहिए" 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Clean phone number (last 10 digits)
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);

    // Check if phone + code combination exists
    const { data: subscriber, error: selectError } = await supabase
      .from('subscribers')
      .select('*')
      .eq('phone', cleanPhone)
      .eq('access_code', accessCode)
      .single();

    if (selectError || !subscriber) {
      console.log('No matching subscriber found:', selectError?.message);
      return new Response(JSON.stringify({ 
        success: false, 
        message: "फ़ोन नंबर या कोड गलत है। कृपया सही जानकारी डालें।" 
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if already activated and expired
    if (subscriber.is_active && subscriber.expires_at) {
      const expiresAt = new Date(subscriber.expires_at);
      if (expiresAt < new Date()) {
        return new Response(JSON.stringify({ 
          success: false, 
          message: "आपकी सदस्यता समाप्त हो गई है। नवीनीकरण के लिए संपर्क करें।" 
        }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Calculate expiry
    const now = new Date();
    let expiresAt = new Date();
    switch (subscriber.plan_type) {
      case 'trial':
        expiresAt.setDate(expiresAt.getDate() + 7);
        break;
      case '6month':
        expiresAt.setMonth(expiresAt.getMonth() + 6);
        break;
      case '1year':
        expiresAt.setFullYear(expiresAt.getFullYear() + 1);
        break;
      default:
        expiresAt.setMonth(expiresAt.getMonth() + 6);
    }

    // Activate the subscription if not already active
    if (!subscriber.is_active) {
      const { error: updateError } = await supabase
        .from('subscribers')
        .update({
          is_active: true,
          activated_at: now.toISOString(),
          expires_at: expiresAt.toISOString(),
          session_id: sessionId || subscriber.session_id,
        })
        .eq('id', subscriber.id);

      if (updateError) {
        console.error('Failed to activate subscription:', updateError);
        return new Response(JSON.stringify({ 
          success: false, 
          message: "सक्रियण में त्रुटि। कृपया दोबारा कोशिश करें।" 
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log('Subscription activated successfully:', subscriber.id);
    }

    // If user is authenticated, create/update user_subscriptions and assign premium role
    if (userId) {
      try {
        // Upsert user_subscription
        const { error: subError } = await supabase
          .from('user_subscriptions')
          .upsert({
            user_id: userId,
            plan_type: subscriber.plan_type || 'premium',
            access_code: accessCode,
            activated_at: now.toISOString(),
            expires_at: subscriber.expires_at || expiresAt.toISOString(),
            is_active: true,
          }, { onConflict: 'user_id' });

        if (subError) {
          console.error('Failed to create user_subscription:', subError);
        }

        // Assign premium role (ignore conflict if already exists)
        const { error: roleError } = await supabase
          .from('user_roles')
          .upsert({
            user_id: userId,
            role: 'premium',
          }, { onConflict: 'user_id,role' });

        if (roleError) {
          console.error('Failed to assign premium role:', roleError);
        }

        console.log('User subscription and role updated for:', userId);
      } catch (e) {
        console.error('Error updating user subscription:', e);
      }
    }

    return new Response(JSON.stringify({ 
      success: true,
      plan_type: subscriber.plan_type,
      expires_at: subscriber.expires_at || expiresAt.toISOString(),
      message: "सदस्यता सफल! अब आपको पूरी सुविधा मिलेगी।"
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in verify-subscription:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      message: "कुछ गड़बड़ हुई। कृपया दोबारा कोशिश करें।" 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
