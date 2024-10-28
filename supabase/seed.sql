-- Reset tables
TRUNCATE TABLE auth.users CASCADE;
TRUNCATE TABLE public.profiles CASCADE;
TRUNCATE TABLE public.investigations CASCADE;
TRUNCATE TABLE public.reports CASCADE;
TRUNCATE TABLE public.node CASCADE;

-- Create users in auth.users with proper authentication
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
    updated_at,
    phone,
    phone_confirmed_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES
(
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
    NOW(),
    NULL,
    NULL,
    '',
    '',
    '',
    ''
),
(
    '00000000-0000-0000-0000-000000000000',
    'e1f2g3h4-5i6j-7k8l-9m0n-opqrstuvwxyz',
    'authenticated',
    'authenticated',
    'sarah@ddteam.com',
    crypt('sarah123', gen_salt('bf')),
    NOW(),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"name": "Sarah"}',
    false,
    NOW(),
    NOW(),
    NULL,
    NULL,
    '',
    '',
    '',
    ''
),
(
    '00000000-0000-0000-0000-000000000000',
    uuid_generate_v4(),
    'authenticated',
    'authenticated',
    'financial@example.com',
    crypt('password123', gen_salt('bf')),
    NOW(),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"name": "Financial Investigator"}',
    false,
    NOW(),
    NOW(),
    NULL,
    NULL,
    '',
    '',
    '',
    ''
),
(
    '00000000-0000-0000-0000-000000000000',
    uuid_generate_v4(),
    'authenticated',
    'authenticated',
    'criminal@example.com',
    crypt('password123', gen_salt('bf')),
    NOW(),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"name": "Criminal Investigator"}',
    false,
    NOW(),
    NOW(),
    NULL,
    NULL,
    '',
    '',
    '',
    ''
),
(
    '00000000-0000-0000-0000-000000000000',
    uuid_generate_v4(),
    'authenticated',
    'authenticated',
    'private@example.com',
    crypt('password123', gen_salt('bf')),
    NOW(),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"name": "Private Investigator"}',
    false,
    NOW(),
    NOW(),
    NULL,
    NULL,
    '',
    '',
    '',
    ''
),
(
    '00000000-0000-0000-0000-000000000000',
    uuid_generate_v4(),
    'authenticated',
    'authenticated',
    'academic-ai@example.com',
    crypt('password123', gen_salt('bf')),
    NOW(),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"name": "AI Research Investigator"}',
    false,
    NOW(),
    NOW(),
    NULL,
    NULL,
    '',
    '',
    '',
    ''
),
(
    '00000000-0000-0000-0000-000000000000',
    uuid_generate_v4(),
    'authenticated',
    'authenticated',
    'academic-history@example.com',
    crypt('password123', gen_salt('bf')),
    NOW(),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"name": "Historical Research"}',
    false,
    NOW(),
    NOW(),
    NULL,
    NULL,
    '',
    '',
    '',
    ''
),
(
    '00000000-0000-0000-0000-000000000000',
    uuid_generate_v4(),
    'authenticated',
    'authenticated',
    'sales@example.com',
    crypt('password123', gen_salt('bf')),
    NOW(),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"name": "Sales Due Diligence"}',
    false,
    NOW(),
    NOW(),
    NULL,
    NULL,
    '',
    '',
    '',
    ''
),
(
    '00000000-0000-0000-0000-000000000000',
    uuid_generate_v4(),
    'authenticated',
    'authenticated',
    'marketing@example.com',
    crypt('password123', gen_salt('bf')),
    NOW(),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"name": "Marketing Research"}',
    false,
    NOW(),
    NOW(),
    NULL,
    NULL,
    '',
    '',
    '',
    ''
);

-- Create corresponding profiles
INSERT INTO public.profiles (id, username, email)
SELECT id, 
       CASE 
           WHEN email = 'admin@sifter.news' THEN 'admin'
           WHEN email = 'sarah@ddteam.com' THEN 'sarah'
           ELSE split_part(email, '@', 1)
       END,
       email
FROM auth.users;

-- Create sample investigations with relevant titles for each user type
INSERT INTO public.investigations (id, title, description, owner_id, visibility, investigation_type)
SELECT 
    uuid_generate_v4(),
    CASE 
        WHEN u.email = 'financial@example.com' THEN 'Financial Fraud Investigation'
        WHEN u.email = 'criminal@example.com' THEN 'Criminal Network Analysis'
        WHEN u.email = 'private@example.com' THEN 'Corporate Background Check'
        WHEN u.email = 'academic-ai@example.com' THEN 'AI Ethics Research'
        WHEN u.email = 'academic-history@example.com' THEN 'Historical Document Analysis'
        WHEN u.email = 'sales@example.com' THEN 'Sales Pipeline Due Diligence'
        WHEN u.email = 'marketing@example.com' THEN 'Market Competition Analysis'
        WHEN u.email = 'sarah@ddteam.com' THEN 'TechCorp Acquisition DD'
        ELSE 'General Investigation'
    END,
    CASE 
        WHEN u.email = 'financial@example.com' THEN 'Investigation into suspected financial fraud patterns'
        WHEN u.email = 'criminal@example.com' THEN 'Analysis of potential criminal network connections'
        WHEN u.email = 'private@example.com' THEN 'Corporate entity background verification'
        WHEN u.email = 'academic-ai@example.com' THEN 'Research into AI system ethical implications'
        WHEN u.email = 'academic-history@example.com' THEN 'Analysis of historical documents and connections'
        WHEN u.email = 'sales@example.com' THEN 'Due diligence on sales pipeline and prospects'
        WHEN u.email = 'marketing@example.com' THEN 'Analysis of market competition and positioning'
        WHEN u.email = 'sarah@ddteam.com' THEN 'Due diligence investigation for TechCorp acquisition'
        ELSE 'General investigation description'
    END,
    u.id,
    'private',
    CASE 
        WHEN u.email LIKE 'academic%' THEN 'research'
        WHEN u.email IN ('financial@example.com', 'sales@example.com') THEN 'pre-deal'
        WHEN u.email = 'criminal@example.com' THEN 'fraud'
        WHEN u.email = 'private@example.com' THEN 'background'
        WHEN u.email = 'marketing@example.com' THEN 'generic'
        ELSE 'generic'
    END
FROM auth.users u;