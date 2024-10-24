DO $$
DECLARE
    admin_user_id UUID;
    sarah_user_id UUID;
    michael_user_id UUID;
BEGIN
    -- Insert subscription plans
    IF NOT EXISTS (SELECT 1 FROM public.subscription_plan LIMIT 1) THEN
        INSERT INTO public.subscription_plan (id, name, price, description) VALUES
        ('11111111-1111-1111-1111-111111111111', 'Free', 0, 'Basic features for individual use'),
        ('22222222-2222-2222-2222-222222222222', 'Pro', 9.99, 'Advanced features for professionals'),
        ('33333333-3333-3333-3333-333333333333', 'Team', 29.99, 'Collaborative features for teams');
    END IF;

    -- Create users
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
    VALUES 
        ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'admin@sifter.news', '$2a$10$abcdefghijklmnopqrstuvwxyz', NOW(), NOW(), NOW()),
        ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'sarah.chen@example.com', '$2a$10$abcdefghijklmnopqrstuvwxyz', NOW(), NOW(), NOW()),
        ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'michael.rodriguez@example.com', '$2a$10$abcdefghijklmnopqrstuvwxyz', NOW(), NOW(), NOW())
    ON CONFLICT (id) DO NOTHING;
        
    admin_user_id := 'dddddddd-dddd-dddd-dddd-dddddddddddd';
    sarah_user_id := 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee';
    michael_user_id := 'ffffffff-ffff-ffff-ffff-ffffffffffff';
    
    -- Insert profiles
    INSERT INTO public.profiles (id, username, full_name)
    VALUES 
        (admin_user_id, 'admin', 'Sifter Admin'),
        (sarah_user_id, 'sarah.chen', 'Sarah Chen'),
        (michael_user_id, 'mrodriguez', 'Michael Rodriguez')
    ON CONFLICT (id) DO NOTHING;
    
    -- Insert investigations with realistic cases
    INSERT INTO public.investigation (id, title, description, owner_id, visibility) VALUES
    -- Sarah's Investigations
    ('11111111-2222-3333-4444-555555555555', 'Silicon Valley Bank Collapse Analysis', 
     'Comprehensive investigation into the factors leading to SVB''s collapse and its impact on the tech industry', 
     sarah_user_id, 'private'),
    
    ('22222222-3333-4444-5555-666666666666', 'Tesla Supply Chain Investigation', 
     'Due diligence on Tesla''s battery supply chain and raw material sourcing practices', 
     sarah_user_id, 'private'),
    
    -- Michael's Investigations
    ('33333333-4444-5555-6666-777777777777', 'Renewable Energy Market Analysis', 
     'Investigation into emerging renewable energy technologies and market leaders', 
     michael_user_id, 'private'),
    
    ('44444444-5555-6666-7777-888888888888', 'Healthcare Tech Startups', 
     'Due diligence on AI-powered healthcare technology startups', 
     michael_user_id, 'private')
    ON CONFLICT (id) DO NOTHING;

    -- Insert nodes with realistic content
    INSERT INTO public.node (id, title, description, type, owner_id, investigation_id) VALUES
    -- SVB Investigation nodes
    ('a1111111-1111-1111-1111-111111111111', 'Key Risk Indicators', 
     'Analysis of SVB''s risk management practices and warning signs before collapse', 
     'document', sarah_user_id, '11111111-2222-3333-4444-555555555555'),
    ('a2222222-2222-2222-2222-222222222222', 'Depositor Analysis', 
     'Breakdown of major depositors and their withdrawal patterns', 
     'organization', sarah_user_id, '11111111-2222-3333-4444-555555555555'),
    
    -- Tesla Investigation nodes
    ('b1111111-1111-1111-1111-111111111111', 'Lithium Supply Contracts', 
     'Analysis of Tesla''s lithium supply agreements and pricing structures', 
     'document', sarah_user_id, '22222222-3333-4444-5555-666666666666'),
    ('b2222222-2222-2222-2222-222222222222', 'Battery Manufacturing Partners', 
     'Assessment of key battery manufacturing partnerships and capabilities', 
     'organization', sarah_user_id, '22222222-3333-4444-5555-666666666666'),
    
    -- Renewable Energy nodes
    ('c1111111-1111-1111-1111-111111111111', 'Solar Technology Patents', 
     'Analysis of breakthrough solar cell technology patents', 
     'document', michael_user_id, '33333333-4444-5555-6666-777777777777'),
    ('c2222222-2222-2222-2222-222222222222', 'Energy Storage Solutions', 
     'Comparison of grid-scale energy storage technologies', 
     'concept', michael_user_id, '33333333-4444-5555-6666-777777777777'),
    
    -- Healthcare Tech nodes
    ('d1111111-1111-1111-1111-111111111111', 'AI Diagnostic Platforms', 
     'Evaluation of AI-powered diagnostic platforms and their clinical validation', 
     'concept', michael_user_id, '44444444-5555-6666-7777-888888888888'),
    ('d2222222-2222-2222-2222-222222222222', 'Market Size Analysis', 
     'Healthcare AI market size and growth projections', 
     'document', michael_user_id, '44444444-5555-6666-7777-888888888888')
    ON CONFLICT (id) DO NOTHING;

    -- Create reports table if it doesn't exist
    CREATE TABLE IF NOT EXISTS public.report (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        investigation_id UUID REFERENCES public.investigation(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        content TEXT,
        author_id UUID REFERENCES auth.users(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Enable RLS on reports
    ALTER TABLE public.report ENABLE ROW LEVEL SECURITY;

    -- Insert realistic reports
    INSERT INTO public.report (id, investigation_id, title, content, author_id) VALUES
    -- SVB Investigation Reports
    ('r1111111-1111-1111-1111-111111111111', 
     '11111111-2222-3333-4444-555555555555',
     'SVB Asset Concentration Risk',
     'Analysis reveals significant concentration in long-duration securities and exposure to interest rate risk. Key findings show over 55% of assets in mortgage-backed securities with average duration of 6+ years.',
     sarah_user_id),
    
    ('r2222222-2222-2222-2222-222222222222',
     '11111111-2222-3333-4444-555555555555',
     'Tech Sector Deposit Analysis',
     'Examination of deposit concentration in venture-backed technology companies. Data shows 93% of deposits were uninsured, with significant exposure to early-stage startups.',
     sarah_user_id),

    -- Tesla Supply Chain Reports
    ('r3333333-3333-3333-3333-333333333333',
     '22222222-3333-4444-5555-666666666666',
     'Lithium Supply Security Assessment',
     'Detailed analysis of Tesla''s lithium supply agreements reveals strategic partnerships with major producers in Australia and Chile, covering approximately 80% of projected demand through 2025.',
     sarah_user_id),

    -- Renewable Energy Reports
    ('r4444444-4444-4444-4444-444444444444',
     '33333333-4444-5555-6666-777777777777',
     'Next-Gen Solar Technology Review',
     'Assessment of perovskite solar cell technology developments and commercial viability. Efficiency improvements of 50% observed in laboratory conditions.',
     michael_user_id),

    -- Healthcare Tech Reports
    ('r5555555-5555-5555-5555-555555555555',
     '44444444-5555-6666-7777-888888888888',
     'AI Diagnostic Accuracy Study',
     'Comparative analysis of leading AI diagnostic platforms shows 94% accuracy in radiology applications, with significant cost reduction potential.',
     michael_user_id)
    ON CONFLICT (id) DO NOTHING;

    -- Create RLS policies for reports
    CREATE POLICY "Users can view their own reports"
        ON public.report
        FOR SELECT
        TO authenticated
        USING (author_id = auth.uid());

    CREATE POLICY "Users can insert their own reports"
        ON public.report
        FOR INSERT
        TO authenticated
        WITH CHECK (author_id = auth.uid());

    CREATE POLICY "Users can update their own reports"
        ON public.report
        FOR UPDATE
        TO authenticated
        USING (author_id = auth.uid());

    CREATE POLICY "Users can delete their own reports"
        ON public.report
        FOR DELETE
        TO authenticated
        USING (author_id = auth.uid());

END $$;