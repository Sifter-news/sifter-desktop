DO $$ 
BEGIN
    -- Insert subscription plans
    IF NOT EXISTS (SELECT 1 FROM public.subscription_plan LIMIT 1) THEN
        INSERT INTO public.subscription_plan (id, name, price, description) VALUES
        ('11111111-1111-1111-1111-111111111111', 'Free', 0, 'Basic features for individual use'),
        ('22222222-2222-2222-2222-222222222222', 'Pro', 9.99, 'Advanced features for professionals'),
        ('33333333-3333-3333-3333-333333333333', 'Team', 29.99, 'Collaborative features for teams');
    END IF;

    -- Insert sample profiles
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE username = 'financial_investigator') THEN
        INSERT INTO public.profiles (id, username, full_name) VALUES
        ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'financial_investigator', 'Financial Investigator'),
        ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'criminal_investigator', 'Criminal Investigator'),
        ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'private_investigator', 'Private Investigator');
    END IF;

    -- Insert sample projects
    IF NOT EXISTS (SELECT 1 FROM public.project WHERE title LIKE 'Financial Case%') THEN
        INSERT INTO public.project (title, description, owner_id, visibility)
        SELECT 
            'Financial Case ' || generate_series,
            'Investigation case ' || generate_series,
            id,
            'private'
        FROM public.profiles
        CROSS JOIN generate_series(1, 3);
    END IF;
END $$;