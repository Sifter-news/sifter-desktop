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

-- Insert sample nodes (using correct table name 'node' instead of 'nodes')
INSERT INTO public.node (id, title, description, type, owner_id, investigation_id) VALUES
(uuid_generate_v4(), 'Company A', 'Major corporation in investigation', 'organization', 
 (SELECT id FROM public.profiles WHERE username = 'john_doe'),
 (SELECT id FROM public.investigations WHERE title = 'Corporate Investigation'));

-- Insert sample person node
WITH new_node AS (
    INSERT INTO public.node (title, description, type)
    VALUES ('John Smith', 'Key person of interest', 'person')
    RETURNING id
)
INSERT INTO public.node_person (node_id, first_name, last_name, birth_date, nationality, occupation)
SELECT id, 'John', 'Smith', '1980-01-01', 'American', 'Business Executive'
FROM new_node;

-- Insert sample organization node
WITH new_node AS (
    INSERT INTO public.node (title, description, type)
    VALUES ('Acme Corporation', 'Major corporation', 'organization')
    RETURNING id
)
INSERT INTO public.node_organization (node_id, org_name, org_type, founding_date)
SELECT id, 'Acme Corporation', 'Corporation', '1950-01-01'
FROM new_node;

-- Insert sample relationship
INSERT INTO public.node_relationship (source_node_id, target_node_id, relationship_type, description)
SELECT 
    (SELECT id FROM public.node WHERE title = 'John Smith' LIMIT 1),
    (SELECT id FROM public.node WHERE title = 'Acme Corporation' LIMIT 1),
    'EMPLOYED_BY',
    'Executive position';