-- Create table for storing soil scan results
CREATE TABLE public.soil_scans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  image_url TEXT,
  scan_type TEXT NOT NULL DEFAULT 'image', -- 'image' or 'ocr'
  
  -- Soil analysis results
  soil_type TEXT,
  ph_level DECIMAL(4,2),
  nitrogen_level TEXT,
  phosphorus_level TEXT,
  potassium_level TEXT,
  organic_matter_percentage DECIMAL(5,2),
  moisture_percentage DECIMAL(5,2),
  
  -- AI precision and confidence
  precision_level TEXT DEFAULT 'medium', -- 'low', 'medium', 'high'
  confidence_score DECIMAL(5,2),
  
  -- OCR extracted text
  extracted_text TEXT,
  
  -- Full AI response
  analysis_summary TEXT,
  recommendations TEXT[],
  raw_response JSONB,
  
  -- Session tracking (no auth required for demo)
  session_id TEXT
);

-- Enable RLS
ALTER TABLE public.soil_scans ENABLE ROW LEVEL SECURITY;

-- Allow public read/write for demo purposes (no auth required)
CREATE POLICY "Allow public access to soil scans"
ON public.soil_scans
FOR ALL
USING (true)
WITH CHECK (true);

-- Add index for session-based queries
CREATE INDEX idx_soil_scans_session ON public.soil_scans(session_id);
CREATE INDEX idx_soil_scans_created ON public.soil_scans(created_at DESC);