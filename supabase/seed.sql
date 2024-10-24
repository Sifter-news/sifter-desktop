-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Insert sample investigations and reports
INSERT INTO public.investigation (id, title, description, owner_id)
SELECT 
    uuid_generate_v4(),
    'Sample Investigation',
    'This is a sample investigation description',
    (SELECT id FROM public.profiles LIMIT 1)
WHERE EXISTS (SELECT 1 FROM public.profiles LIMIT 1);

INSERT INTO public.report (id, title, description, investigation_id)
SELECT 
    uuid_generate_v4(),
    'Sample Report',
    'This is a sample report description',
    (SELECT id FROM public.investigation LIMIT 1)
WHERE EXISTS (SELECT 1 FROM public.investigation LIMIT 1);