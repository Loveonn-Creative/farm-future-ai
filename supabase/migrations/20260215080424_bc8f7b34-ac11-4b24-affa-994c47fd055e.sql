-- Create storage bucket for payment screenshots
INSERT INTO storage.buckets (id, name, public) VALUES ('payment-screenshots', 'payment-screenshots', false);

-- Allow authenticated users to upload payment screenshots
CREATE POLICY "Users can upload payment screenshots"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'payment-screenshots' AND auth.uid() IS NOT NULL);

-- Allow authenticated users to read their own screenshots
CREATE POLICY "Users can read own payment screenshots"
ON storage.objects FOR SELECT
USING (bucket_id = 'payment-screenshots' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create payment_verifications table to track verification attempts
CREATE TABLE public.payment_verifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  screenshot_url TEXT NOT NULL,
  plan_type TEXT NOT NULL DEFAULT 'premium',
  amount_expected NUMERIC,
  upi_id_verified TEXT,
  amount_verified NUMERIC,
  transaction_id TEXT,
  ai_confidence NUMERIC,
  verification_status TEXT NOT NULL DEFAULT 'pending',
  ai_response JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.payment_verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own verifications"
ON public.payment_verifications FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can insert verifications"
ON public.payment_verifications FOR INSERT
WITH CHECK (user_id = auth.uid());