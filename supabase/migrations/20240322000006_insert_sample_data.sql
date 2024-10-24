-- Insert subscription plans
INSERT INTO public.subscription_plan (id, name, price, description) VALUES
    ('11111111-1111-1111-1111-111111111111', 'Free', 0, 'Basic features for individual use'),
    ('22222222-2222-2222-2222-222222222222', 'Pro', 9.99, 'Advanced features for professionals'),
    ('33333333-3333-3333-3333-333333333333', 'Team', 29.99, 'Collaborative features for teams');

-- Insert 5 different types of investigators
INSERT INTO public.profiles (id, username, email, subscription_plan_id) VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'financial_investigator', 'financial@example.com', '22222222-2222-2222-2222-222222222222'),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'criminal_investigator', 'criminal@example.com', '22222222-2222-2222-2222-222222222222'),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'private_investigator', 'private@example.com', '33333333-3333-3333-3333-333333333333'),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'forensic_investigator', 'forensic@example.com', '33333333-3333-3333-3333-333333333333'),
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'corporate_investigator', 'corporate@example.com', '22222222-2222-2222-2222-222222222222');

-- Insert 6 projects for each investigator (30 total)
WITH investigator_projects AS (
    SELECT id as investigator_id, 
           generate_series(1, 6) as project_num
    FROM public.profiles
)
INSERT INTO public.project (title, description, owner_id, visibility)
SELECT 
    CASE 
        WHEN p.username = 'financial_investigator' THEN 'Financial Case ' || ip.project_num
        WHEN p.username = 'criminal_investigator' THEN 'Criminal Investigation ' || ip.project_num
        WHEN p.username = 'private_investigator' THEN 'Private Case ' || ip.project_num
        WHEN p.username = 'forensic_investigator' THEN 'Forensic Analysis ' || ip.project_num
        ELSE 'Corporate Investigation ' || ip.project_num
    END as title,
    CASE 
        WHEN p.username = 'financial_investigator' THEN 'Investigation into financial irregularities'
        WHEN p.username = 'criminal_investigator' THEN 'Criminal case investigation details'
        WHEN p.username = 'private_investigator' THEN 'Private investigation case details'
        WHEN p.username = 'forensic_investigator' THEN 'Forensic analysis case details'
        ELSE 'Corporate investigation details'
    END as description,
    ip.investigator_id,
    'private'
FROM investigator_projects ip
JOIN public.profiles p ON p.id = ip.investigator_id;

-- Insert 6 nodes (reports) for each project
WITH project_reports AS (
    SELECT id as project_id,
           generate_series(1, 6) as report_num
    FROM public.project
)
INSERT INTO public.node (title, description, type, owner_id, project_id)
SELECT 
    'Report ' || pr.report_num || ' - ' || p.title as title,
    'Detailed findings for report ' || pr.report_num || ' of project ' || p.title as description,
    'report' as type,
    p.owner_id,
    pr.project_id
FROM project_reports pr
JOIN public.project p ON p.id = pr.project_id;

-- Insert some sample locations
INSERT INTO public.node_location (name, coordinates, description) VALUES
    ('New York Office', ST_SetSRID(ST_MakePoint(-74.006, 40.7128), 4326), 'Main investigation office in NYC'),
    ('London Branch', ST_SetSRID(ST_MakePoint(-0.1276, 51.5074), 4326), 'London investigation branch'),
    ('Tokyo Division', ST_SetSRID(ST_MakePoint(139.6503, 35.6762), 4326), 'Tokyo investigation division');

-- Insert some sample events
INSERT INTO public.node_event (event_name, event_type, start_date, end_date, location_id, description)
SELECT 
    'Investigation Meeting ' || generate_series,
    'meeting',
    NOW() - (generate_series || ' days')::interval,
    NOW() - (generate_series - 1 || ' days')::interval,
    id,
    'Regular investigation status meeting'
FROM public.node_location
CROSS JOIN generate_series(1, 3);

-- Add some project access permissions
INSERT INTO public.project_access (project_id, user_id, role)
SELECT 
    p.id as project_id,
    pr.id as user_id,
    'viewer' as role
FROM public.project p
CROSS JOIN public.profiles pr
WHERE pr.id != p.owner_id
LIMIT 10;