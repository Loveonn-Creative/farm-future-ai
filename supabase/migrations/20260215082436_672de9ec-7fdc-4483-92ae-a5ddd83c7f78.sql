
-- Auto-create a free subscription when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, phone, display_name, language_preference)
  VALUES (
    NEW.id,
    COALESCE(NEW.phone, NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'display_name', ''),
    'hi'
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');

  -- Auto-create freemium subscription
  INSERT INTO public.user_subscriptions (user_id, plan_type, is_active, activated_at)
  VALUES (NEW.id, 'free', true, now());

  RETURN NEW;
END;
$$;
