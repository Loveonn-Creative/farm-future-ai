-- Create subscribers table for phone + access code verification
CREATE TABLE public.subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL,
  access_code TEXT NOT NULL,
  plan_type TEXT DEFAULT 'premium',
  is_active BOOLEAN DEFAULT false,
  activated_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT unique_phone UNIQUE (phone),
  CONSTRAINT unique_access_code UNIQUE (access_code)
);

-- Enable RLS
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can verify (check phone + code match)
CREATE POLICY "Allow public verification" 
ON public.subscribers 
FOR SELECT 
USING (true);

-- Policy: Allow updates for activation
CREATE POLICY "Allow activation updates" 
ON public.subscribers 
FOR UPDATE 
USING (true)
WITH CHECK (true);