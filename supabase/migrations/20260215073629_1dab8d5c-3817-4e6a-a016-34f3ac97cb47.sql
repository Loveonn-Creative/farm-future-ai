
-- Tighten soil_scans INSERT: authenticated users must set their user_id, anon can insert freely
DROP POLICY IF EXISTS "Anyone can insert scans" ON public.soil_scans;

CREATE POLICY "Authenticated users insert with user_id"
  ON public.soil_scans FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Anon users can insert scans"
  ON public.soil_scans FOR INSERT
  TO anon
  WITH CHECK (true);
