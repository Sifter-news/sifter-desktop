DO $$
DECLARE
    admin_user_id UUID;
BEGIN
    -- Create admin user if not exists
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
    VALUES 
        ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'admin@sifter.news', '$2a$10$abcdefghijklmnopqrstuvwxyz', NOW(), NOW(), NOW())
    ON CONFLICT (id) DO NOTHING;
    
    admin_user_id := 'dddddddd-dddd-dddd-dddd-dddddddddddd';
    
    -- Insert admin profile
    INSERT INTO public.profiles (id, username, full_name)
    VALUES 
        (admin_user_id, 'admin', 'Sifter Admin')
    ON CONFLICT (id) DO NOTHING;
    
    -- Insert investigations (projects)
    INSERT INTO public.investigation (id, title, description, owner_id, visibility) VALUES
    ('11111111-2222-3333-4444-555555555555', 'Human Survival Needs', 
     'An investigation into the essential elements required for human survival, including physiological needs, safety, and psychological well-being.', 
     admin_user_id, 'private'),
    
    ('22222222-3333-4444-5555-666666666666', 'Startup Investment Due Diligence', 
     'A comprehensive investigation into the key aspects of evaluating a potential startup investment, covering financial, legal, and market analysis.', 
     admin_user_id, 'private'),
    
    ('33333333-4444-5555-6666-777777777777', 'Climate Change', 
     'Climate change is a long-term shift in global or regional climate patterns. Often climate change refers specifically to the rise in global temperatures from the mid-20th century to present.', 
     admin_user_id, 'private'),
    
    ('44444444-5555-6666-7777-888888888888', 'Artificial Intelligence', 
     'Artificial Intelligence (AI) is the simulation of human intelligence processes by machines, especially computer systems. These processes include learning, reasoning, and self-correction.', 
     admin_user_id, 'private')
    ON CONFLICT (id) DO NOTHING;

    -- Insert reports for each investigation
    INSERT INTO public.report (id, investigation_id, title, content, author_id) VALUES
    -- Human Survival Needs Reports
    ('r1111111-1111-1111-1111-111111111111', 
     '11111111-2222-3333-4444-555555555555',
     'Basic Physiological Needs',
     'Humans require air, water, food, shelter, and sleep to survive. This article explores the minimum requirements for each of these essential needs...',
     admin_user_id),
    
    ('r2222222-2222-2222-2222-222222222222',
     '11111111-2222-3333-4444-555555555555',
     'Safety and Security',
     'Beyond basic physiological needs, humans require safety and security for long-term survival. This includes physical safety, financial security, and health...',
     admin_user_id),

    -- Startup Investment Reports
    ('r3333333-3333-3333-3333-333333333333',
     '22222222-3333-4444-5555-666666666666',
     'Financial Analysis',
     'This report delves into the startup''s financial health, including revenue models, burn rate, and projections. It also examines the company''s funding history and capitalization table...',
     admin_user_id),

    -- Climate Change Reports
    ('r4444444-4444-4444-4444-444444444444',
     '33333333-4444-5555-6666-777777777777',
     'Global Warming Trends',
     'Recent studies show an alarming increase in global temperatures over the past century, with significant acceleration in the last few decades...',
     admin_user_id),

    -- AI Reports
    ('r5555555-5555-5555-5555-555555555555',
     '44444444-5555-6666-7777-888888888888',
     'Machine Learning Breakthroughs',
     'Recent advancements in machine learning algorithms have led to significant improvements in natural language processing and computer vision...',
     admin_user_id)
    ON CONFLICT (id) DO NOTHING;

END $$;