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
);

-- Create corresponding profiles
INSERT INTO public.profiles (id, username, email, avatar_url)
VALUES
  ('d0d8c19c-3b3e-4f5a-a7b0-d9cee666d454', 'admin', 'admin@sifter.news', '/default-image.png'),
  ('e1f2g3h4-5i6j-7k8l-9m0n-opqrstuvwxyz', 'sarah', 'sarah@ddteam.com', '/default-image.png');

-- Create sample investigations
INSERT INTO public.investigations (id, title, description, owner_id, visibility, investigation_type)
VALUES
  (uuid_generate_v4(), 'TechCorp Acquisition DD', 'Due diligence investigation for TechCorp acquisition', 'e1f2g3h4-5i6j-7k8l-9m0n-opqrstuvwxyz', 'private', 'pre-deal'),
  (uuid_generate_v4(), 'Manhattan Property Investment DD', 'Due diligence for Manhattan property investment', 'e1f2g3h4-5i6j-7k8l-9m0n-opqrstuvwxyz', 'private', 'pre-deal');