-- Reset tables
TRUNCATE TABLE auth.users CASCADE;
TRUNCATE TABLE public.profiles CASCADE;
TRUNCATE TABLE public.investigations CASCADE;
TRUNCATE TABLE public.reports CASCADE;
TRUNCATE TABLE public.node CASCADE;

-- Create users in auth.users with proper authentication
INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    confirmed_at
)
VALUES 
(
    'd0d8c19c-3b3e-4f5a-a7b0-d9cee666d454',
    'admin@sifter.news',
    crypt('admin123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"name":"Admin User"}',
    false,
    NOW()
),
(
    'e1f2g3h4-5i6j-7k8l-9m0n-opqrstuvwxyz',
    'sarah@ddteam.com',
    crypt('sarah123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"name":"Sarah"}',
    false,
    NOW()
),
(
    'a1b2c3d4-5e6f-7g8h-9i0j-klmnopqrstuv',
    'mike@ddteam.com',
    crypt('mike123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"name":"Mike"}',
    false,
    NOW()
),
(
    'm1n2o3p4-5q6r-7s8t-9u0v-wxyzabcdefgh',
    'lisa@ddteam.com',
    crypt('lisa123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"name":"Lisa"}',
    false,
    NOW()
);

-- Create corresponding profiles
INSERT INTO public.profiles (id, username, email, avatar_url)
VALUES
  ('d0d8c19c-3b3e-4f5a-a7b0-d9cee666d454', 'admin', 'admin@sifter.news', '/default-image.png'),
  ('e1f2g3h4-5i6j-7k8l-9m0n-opqrstuvwxyz', 'sarah', 'sarah@ddteam.com', '/default-image.png'),
  ('a1b2c3d4-5e6f-7g8h-9i0j-klmnopqrstuv', 'mike', 'mike@ddteam.com', '/default-image.png'),
  ('m1n2o3p4-5q6r-7s8t-9u0v-wxyzabcdefgh', 'lisa', 'lisa@ddteam.com', '/default-image.png');

-- Create sample investigations
INSERT INTO public.investigations (id, title, description, owner_id, visibility, investigation_type)
VALUES
  (uuid_generate_v4(), 'TechCorp Acquisition DD', 'Due diligence investigation for TechCorp acquisition', 'e1f2g3h4-5i6j-7k8l-9m0n-opqrstuvwxyz', 'private', 'pre-deal'),
  (uuid_generate_v4(), 'Manhattan Property Investment DD', 'Due diligence for Manhattan property investment', 'a1b2c3d4-5e6f-7g8h-9i0j-klmnopqrstuv', 'private', 'pre-deal'),
  (uuid_generate_v4(), 'Regulatory Compliance Review', 'Annual regulatory compliance review', 'm1n2o3p4-5q6r-7s8t-9u0v-wxyzabcdefgh', 'private', 'regulatory');