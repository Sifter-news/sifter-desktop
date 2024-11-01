-- Reset tables
TRUNCATE TABLE public.profiles CASCADE;
TRUNCATE TABLE public.investigations CASCADE;
TRUNCATE TABLE public.node CASCADE;
TRUNCATE TABLE public.reports CASCADE;

-- Create test profiles
INSERT INTO public.profiles (id, username, full_name, email)
VALUES 
  ('02ecf5ce-3663-4897-9b9f-c084dac6b3da', 'testuser1', 'Test User 1', 'test1@example.com'),
  ('12ecf5ce-3663-4897-9b9f-c084dac6b3db', 'testuser2', 'Test User 2', 'test2@example.com');

-- Create sample investigations
DO $$
DECLARE
    investigation_id uuid;
    node_id uuid;
BEGIN
    -- Create 3 sample investigations
    FOR i IN 1..3 LOOP
        INSERT INTO public.investigations (
            title,
            description,
            owner_id,
            visibility,
            view_type,
            investigation_type
        ) VALUES (
            'Sample Investigation ' || i,
            'This is a sample investigation number ' || i,
            '02ecf5ce-3663-4897-9b9f-c084dac6b3da',
            'private',
            'mind',
            'generic'
        ) RETURNING id INTO investigation_id;

        -- Create 2 reports for each investigation
        INSERT INTO public.reports (
            title,
            content,
            investigation_id
        ) VALUES 
        ('Report 1 for Investigation ' || i, 'Content for report 1 of investigation ' || i, investigation_id),
        ('Report 2 for Investigation ' || i, 'Content for report 2 of investigation ' || i, investigation_id);

        -- Create sample nodes for each investigation
        FOR j IN 1..3 LOOP
            INSERT INTO public.node (
                title,
                description,
                investigation_id,
                node_type,
                position_x,
                position_y,
                position_z,
                visual_style,
                width,
                height,
                text_size,
                text_align,
                color,
                order_index
            ) VALUES (
                'Node ' || j || ' of Investigation ' || i,
                'Description for node ' || j,
                investigation_id,
                CASE j 
                    WHEN 1 THEN 'generic'
                    WHEN 2 THEN 'person'
                    ELSE 'organization'
                END,
                j * 100,
                j * 100,
                0,
                'default',
                200,
                100,
                'medium',
                'left',
                'white',
                j
            );
        END LOOP;
    END LOOP;
END $$;