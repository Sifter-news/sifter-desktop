-- Reset tables
TRUNCATE TABLE public.investigations CASCADE;
TRUNCATE TABLE public.reports CASCADE;
TRUNCATE TABLE public.node CASCADE;
TRUNCATE TABLE public.node_concept CASCADE;
TRUNCATE TABLE public.node_event CASCADE;
TRUNCATE TABLE public.node_location CASCADE;
TRUNCATE TABLE public.node_object CASCADE;
TRUNCATE TABLE public.node_organization CASCADE;
TRUNCATE TABLE public.node_person CASCADE;

-- Create sample investigations
DO $$
DECLARE
    investigation_id uuid;
    report_id uuid;
    node_id uuid;
    node_type text;
    node_types text[] := ARRAY['node_person', 'node_organization', 'node_object', 'node_concept', 'node_location', 'node_event'];
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
        FOR j IN 1..2 LOOP
            INSERT INTO public.reports (
                title,
                content,
                investigation_id
            ) VALUES (
                'Report ' || j || ' for Investigation ' || i,
                'This is the content of report ' || j || ' for investigation ' || i,
                investigation_id
            ) RETURNING id INTO report_id;
        END LOOP;

        -- Create nodes of different types for each investigation
        FOREACH node_type IN ARRAY node_types
        LOOP
            INSERT INTO public.node (
                title,
                description,
                investigation_id,
                node_type,
                position_x,
                position_y,
                position_z,
                visual_style
            ) VALUES (
                'Sample ' || node_type || ' Node',
                'Description for ' || node_type || ' node',
                investigation_id,
                node_type,
                (random() * 1000)::numeric,
                (random() * 1000)::numeric,
                0,
                'default'
            ) RETURNING id INTO node_id;

            -- Insert corresponding type-specific data
            CASE node_type
                WHEN 'node_person' THEN
                    INSERT INTO public.node_person (node_id, birth_date)
                    VALUES (node_id, NOW() - interval '30 years');
                WHEN 'node_organization' THEN
                    INSERT INTO public.node_organization (node_id, legal_name)
                    VALUES (node_id, 'Organization ' || node_id);
                WHEN 'node_object' THEN
                    INSERT INTO public.node_object (node_id, object_type)
                    VALUES (node_id, 'Sample Object');
                WHEN 'node_concept' THEN
                    INSERT INTO public.node_concept (node_id, definition)
                    VALUES (node_id, 'Sample concept definition');
                WHEN 'node_location' THEN
                    INSERT INTO public.node_location (id, name, description)
                    VALUES (node_id, 'Location ' || node_id, 'Sample location description');
                WHEN 'node_event' THEN
                    INSERT INTO public.node_event (id, event_name, event_type, investigation_id)
                    VALUES (node_id, 'Event ' || node_id, 'Sample Event', investigation_id);
            END CASE;
        END LOOP;
    END LOOP;
END $$;