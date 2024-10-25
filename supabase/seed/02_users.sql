-- Insert admin user first
INSERT INTO public.profiles (id, username, email, avatar_url) 
VALUES (
  uuid_generate_v4(),
  'admin',
  'admin@sifter.news',
  '/default-image.png'
);

-- Then insert additional sample profiles
INSERT INTO public.profiles (id, username, email, avatar_url) 
SELECT 
  uuid_generate_v4(),
  'user_' || i,
  'user' || i || '@example.com',
  '/default-image.png'
FROM generate_series(1, 10) i;