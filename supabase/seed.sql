-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Insert sample profiles
INSERT INTO public.profiles (id, username, email) VALUES 
(uuid_generate_v4(), 'john_doe', 'john@example.com'),
(uuid_generate_v4(), 'jane_doe', 'jane@example.com');

-- Insert subscription plans
INSERT INTO public.subscription_plans (id, name, price, description, stripe_plan_id) VALUES
(uuid_generate_v4(), 'Free Plan', 0.00, 'Basic features for individual investigators', 'free_001'),
(uuid_generate_v4(), 'Professional', 15.00, 'Advanced features for professional investigators', 'pro_001');

-- Insert sample investigations
INSERT INTO public.investigations (id, title, description, owner_id) VALUES
(uuid_generate_v4(), 'Corporate Investigation', 'Investigation into company dealings', (SELECT id FROM public.profiles WHERE username = 'john_doe')),
(uuid_generate_v4(), 'Market Research', 'Research into market trends', (SELECT id FROM public.profiles WHERE username = 'jane_doe'));

-- Insert sample reports
INSERT INTO public.reports (investigation_id, title, content) VALUES
((SELECT id FROM public.investigations WHERE title = 'Corporate Investigation'), 'Initial Findings', 'Preliminary report on corporate investigation.'),
((SELECT id FROM public.investigations WHERE title = 'Market Research'), 'Market Analysis', 'Analysis of current market trends.');

-- Insert sample nodes
INSERT INTO public.nodes (id, title, description, type, owner_id, investigation_id) VALUES
(uuid_generate_v4(), 'Company A', 'Major corporation in investigation', 'organization', 
 (SELECT id FROM public.profiles WHERE username = 'john_doe'),
 (SELECT id FROM public.investigations WHERE title = 'Corporate Investigation'));