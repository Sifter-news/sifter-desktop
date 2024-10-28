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
    'd0d8c19c-3b3e-4f5a-a7b0-d9cee666d454',
    'authenticated',
    'authenticated',
    'admin@sifter.news',
    crypt('admin123', gen_salt('bf')),
    NOW(),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"name": "Admin User"}',
    false,
    NOW(),
    NOW()
);

-- Create test users with proper UUIDs
DO $$
DECLARE
    test_users TEXT[] := ARRAY[
        'sarah@ddteam.com',
        'financial@example.com',
        'criminal@example.com',
        'private@example.com',
        'academic-ai@example.com',
        'academic-history@example.com',
        'sales@example.com',
        'marketing@example.com'
    ];
    user_email TEXT;
    user_id UUID;
BEGIN
    FOREACH user_email IN ARRAY test_users
    LOOP
        user_id := uuid_generate_v4();
        
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
            user_id,
            'authenticated',
            'authenticated',
            user_email,
            crypt('password123', gen_salt('bf')),
            NOW(),
            NOW(),
            '{"provider": "email", "providers": ["email"]}',
            format('{"name": "%s"}', split_part(user_email, '@', 1)),
            false,
            NOW(),
            NOW()
        );

        -- Create corresponding profile
        INSERT INTO public.profiles (id, username, email)
        VALUES (
            user_id,
            split_part(user_email, '@', 1),
            user_email
        );

        -- Create sample investigation for each user
        INSERT INTO public.investigations (
            id,
            title,
            description,
            owner_id,
            visibility,
            investigation_type
        ) VALUES (
            uuid_generate_v4(),
            CASE 
                WHEN user_email = 'financial@example.com' THEN 'Financial Fraud Investigation'
                WHEN user_email = 'criminal@example.com' THEN 'Criminal Network Analysis'
                WHEN user_email = 'private@example.com' THEN 'Corporate Background Check'
                WHEN user_email = 'academic-ai@example.com' THEN 'AI Ethics Research'
                WHEN user_email = 'academic-history@example.com' THEN 'Historical Document Analysis'
                WHEN user_email = 'sales@example.com' THEN 'Sales Pipeline Due Diligence'
                WHEN user_email = 'marketing@example.com' THEN 'Market Competition Analysis'
                WHEN user_email = 'sarah@ddteam.com' THEN 'TechCorp Acquisition DD'
                ELSE 'General Investigation'
            END,
            CASE 
                WHEN user_email = 'financial@example.com' THEN 'Investigation into suspected financial fraud patterns'
                WHEN user_email = 'criminal@example.com' THEN 'Analysis of potential criminal network connections'
                WHEN user_email = 'private@example.com' THEN 'Corporate entity background verification'
                WHEN user_email = 'academic-ai@example.com' THEN 'Research into AI system ethical implications'
                WHEN user_email = 'academic-history@example.com' THEN 'Analysis of historical documents and connections'
                WHEN user_email = 'sales@example.com' THEN 'Due diligence on sales pipeline and prospects'
                WHEN user_email = 'marketing@example.com' THEN 'Analysis of market competition and positioning'
                WHEN user_email = 'sarah@ddteam.com' THEN 'Due diligence investigation for TechCorp acquisition'
                ELSE 'General investigation description'
            END,
            user_id,
            'private',
            CASE 
                WHEN user_email LIKE 'academic%' THEN 'research'
                WHEN user_email IN ('financial@example.com', 'sales@example.com') THEN 'pre-deal'
                WHEN user_email = 'criminal@example.com' THEN 'fraud'
                WHEN user_email = 'private@example.com' THEN 'background'
                WHEN user_email = 'marketing@example.com' THEN 'generic'
                ELSE 'generic'
            END
        );
    END LOOP;
END $$;