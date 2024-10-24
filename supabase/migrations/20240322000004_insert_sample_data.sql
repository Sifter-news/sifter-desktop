DO $$
DECLARE
    admin_user_id UUID;
BEGIN
    -- Insert subscription plans
    IF NOT EXISTS (SELECT 1 FROM public.subscription_plan LIMIT 1) THEN
        INSERT INTO public.subscription_plan (id, name, price, description) VALUES
        ('11111111-1111-1111-1111-111111111111', 'Free', 0, 'Basic features for individual use'),
        ('22222222-2222-2222-2222-222222222222', 'Pro', 9.99, 'Advanced features for professionals'),
        ('33333333-3333-3333-3333-333333333333', 'Team', 29.99, 'Collaborative features for teams');
    END IF;

    -- Create admin user first
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@sifter.news') THEN
        INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
        VALUES 
        ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'admin@sifter.news', '$2a$10$abcdefghijklmnopqrstuvwxyz', NOW(), NOW(), NOW());
        
        admin_user_id := 'dddddddd-dddd-dddd-dddd-dddddddddddd';
        
        -- Insert admin profile
        INSERT INTO public.profiles (id, username, full_name)
        VALUES (admin_user_id, 'admin', 'Sifter Admin');
        
        -- Insert sample projects
        INSERT INTO public.project (id, title, description, owner_id, visibility) VALUES
        ('11111111-2222-3333-4444-555555555555', 'Epstein Network Investigation', 
         'Investigation into Jeffrey Epstein''s network of associates and financial dealings', 
         admin_user_id, 'private'),
        
        ('22222222-3333-4444-5555-666666666666', 'FTX Due Diligence', 
         'Comprehensive due diligence investigation into FTX collapse and Sam Bankman-Fried', 
         admin_user_id, 'private'),
        
        ('33333333-4444-5555-6666-777777777777', 'Wirecard Fraud Analysis', 
         'Investigation into the Wirecard accounting scandal and missing billions', 
         admin_user_id, 'private'),
        
        ('44444444-5555-6666-7777-888888888888', 'Theranos Due Diligence', 
         'Due diligence investigation into Theranos blood testing technology claims', 
         admin_user_id, 'private'),
        
        ('55555555-6666-7777-8888-999999999999', 'Panama Papers Network', 
         'Investigation into key figures and companies from the Panama Papers leak', 
         admin_user_id, 'private'),
        
        ('66666666-7777-8888-9999-aaaaaaaaaaaa', 'Credit Suisse Exposure', 
         'Due diligence investigation into Credit Suisse''s exposure to Archegos Capital', 
         admin_user_id, 'private');

        -- Insert nodes for each project
        INSERT INTO public.node (id, title, description, type, owner_id, project_id) VALUES
        -- Epstein Investigation nodes
        ('a1111111-1111-1111-1111-111111111111', 'Key Associates', 
         'Network map of key associates and their connections to financial transactions', 
         'person', admin_user_id, '11111111-2222-3333-4444-555555555555'),
        ('a2222222-2222-2222-2222-222222222222', 'Property Holdings', 
         'Analysis of real estate and property holdings across multiple jurisdictions', 
         'location', admin_user_id, '11111111-2222-3333-4444-555555555555'),
        
        -- FTX Due Diligence nodes
        ('b1111111-1111-1111-1111-111111111111', 'Alameda Research Connection', 
         'Investigation into relationship between FTX and Alameda Research', 
         'organization', admin_user_id, '22222222-3333-4444-5555-666666666666'),
        ('b2222222-2222-2222-2222-222222222222', 'Customer Fund Analysis', 
         'Tracking of customer fund movements and potential misuse', 
         'event', admin_user_id, '22222222-3333-4444-5555-666666666666'),
        
        -- Wirecard nodes
        ('c1111111-1111-1111-1111-111111111111', 'Missing Billions', 
         'Timeline of events leading to the discovery of missing billions', 
         'event', admin_user_id, '33333333-4444-5555-6666-777777777777'),
        ('c2222222-2222-2222-2222-222222222222', 'Third-Party Acquirers', 
         'Analysis of third-party acquiring partners and transaction authenticity', 
         'organization', admin_user_id, '33333333-4444-5555-6666-777777777777'),
        
        -- Theranos nodes
        ('d1111111-1111-1111-1111-111111111111', 'Technology Claims', 
         'Analysis of blood testing technology claims versus actual capabilities', 
         'concept', admin_user_id, '44444444-5555-6666-7777-888888888888'),
        ('d2222222-2222-2222-2222-222222222222', 'Investment Timeline', 
         'Timeline of major investments and technological claims', 
         'event', admin_user_id, '44444444-5555-6666-7777-888888888888'),
        
        -- Panama Papers nodes
        ('e1111111-1111-1111-1111-111111111111', 'Shell Companies', 
         'Network analysis of shell companies and beneficial owners', 
         'organization', admin_user_id, '55555555-6666-7777-8888-999999999999'),
        ('e2222222-2222-2222-2222-222222222222', 'Political Connections', 
         'Mapping of political figures to offshore entities', 
         'person', admin_user_id, '55555555-6666-7777-8888-999999999999'),
        
        -- Credit Suisse nodes
        ('f1111111-1111-1111-1111-111111111111', 'Risk Assessment', 
         'Analysis of risk management failures and exposure levels', 
         'concept', admin_user_id, '66666666-7777-8888-9999-aaaaaaaaaaaa'),
        ('f2222222-2222-2222-2222-222222222222', 'Trading Positions', 
         'Timeline of significant trading positions and losses', 
         'event', admin_user_id, '66666666-7777-8888-9999-aaaaaaaaaaaa');

        -- Insert location data for relevant nodes
        INSERT INTO public.node_location (node_id, coordinates, address, country_code)
        VALUES
        ('a2222222-2222-2222-2222-222222222222', 
         ST_SetSRID(ST_MakePoint(-72.1766, 18.1096), 4326),
         'Little St. James Island', 'VG');

        -- Insert event data for relevant nodes
        INSERT INTO public.node_event (node_id, start_date, end_date, event_type)
        VALUES
        ('b2222222-2222-2222-2222-222222222222', 
         '2022-11-01 00:00:00+00', '2022-11-11 00:00:00+00', 'financial'),
        ('d2222222-2222-2222-2222-222222222222',
         '2015-01-01 00:00:00+00', '2018-12-31 00:00:00+00', 'investment');
    END IF;
END $$;