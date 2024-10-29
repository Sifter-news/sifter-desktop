-- Reset tables
TRUNCATE TABLE auth.users CASCADE;
TRUNCATE TABLE public.profiles CASCADE;
TRUNCATE TABLE public.investigations CASCADE;
TRUNCATE TABLE public.reports CASCADE;
TRUNCATE TABLE public.node CASCADE;

-- Create admin user
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    created_at,
    updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    '02ecf5ce-3663-4897-9b9f-c084dac6b3da',
    'authenticated',
    'authenticated',
    'admin@sifter.news',
    crypt('admin123', gen_salt('bf')),
    NOW(),
    NOW(),
    '{"provider": "email", "providers": ["email"]}'::jsonb,
    '{"name": "Admin User"}'::jsonb,
    true,
    NOW(),
    NOW()
);

-- Create corresponding profile
INSERT INTO public.profiles (id, username, email)
VALUES (
    '02ecf5ce-3663-4897-9b9f-c084dac6b3da',
    'admin',
    'admin@sifter.news'
);

-- Create 10 projects with articles and nodes
DO $$
DECLARE
    new_investigation_id UUID;
    node_styles TEXT[] := ARRAY['default', 'compact', 'postit'];
    node_types TEXT[] := ARRAY['node_person', 'node_organization', 'node_object', 'node_concept', 'node_location', 'node_event'];
BEGIN
    -- Create 10 projects
    FOR i IN 1..10 LOOP
        -- Insert investigation
        INSERT INTO public.investigations (
            id,
            title,
            description,
            owner_id,
            visibility,
            investigation_type
        ) VALUES (
            uuid_generate_v4(),
            'Project ' || i,
            'Description for project ' || i,
            '02ecf5ce-3663-4897-9b9f-c084dac6b3da',
            'private',
            'generic'
        ) RETURNING id INTO new_investigation_id;

        -- Create 10 articles for each project
        FOR j IN 1..10 LOOP
            INSERT INTO public.reports (
                investigation_id,
                title,
                content
            ) VALUES (
                new_investigation_id,
                'Article ' || j || ' for Project ' || i,
                'Content for article ' || j || ' in project ' || i
            );
        END LOOP;

        -- Create nodes with all combinations of styles and types
        FOREACH node_style IN ARRAY node_styles
        LOOP
            FOREACH node_type IN ARRAY node_types
            LOOP
                INSERT INTO public.node (
                    title,
                    description,
                    type,
                    investigation_id,
                    visual_style,
                    node_type,
                    position_x,
                    position_y,
                    position_z,
                    metadata
                ) VALUES (
                    node_type || ' with ' || node_style || ' style',
                    'Description for ' || node_type || ' node',
                    node_type,
                    new_investigation_id,
                    node_style,
                    node_type,
                    (random() * 1000)::numeric(10,2),
                    (random() * 1000)::numeric(10,2),
                    0::numeric(10,2),
                    jsonb_build_object(
                        'created_date', NOW(),
                        'last_modified', NOW(),
                        'metadata_version', '1.0',
                        'importance_level', (random() * 5 + 1)::int,
                        'verification_status', CASE WHEN random() > 0.5 THEN 'verified' ELSE 'pending' END
                    )
                );
            END LOOP;
        END LOOP;
    END LOOP;
END $$;