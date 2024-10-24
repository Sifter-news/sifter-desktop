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

-- Insert sample organization
INSERT INTO public.organization (id, name, description, created_by) VALUES
(uuid_generate_v4(), 'Sample Corp', 'A sample organization', (SELECT id FROM public.profiles WHERE username = 'john_doe'));

-- Insert sample node_person
INSERT INTO public.node_person (node_id, birth_date, gender) VALUES
((SELECT id FROM public.node LIMIT 1), '1980-01-01', 'male');

-- Insert sample node_organization
INSERT INTO public.node_organization (node_id, legal_name, business_number) VALUES
((SELECT id FROM public.node LIMIT 1), 'Sample Legal Name', 'BN123456');

-- Insert sample project access
INSERT INTO public.project_access (investigation_id, user_id, role) VALUES
((SELECT id FROM public.investigations LIMIT 1), (SELECT id FROM public.profiles LIMIT 1), 'editor');
