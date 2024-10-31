-- Reset tables
TRUNCATE TABLE public.investigations CASCADE;
TRUNCATE TABLE public.reports CASCADE;
TRUNCATE TABLE public.node CASCADE;
TRUNCATE TABLE public.node_person CASCADE;
TRUNCATE TABLE public.node_organization CASCADE;
TRUNCATE TABLE public.node_object CASCADE;
TRUNCATE TABLE public.node_concept CASCADE;
TRUNCATE TABLE public.node_location CASCADE;
TRUNCATE TABLE public.node_event CASCADE;

-- Create admin user
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    '02ecf5ce-3663-4897-9b9f-c084dac6b3da',
    'authenticated',
    'authenticated',
    'admin@sifter.news',
    '$2a$10$PxwO5Ls8TzxEGXZRWqS.8OqJp6VxQyK9mOIJJmh8YOqIW5/p8wVLe', -- password is 'password'
    NOW(),
    NOW(),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
);

-- Create investigations with nodes and reports
DO $$
DECLARE
    new_investigation_id UUID;
    new_node_id UUID;
    node_styles TEXT[] := ARRAY['default', 'compact', 'postit'];
    node_types TEXT[] := ARRAY['node_person', 'node_organization', 'node_object', 'node_concept', 'node_location', 'node_event'];
    investigation_case JSONB;
    report_title TEXT;
    i INT;
    j INT;
BEGIN
    FOR i IN 1..5 LOOP
        -- Create investigation
        INSERT INTO public.investigations (
            id,
            title,
            description,
            owner_id,
            visibility,
            investigation_type
        ) VALUES (
            uuid_generate_v4(),
            'Investigation ' || i,
            'Description for investigation ' || i,
            '02ecf5ce-3663-4897-9b9f-c084dac6b3da',
            'private',
            'generic'
        ) RETURNING id INTO new_investigation_id;

        -- Create reports
        FOR j IN 1..3 LOOP
            INSERT INTO public.reports (
                investigation_id,
                title,
                content
            ) VALUES (
                new_investigation_id,
                'Report ' || j || ' for Investigation ' || i,
                'Content for report ' || j || ' in investigation ' || i
            );
        END LOOP;

        -- Create nodes with different styles and types
        FOR node_style IN SELECT unnest(node_styles)
        LOOP
            FOR node_type IN SELECT unnest(node_types)
            LOOP
                -- Insert base node
                INSERT INTO public.node (
                    id,
                    title,
                    description,
                    investigation_id,
                    visual_style,
                    node_type,
                    position_x,
                    position_y,
                    position_z
                ) VALUES (
                    uuid_generate_v4(),
                    node_type || ' Node',
                    'Description for ' || node_type,
                    new_investigation_id,
                    node_style,
                    node_type,
                    (random() * 1000)::numeric(10,2),
                    (random() * 1000)::numeric(10,2),
                    0
                ) RETURNING id INTO new_node_id;

                -- Insert type-specific data
                CASE node_type
                    WHEN 'node_person' THEN
                        INSERT INTO public.node_person (node_id, birth_date, aliases)
                        VALUES (new_node_id, '1990-01-01', ARRAY['alias1', 'alias2']);
                    
                    WHEN 'node_organization' THEN
                        INSERT INTO public.node_organization (node_id, legal_name)
                        VALUES (new_node_id, 'Organization ' || i);
                    
                    WHEN 'node_object' THEN
                        INSERT INTO public.node_object (node_id, object_type)
                        VALUES (new_node_id, 'physical');
                    
                    WHEN 'node_concept' THEN
                        INSERT INTO public.node_concept (node_id, definition)
                        VALUES (new_node_id, 'Definition for concept ' || i);
                    
                    ELSE NULL;
                END CASE;
            END LOOP;
        END LOOP;
    END LOOP;
END $$;
