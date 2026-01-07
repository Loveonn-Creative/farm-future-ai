-- Add columns for plot-based tracking and land mapping
ALTER TABLE public.soil_scans ADD COLUMN IF NOT EXISTS plot_name TEXT;
ALTER TABLE public.soil_scans ADD COLUMN IF NOT EXISTS land_category TEXT;
ALTER TABLE public.soil_scans ADD COLUMN IF NOT EXISTS area_bigha NUMERIC;
ALTER TABLE public.soil_scans ADD COLUMN IF NOT EXISTS gps_coordinates JSONB;