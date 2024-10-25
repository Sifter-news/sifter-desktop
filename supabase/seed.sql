-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Load subscription plans
INSERT INTO public.subscription_plans (id, name, price, description)
VALUES 
  (uuid_generate_v4(), 'Free', 0, 'Basic access to investigation tools'),
  (uuid_generate_v4(), 'Pro', 9.99, 'Advanced features and unlimited investigations'),
  (uuid_generate_v4(), 'Team', 29.99, 'Team collaboration and advanced analytics');

-- Insert admin user
INSERT INTO public.profiles (id, username, email, avatar_url) 
VALUES (
  uuid_generate_v4(),
  'admin',
  'admin@sifter.news',
  '/default-image.png'
);

-- Insert sample users
INSERT INTO public.profiles (id, username, email, avatar_url) 
SELECT 
  uuid_generate_v4(),
  'user_' || i,
  'user' || i || '@example.com',
  '/default-image.png'
FROM generate_series(1, 10) i;

-- Insert sample investigations
WITH user_ids AS (SELECT id FROM public.profiles)
INSERT INTO public.investigations (id, title, description, owner_id, visibility, view_type)
SELECT 
  uuid_generate_v4(),
  CASE (i % 3)
    WHEN 0 THEN 'Financial Investigation ' || i
    WHEN 1 THEN 'Criminal Case ' || i
    ELSE 'Historical Research ' || i
  END,
  'Sample investigation description ' || i,
  u.id,
  CASE (i % 3) 
    WHEN 0 THEN 'private'
    WHEN 1 THEN 'public'
    ELSE 'organization'
  END,
  CASE (i % 4)
    WHEN 0 THEN 'mind'
    WHEN 1 THEN 'timeline'
    WHEN 2 THEN 'map'
    ELSE 'text'
  END
FROM user_ids u
CROSS JOIN generate_series(1, 5) i;

-- Insert sample reports
WITH investigation_ids AS (SELECT id FROM public.investigations)
INSERT INTO public.reports (id, investigation_id, title, content)
SELECT 
  uuid_generate_v4(),
  inv.id,
  'Report ' || r,
  'Sample report content ' || r
FROM investigation_ids inv
CROSS JOIN generate_series(1, 3) r;

-- Insert sample nodes
WITH investigation_ids AS (SELECT id FROM public.investigations)
INSERT INTO public.node (id, title, description, type, owner_id, investigation_id)
SELECT 
  uuid_generate_v4(),
  'Node ' || n,
  'Sample node description ' || n,
  CASE (n % 4)
    WHEN 0 THEN 'evidence'
    WHEN 1 THEN 'witness'
    WHEN 2 THEN 'document'
    WHEN 3 THEN 'location'
  END,
  (SELECT id FROM public.profiles LIMIT 1),
  inv.id
FROM investigation_ids inv
CROSS JOIN generate_series(1, 5) n;