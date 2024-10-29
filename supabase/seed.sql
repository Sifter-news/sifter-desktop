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
    '{"provider": "email", "providers": ["email"]}'::jsonb,
    '{"name": "Admin User"}'::jsonb,
    true,
    NOW(),
    NOW()
);

-- Create corresponding profile
INSERT INTO public.profiles (id, username, email)
VALUES (
    'd0d8c19c-3b3e-4f5a-a7b0-d9cee666d454',
    'admin',
    'admin@sifter.news'
);

-- Investigation types array
DO $$
DECLARE
    investigation_types TEXT[] := ARRAY['pre-deal', 'post-deal', 'aml', 'kyc', 'regulatory', 'fraud', 'background', 'asset', 'generic'];
    investigation_type TEXT;
    i INTEGER;
    new_investigation_id UUID;
    node_styles TEXT[] := ARRAY['default', 'compact', 'postit'];
    node_types TEXT[] := ARRAY['node_person', 'node_organization', 'node_object', 'node_concept', 'node_location', 'node_event'];
    report_titles TEXT[] := ARRAY[
        'Initial Findings Report',
        'Key Stakeholder Analysis',
        'Risk Assessment Summary',
        'Financial Impact Analysis',
        'Compliance Review Results',
        'Final Recommendations'
    ];
BEGIN
    FOREACH investigation_type IN ARRAY investigation_types
    LOOP
        -- Create 10 investigations for each type
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
                CASE investigation_type
                    WHEN 'pre-deal' THEN 'Pre-Deal DD: ' || (SELECT array_to_string(ARRAY(SELECT chr((65 + round(random() * 25))::integer) FROM generate_series(1,8)), ''))
                    WHEN 'post-deal' THEN 'Post-Deal Integration Analysis: Phase ' || i
                    WHEN 'aml' THEN 'AML Investigation: Case #' || (1000 + i)
                    WHEN 'kyc' THEN 'KYC Review: Client ' || (SELECT array_to_string(ARRAY(SELECT chr((65 + round(random() * 25))::integer) FROM generate_series(1,5)), ''))
                    WHEN 'regulatory' THEN 'Regulatory Compliance Review ' || date_trunc('month', NOW() - (i || ' month')::interval)::date
                    WHEN 'fraud' THEN 'Fraud Investigation: Case #FR-' || (2000 + i)
                    WHEN 'background' THEN 'Background Check: Subject ' || (SELECT array_to_string(ARRAY(SELECT chr((65 + round(random() * 25))::integer) FROM generate_series(1,6)), ''))
                    WHEN 'asset' THEN 'Asset Tracing: Project ' || (SELECT array_to_string(ARRAY(SELECT chr((65 + round(random() * 25))::integer) FROM generate_series(1,4)), ''))
                    ELSE 'General Investigation #' || i
                END,
                'Comprehensive investigation focusing on ' || investigation_type || ' aspects. Case number ' || i || ' of our ongoing series.',
                'd0d8c19c-3b3e-4f5a-a7b0-d9cee666d454',
                'private',
                investigation_type
            ) RETURNING id INTO new_investigation_id;

            -- Create 6 detailed reports for each investigation
            FOR j IN 1..6 LOOP
                INSERT INTO public.reports (
                    investigation_id,
                    title,
                    content
                ) VALUES (
                    new_investigation_id,
                    report_titles[j],
                    'Executive Summary:
                    
This comprehensive report details our findings regarding ' || investigation_type || ' investigation case ' || i || '. 

Key Findings:
1. Initial assessment revealed significant patterns in the data
2. Multiple stakeholders were identified and interviewed
3. Documentation review uncovered several critical aspects
4. Financial analysis showed important trends
5. Risk factors were evaluated and categorized

Detailed Analysis:
The investigation uncovered multiple layers of complexity requiring careful consideration. Our team conducted extensive interviews with key stakeholders, reviewed thousands of documents, and performed detailed financial analysis.

Stakeholder Interviews:
- Senior management provided valuable insights
- Key employees were interviewed
- External partners contributed important perspectives
- Client representatives shared crucial information

Document Review:
- Corporate records were thoroughly examined
- Financial statements were analyzed in detail
- Communication records were reviewed
- Legal documentation was assessed

Risk Assessment:
1. Operational Risks
   - Process inefficiencies identified
   - Control gaps documented
   - Improvement opportunities noted

2. Financial Risks
   - Cash flow patterns analyzed
   - Investment risks evaluated
   - Market exposure assessed

3. Compliance Risks
   - Regulatory requirements reviewed
   - Policy adherence checked
   - Procedure gaps identified

Recommendations:
Based on our findings, we recommend:
1. Implementing enhanced monitoring systems
2. Strengthening internal controls
3. Updating compliance procedures
4. Improving documentation processes
5. Enhancing stakeholder communication

Next Steps:
1. Review and prioritize recommendations
2. Develop implementation timeline
3. Assign responsibilities
4. Monitor progress
5. Schedule follow-up assessment

This report represents our current findings and may be updated as new information becomes available.'
                );
            END LOOP;

            -- Create nodes of different styles and types
            FOR node_style IN SELECT unnest(node_styles)
            LOOP
                FOR node_type IN SELECT unnest(node_types)
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
                        metadata
                    ) VALUES (
                        CASE node_type
                            WHEN 'node_person' THEN 'Person: ' || (SELECT array_to_string(ARRAY(SELECT chr((65 + round(random() * 25))::integer) FROM generate_series(1,8)), ''))
                            WHEN 'node_organization' THEN 'Organization: ' || (SELECT array_to_string(ARRAY(SELECT chr((65 + round(random() * 25))::integer) FROM generate_series(1,6)), '')) || ' Corp'
                            WHEN 'node_object' THEN 'Asset: ' || (SELECT array_to_string(ARRAY(SELECT chr((65 + round(random() * 25))::integer) FROM generate_series(1,5)), ''))
                            WHEN 'node_concept' THEN 'Concept: ' || (SELECT array_to_string(ARRAY(SELECT chr((65 + round(random() * 25))::integer) FROM generate_series(1,7)), ''))
                            WHEN 'node_location' THEN 'Location: ' || (SELECT array_to_string(ARRAY(SELECT chr((65 + round(random() * 25))::integer) FROM generate_series(1,6)), '')) || ' Office'
                            ELSE 'Event: ' || (SELECT array_to_string(ARRAY(SELECT chr((65 + round(random() * 25))::integer) FROM generate_series(1,4)), '')) || ' Meeting'
                        END,
                        'Detailed description for ' || node_type || ' in ' || investigation_type || ' investigation',
                        node_type,
                        new_investigation_id,
                        node_style,
                        node_type,
                        (random() * 1000)::numeric(10,2),
                        (random() * 1000)::numeric(10,2),
                        jsonb_build_object(
                            'created_date', NOW() - (random() * 365 || ' days')::interval,
                            'last_modified', NOW() - (random() * 30 || ' days')::interval,
                            'metadata_version', '1.0',
                            'importance_level', (random() * 5 + 1)::int,
                            'verification_status', CASE WHEN random() > 0.5 THEN 'verified' ELSE 'pending' END
                        )
                    );
                END LOOP;
            END LOOP;
        END LOOP;
    END LOOP;
END $$;