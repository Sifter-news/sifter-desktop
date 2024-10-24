-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create subscription_plan table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.subscription_plan (
    id UUID PRIMARY KEY,
    name VARCHAR(255),
    price DECIMAL(10,2),
    description TEXT,
    stripe_plan_id VARCHAR(255)
);

-- Insert sample data for subscription plans
INSERT INTO public.subscription_plan (id, name, price, description, stripe_plan_id) VALUES
(uuid_generate_v4(), 'Free Forever', 0, 'Basic free features', 'free_plan'),
(uuid_generate_v4(), 'Standard', 15.00, 'Collaborative features', 'standard_plan'),
(uuid_generate_v4(), 'Professional', 99.00, 'Premium live data features', 'professional_plan');

-- Insert sample users
INSERT INTO public.profiles (id, username, email) VALUES 
(uuid_generate_v4(), 'john_doe', 'john@example.com'),
(uuid_generate_v4(), 'jane_doe', 'jane@example.com');

-- Insert sample investigations
INSERT INTO public.investigation (id, title, description, owner_id) VALUES 
(uuid_generate_v4(), 'Investigation 1', 'This is a sample investigation for corporate deals.', (SELECT id FROM public.profiles WHERE username = 'john_doe')),
(uuid_generate_v4(), 'Investigation 2', 'Another investigation about market trends.', (SELECT id FROM public.profiles WHERE username = 'jane_doe'));

-- Insert sample nodes (generic)
INSERT INTO public.node (id, title, description, type, owner_id, investigation_id) VALUES
(uuid_generate_v4(), 'Company A', 'This is Company A.', 'organization', (SELECT id FROM public.profiles WHERE username = 'john_doe'), (SELECT id FROM public.investigation WHERE title = 'Investigation 1')),
(uuid_generate_v4(), 'Person B', 'This is Person B.', 'person', (SELECT id FROM public.profiles WHERE username = 'jane_doe'), (SELECT id FROM public.investigation WHERE title = 'Investigation 2'));

-- Insert a report linked to Investigation 1
INSERT INTO public.report (id, investigation_id, title, content) VALUES
(uuid_generate_v4(), (SELECT id FROM public.investigation WHERE title = 'Investigation 1'), 'Report on Corporate Deal', 'This is a report on the corporate deal between Company A and Company B.');