-- Seed data for subscription plans
INSERT INTO public.subscription_plan (id, name, price, description)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'Free', 0, 'Basic features for individual use'),
    ('22222222-2222-2222-2222-222222222222', 'Pro', 9.99, 'Advanced features for professionals'),
    ('33333333-3333-3333-3333-333333333333', 'Team', 29.99, 'Collaborative features for teams')
ON CONFLICT (id) DO NOTHING;

-- Create admin user
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES 
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'admin@sifter.news', '$2a$10$abcdefghijklmnopqrstuvwxyz', NOW(), NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Create admin profile
INSERT INTO public.profiles (id, username, full_name)
VALUES 
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'admin', 'Sifter Admin')
ON CONFLICT (id) DO NOTHING;

-- Create sample investigations
INSERT INTO public.investigation (id, title, description, owner_id, visibility)
VALUES
    ('11111111-2222-3333-4444-555555555555', 'Sample Investigation', 
     'This is a sample investigation for testing purposes', 
     'dddddddd-dddd-dddd-dddd-dddddddddddd', 'private')
ON CONFLICT (id) DO NOTHING;

-- Create sample nodes
INSERT INTO public.node (id, title, description, type, owner_id, investigation_id)
VALUES
    ('a1111111-1111-1111-1111-111111111111', 'Sample Node', 
     'This is a sample node for testing purposes', 
     'document', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 
     '11111111-2222-3333-4444-555555555555')
ON CONFLICT (id) DO NOTHING;