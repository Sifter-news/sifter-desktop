-- Insert 10 sample profiles
INSERT INTO public.profiles (id, username, email) 
SELECT 
  uuid_generate_v4(),
  'user_' || i,
  'user' || i || '@example.com'
FROM generate_series(1, 10) i;