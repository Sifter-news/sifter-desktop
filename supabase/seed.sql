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

-- Create realistic investigations with articles and nodes
DO $$
DECLARE
    new_investigation_id UUID;
    node_styles TEXT[] := ARRAY['default', 'compact', 'postit'];
    node_types TEXT[] := ARRAY['node_person', 'node_organization', 'node_object', 'node_concept', 'node_location', 'node_event'];
    investigation_cases JSONB[] := ARRAY[
        '{"type": "pre-deal", "title": "Tech Startup Acquisition Due Diligence", "description": "Comprehensive due diligence investigation for potential acquisition of AI startup TechVision Inc.", "reports": ["Initial Financial Assessment", "IP Portfolio Analysis", "Market Position Review", "Team Capability Assessment", "Technical Infrastructure Audit", "Compliance Status Report", "Customer Base Analysis", "Growth Trajectory Analysis", "Risk Assessment", "Final Recommendation"]}',
        '{"type": "criminal", "title": "Corporate Fraud Investigation: BlueSkies Trading", "description": "Investigation into alleged financial fraud and market manipulation at BlueSkies Trading Corp.", "reports": ["Witness Interview Summaries", "Financial Transaction Analysis", "Document Trail Review", "Digital Evidence Report", "Pattern Analysis", "Timeline Construction", "Asset Tracking Report", "Suspect Profile Analysis", "Evidence Chain Documentation", "Investigation Summary"]}',
        '{"type": "academic", "title": "Historical Document Authentication Study", "description": "Authentication investigation of recently discovered 16th century manuscripts", "reports": ["Material Analysis Results", "Handwriting Analysis", "Historical Context Review", "Comparative Analysis", "Expert Consultations", "Dating Test Results", "Provenance Research", "Conservation Assessment", "Authentication Findings", "Research Publication Draft"]}',
        '{"type": "regulatory", "title": "Healthcare Compliance Investigation", "description": "Comprehensive review of Memorial Hospital compliance with updated healthcare regulations", "reports": ["Policy Review Summary", "Staff Interview Findings", "Documentation Audit", "Training Program Assessment", "Incident Report Analysis", "Compliance Gap Analysis", "Risk Management Review", "Implementation Plan", "Remediation Strategy", "Final Compliance Report"]}',
        '{"type": "background", "title": "Executive Background Investigation", "description": "Comprehensive background check for incoming CEO position at Fortune 500 company", "reports": ["Education Verification", "Employment History", "Criminal Record Check", "Financial Background", "Media Coverage Analysis", "Reference Interviews", "Professional License Verification", "Social Media Analysis", "Conflict Check", "Final Background Report"]}',
        '{"type": "environmental", "title": "Industrial Site Contamination Investigation", "description": "Environmental impact investigation of former chemical plant site", "reports": ["Soil Analysis Results", "Groundwater Testing", "Historical Land Use", "Chemical Composition Study", "Impact Assessment", "Health Risk Analysis", "Remediation Options", "Community Impact Study", "Regulatory Compliance", "Recommendations Report"]}',
        '{"type": "financial", "title": "Investment Fund Forensic Audit", "description": "Forensic investigation into discrepancies in hedge fund returns reporting", "reports": ["Transaction Analysis", "Performance Calculation Review", "Investor Communication Audit", "Documentation Review", "Compliance Assessment", "Risk Exposure Analysis", "Pattern Recognition Study", "Regulatory Review", "Stakeholder Impact", "Investigation Findings"]}',
        '{"type": "security", "title": "Data Breach Investigation", "description": "Investigation of major data breach at TechCorp Solutions", "reports": ["Initial Breach Assessment", "Attack Vector Analysis", "System Vulnerability Review", "Data Impact Analysis", "Timeline Construction", "Security Control Review", "Forensic Evidence Report", "Remediation Planning", "Incident Response Review", "Final Security Report"]}',
        '{"type": "historical", "title": "Cold Case Re-Investigation", "description": "Re-examination of the 1985 ArtTech Gallery Heist", "reports": ["Evidence Re-Analysis", "Witness Re-Interviews", "New Lead Assessment", "Technology Application", "Pattern Analysis", "Timeline Reconstruction", "Suspect Profile Updates", "Modern Forensics Application", "New Evidence Summary", "Investigation Update"]}',
        '{"type": "medical", "title": "Clinical Trial Protocol Investigation", "description": "Investigation into protocol adherence in Phase III drug trial", "reports": ["Protocol Compliance Review", "Data Collection Audit", "Patient Record Analysis", "Staff Interview Summary", "Documentation Review", "Statistical Analysis", "Adverse Event Review", "Quality Control Assessment", "Regulatory Compliance", "Investigation Findings"]}']::jsonb[];
BEGIN
    -- Create investigations with specific types and realistic content
    FOR i IN 1..array_length(investigation_cases, 1) LOOP
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
            investigation_cases[i]->>'title',
            investigation_cases[i]->>'description',
            '02ecf5ce-3663-4897-9b9f-c084dac6b3da',
            'private',
            investigation_cases[i]->>'type'
        ) RETURNING id INTO new_investigation_id;

        -- Create reports for each investigation
        FOR j IN 1..10 LOOP
            INSERT INTO public.reports (
                investigation_id,
                title,
                content
            ) VALUES (
                new_investigation_id,
                investigation_cases[i]->'reports'->>(j-1),
                'Detailed content for ' || (investigation_cases[i]->'reports'->>(j-1)) || ' in the context of ' || (investigation_cases[i]->>'title')
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
                    CASE node_type
                        WHEN 'node_person' THEN 'Key Person: ' || (SELECT array_to_string(ARRAY(SELECT chr((65 + round(random() * 25))::integer) FROM generate_series(1,8)), ''))
                        WHEN 'node_organization' THEN 'Organization: ' || (SELECT array_to_string(ARRAY(SELECT chr((65 + round(random() * 25))::integer) FROM generate_series(1,6)), '')) || ' Corp'
                        WHEN 'node_object' THEN 'Evidence Item: ' || (SELECT array_to_string(ARRAY(SELECT chr((65 + round(random() * 25))::integer) FROM generate_series(1,5)), ''))
                        WHEN 'node_concept' THEN 'Key Finding: ' || (SELECT array_to_string(ARRAY(SELECT chr((65 + round(random() * 25))::integer) FROM generate_series(1,7)), ''))
                        WHEN 'node_location' THEN 'Location: ' || (SELECT array_to_string(ARRAY(SELECT chr((65 + round(random() * 25))::integer) FROM generate_series(1,6)), ''))
                        ELSE 'Event: ' || (SELECT array_to_string(ARRAY(SELECT chr((65 + round(random() * 25))::integer) FROM generate_series(1,4)), ''))
                    END,
                    'Relevant ' || node_type || ' in the context of ' || (investigation_cases[i]->>'title'),
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