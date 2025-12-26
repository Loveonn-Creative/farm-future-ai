-- Add new columns for enhanced tracking
ALTER TABLE public.soil_scans ADD COLUMN IF NOT EXISTS crop_type text;
ALTER TABLE public.soil_scans ADD COLUMN IF NOT EXISTS latitude numeric;
ALTER TABLE public.soil_scans ADD COLUMN IF NOT EXISTS longitude numeric;
ALTER TABLE public.soil_scans ADD COLUMN IF NOT EXISTS language text DEFAULT 'hi';
ALTER TABLE public.soil_scans ADD COLUMN IF NOT EXISTS scan_category text DEFAULT 'soil';
ALTER TABLE public.soil_scans ADD COLUMN IF NOT EXISTS insights jsonb;
ALTER TABLE public.soil_scans ADD COLUMN IF NOT EXISTS comparison_note text;