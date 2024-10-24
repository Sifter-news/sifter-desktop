-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Insert sample subscription plans
INSERT INTO public.subscription_plans (id, name, price, description, stripe_plan_id) VALUES
(uuid_generate_v4(), 'Free Plan', 0.00, 'Basic features for individual investigators', 'free_001'),
(uuid_generate_v4(), 'Professional', 15.00, 'Advanced features for professional investigators', 'pro_001'),
(uuid_generate_v4(), 'Enterprise', 49.00, 'Full features for organizations', 'enterprise_001');

-- Insert 10 sample profiles
INSERT INTO public.profiles (id, username, email) 
SELECT 
  uuid_generate_v4(),
  'user_' || i,
  'user' || i || '@example.com'
FROM generate_series(1, 10) i;

-- Create 6 investigations per user
WITH user_ids AS (SELECT id FROM public.profiles)
INSERT INTO public.investigations (id, title, description, owner_id, visibility, view_type)
SELECT 
  uuid_generate_v4(),
  'Investigation ' || u.id || '_' || i,
  'Description for investigation ' || i || ' by user ' || u.id,
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
CROSS JOIN generate_series(1, 6) i;

-- Create 6 reports per investigation
WITH investigation_ids AS (SELECT id FROM public.investigations)
INSERT INTO public.reports (id, investigation_id, title, content)
SELECT 
  uuid_generate_v4(),
  inv.id,
  'Report ' || r || ' for Investigation ' || inv.id,
  'Detailed content for report ' || r || ' of investigation ' || inv.id
FROM investigation_ids inv
CROSS JOIN generate_series(1, 6) r;

-- Create one of each node type per investigation
WITH investigation_ids AS (SELECT id FROM public.investigations)
INSERT INTO public.node (id, title, description, type, owner_id, investigation_id)
SELECT 
  uuid_generate_v4(),
  CASE node_type
    WHEN 'person' THEN 'Person Node for ' || inv.id
    WHEN 'organization' THEN 'Org Node for ' || inv.id
    WHEN 'object' THEN 'Object Node for ' || inv.id
    WHEN 'concept' THEN 'Concept Node for ' || inv.id
    WHEN 'event' THEN 'Event Node for ' || inv.id
  END,
  'Description for ' || node_type || ' node of investigation ' || inv.id,
  node_type,
  (SELECT id FROM public.profiles LIMIT 1),
  inv.id
FROM investigation_ids inv
CROSS JOIN (
  VALUES ('person'), ('organization'), ('object'), ('concept'), ('event')
) AS t(node_type);

-- Insert person nodes
INSERT INTO public.node_person (node_id, birth_date, death_date, gender, aliases, online_usernames)
SELECT 
  n.id,
  '1980-01-01'::date + (random() * 365 * 40)::integer,
  NULL,
  CASE (random() * 2)::integer 
    WHEN 0 THEN 'male'
    WHEN 1 THEN 'female'
    ELSE 'other'
  END,
  ARRAY['alias1', 'alias2'],
  '{"twitter": "user123", "facebook": "user456"}'::jsonb
FROM public.node n
WHERE n.type = 'person';

-- Insert organization nodes
INSERT INTO public.node_organization (node_id, legal_name, business_number)
SELECT 
  n.id,
  'Legal Name for ' || n.id,
  'BN' || floor(random() * 1000000)::text
FROM public.node n
WHERE n.type = 'organization';

-- Insert object nodes
INSERT INTO public.node_object (node_id, object_type, ownership, metadata)
SELECT 
  n.id,
  CASE (random() * 1)::integer
    WHEN 0 THEN 'physical'
    ELSE 'digital'
  END,
  '{"owner": "user123", "date_acquired": "2024-01-01"}'::jsonb,
  '{"size": "large", "condition": "new"}'::jsonb
FROM public.node n
WHERE n.type = 'object';

-- Insert concept nodes
INSERT INTO public.node_concept (node_id, definition, evolving_meanings)
SELECT 
  n.id,
  'Definition for concept ' || n.id,
  '{"historical": "old meaning", "current": "new meaning"}'::jsonb
FROM public.node n
WHERE n.type = 'concept';

-- Insert locations for events
INSERT INTO public.node_location (id, name, coordinates, description)
SELECT 
  uuid_generate_v4(),
  'Location for Event ' || n.id,
  ST_SetSRID(ST_MakePoint(
    random() * 360 - 180,  -- longitude between -180 and 180
    random() * 180 - 90    -- latitude between -90 and 90
  ), 4326),
  'Description of location for event ' || n.id
FROM public.node n
WHERE n.type = 'event';

-- Insert events
WITH locations AS (SELECT id, name FROM public.node_location)
INSERT INTO public.node_event (id, event_name, event_type, start_date, end_date, location_id, description, investigation_id)
SELECT 
  uuid_generate_v4(),
  'Event ' || n.id,
  CASE (random() * 2)::integer
    WHEN 0 THEN 'meeting'
    WHEN 1 THEN 'transaction'
    ELSE 'communication'
  END,
  NOW() - (random() * 365 || ' days')::interval,
  NOW() - (random() * 365 || ' days')::interval,
  l.id,
  'Description of event ' || n.id,
  n.investigation_id
FROM public.node n
CROSS JOIN (SELECT id FROM public.node_location LIMIT 1) l
WHERE n.type = 'event';

-- Insert sample project access records
WITH investigation_ids AS (SELECT id FROM public.investigations LIMIT 10)
INSERT INTO public.project_access (investigation_id, user_id, role)
SELECT 
  i.id,
  (SELECT id FROM public.profiles ORDER BY random() LIMIT 1),
  CASE (random() * 2)::integer
    WHEN 0 THEN 'viewer'
    WHEN 1 THEN 'editor'
    ELSE 'admin'
  END
FROM investigation_ids i;