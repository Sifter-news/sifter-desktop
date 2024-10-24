-- Insert subscription tiers
INSERT INTO public.user_subscription_tiers (id, name, price, description, stripe_plan_id)
VALUES 
    (gen_random_uuid(), 'Free', 0, 'Basic features for individual use', 'price_free'),
    (gen_random_uuid(), 'Pro', 9.99, 'Advanced features for professional use', 'price_pro');

-- Function to create sample projects for a user
CREATE OR REPLACE FUNCTION create_sample_projects(user_id UUID)
RETURNS void AS $$
DECLARE
    i INTEGER;
    project_id UUID;
BEGIN
    FOR i IN 1..10 LOOP
        INSERT INTO public.user_project (title, description, owner_id, visibility)
        VALUES (
            'Project ' || i || ' - User ' || user_id,
            'Description for project ' || i,
            user_id,
            CASE WHEN i % 2 = 0 THEN 'public' ELSE 'private' END
        ) RETURNING id INTO project_id;
        
        -- Add a sample node for each project
        INSERT INTO public.node (title, description, type, owner_id, project_id)
        VALUES (
            'Initial Node - Project ' || i,
            'Starting point for project ' || i,
            'concept',
            user_id,
            project_id
        );
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Create 10 users with projects
DO $$
DECLARE
    free_plan_id UUID;
    pro_plan_id UUID;
    user_id UUID;
    i INTEGER;
BEGIN
    -- Get plan IDs
    SELECT id INTO free_plan_id FROM public.user_subscription_tiers WHERE name = 'Free' LIMIT 1;
    SELECT id INTO pro_plan_id FROM public.user_subscription_tiers WHERE name = 'Pro' LIMIT 1;
    
    -- Create 10 users
    FOR i IN 1..10 LOOP
        -- Create user in auth.users first (this is required for RLS)
        INSERT INTO auth.users (email, encrypted_password, email_confirmed_at)
        VALUES (
            'user' || i || '@sifter.news',
            crypt('SiftedWorld@2024', gen_salt('bf')),
            NOW()
        ) RETURNING id INTO user_id;
        
        -- Create user profile
        INSERT INTO public.user_profiles (
            id,
            username,
            subscription_plan_id,
            subscription_status
        )
        VALUES (
            user_id,
            'user' || i,
            CASE WHEN i <= 5 THEN pro_plan_id ELSE free_plan_id END,
            'active'
        );
        
        -- Create sample projects for the user
        PERFORM create_sample_projects(user_id);
    END LOOP;
END $$;

-- Log initial actions
INSERT INTO public.log_user (user_id, action)
SELECT id, 'Account created'
FROM public.user_profiles;