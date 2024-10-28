-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Load subscription plans
INSERT INTO public.subscription_plans (id, name, price, description)
VALUES 
  (uuid_generate_v4(), 'Free', 0, 'Basic access to investigation tools'),
  (uuid_generate_v4(), 'Pro', 9.99, 'Advanced features and unlimited investigations'),
  (uuid_generate_v4(), 'Team', 29.99, 'Team collaboration and advanced analytics');

-- Insert admin user and store ID
DO $$
DECLARE
    admin_id UUID;
    admin_investigation_id UUID;
BEGIN
    -- Insert admin user
    INSERT INTO public.profiles (id, username, email, avatar_url) 
    VALUES (
      uuid_generate_v4(),
      'admin',
      'admin@sifter.news',
      '/default-image.png'
    )
    RETURNING id INTO admin_id;

    -- Create admin's sample investigation
    INSERT INTO public.investigations (id, title, description, owner_id, visibility, view_type, investigation_type, investigation_focus)
    VALUES (
      uuid_generate_v4(),
      'Platform Security Audit',
      'Internal security audit and compliance investigation of Sifter platform',
      admin_id,
      'private',
      'mind',
      'internal-audit',
      'node_organization'
    )
    RETURNING id INTO admin_investigation_id;

    -- Insert nodes for admin's investigation
    INSERT INTO public.node (id, title, description, owner_id, investigation_id, node_type, position_x, position_y, metadata)
    VALUES
      -- Main platform
      (uuid_generate_v4(), 'Sifter Platform', 'Core platform infrastructure and systems', admin_id, admin_investigation_id, 'node_organization', 0, 0, 
       '{"deploymentDate": "2024-01-01", "userCount": "1000+", "version": "2.0.1"}'::jsonb),
      -- Security Systems
      (uuid_generate_v4(), 'Authentication System', 'User authentication and authorization services', admin_id, admin_investigation_id, 'node_object', -200, -150,
       '{"provider": "Supabase Auth", "mfaEnabled": "true", "lastAudit": "2024-03-15"}'::jsonb),
      -- Key Personnel
      (uuid_generate_v4(), 'Security Team Lead', 'Head of Platform Security', admin_id, admin_investigation_id, 'node_person', 200, -150,
       '{"role": "Security Lead", "clearance": "Level 3", "certifications": "CISSP, CEH"}'::jsonb),
      -- Compliance Documents
      (uuid_generate_v4(), 'GDPR Compliance', 'Data protection and privacy compliance', admin_id, admin_investigation_id, 'node_object', -150, 100,
       '{"status": "Compliant", "lastReview": "2024-02-01", "nextReview": "2024-08-01"}'::jsonb),
      -- Security Events
      (uuid_generate_v4(), 'Q1 Security Review', 'Quarterly security assessment and penetration testing', admin_id, admin_investigation_id, 'node_event', 150, 100,
       '{"date": "2024-03-30", "findings": "2 low, 0 critical", "status": "Resolved"}'::jsonb);

    -- Insert reports for admin's investigation
    INSERT INTO public.reports (id, investigation_id, title, content)
    VALUES
      (uuid_generate_v4(), admin_investigation_id, 'Q1 2024 Security Report', 'Comprehensive security analysis of platform infrastructure...'),
      (uuid_generate_v4(), admin_investigation_id, 'GDPR Compliance Status', 'Current status of GDPR compliance measures and documentation...'),
      (uuid_generate_v4(), admin_investigation_id, 'Penetration Test Results', 'Results and remediation steps from latest penetration testing...');
END $$;

-- Insert sample users with investigator roles
INSERT INTO public.profiles (id, username, email, avatar_url) 
VALUES
  (uuid_generate_v4(), 'sarah_investigator', 'sarah@ddteam.com', '/default-image.png'),
  (uuid_generate_v4(), 'mike_analyst', 'mike@ddteam.com', '/default-image.png'),
  (uuid_generate_v4(), 'lisa_compliance', 'lisa@ddteam.com', '/default-image.png');

-- Create variables for user IDs
DO $$
DECLARE
    sarah_id UUID;
    mike_id UUID;
    lisa_id UUID;
    tech_company_inv UUID;
    real_estate_inv UUID;
BEGIN
    -- Get user IDs
    SELECT id INTO sarah_id FROM public.profiles WHERE username = 'sarah_investigator';
    SELECT id INTO mike_id FROM public.profiles WHERE username = 'mike_analyst';
    SELECT id INTO lisa_id FROM public.profiles WHERE username = 'lisa_compliance';

    -- Insert sample investigations
    INSERT INTO public.investigations (id, title, description, owner_id, visibility, view_type, investigation_type, investigation_focus)
    VALUES 
      -- Tech Company Due Diligence
      (
        uuid_generate_v4(),
        'TechCorp Acquisition DD',
        'Pre-deal due diligence investigation for potential acquisition of TechCorp Inc.',
        sarah_id,
        'private',
        'mind',
        'pre-deal',
        'node_organization'
      )
    RETURNING id INTO tech_company_inv;

    -- Real Estate Investment DD
    INSERT INTO public.investigations (id, title, description, owner_id, visibility, view_type, investigation_type, investigation_focus)
    VALUES (
      uuid_generate_v4(),
      'Manhattan Property Investment DD',
      'Due diligence investigation for commercial real estate investment in Manhattan',
      mike_id,
      'private',
      'mind',
      'pre-deal',
      'node_organization'
    )
    RETURNING id INTO real_estate_inv;

    -- Insert nodes for Tech Company DD
    INSERT INTO public.node (id, title, description, owner_id, investigation_id, node_type, position_x, position_y, metadata)
    VALUES
      -- Main company
      (uuid_generate_v4(), 'TechCorp Inc.', 'Target company for acquisition', sarah_id, tech_company_inv, 'node_organization', 0, 0, 
       '{"foundedDate": "2010-03-15", "revenue": "$50M", "employees": "250"}'::jsonb),
      -- Key People
      (uuid_generate_v4(), 'John Smith', 'CEO of TechCorp', sarah_id, tech_company_inv, 'node_person', -200, -150,
       '{"role": "CEO", "age": "45", "tenure": "8 years"}'::jsonb),
      (uuid_generate_v4(), 'Alice Johnson', 'CTO of TechCorp', sarah_id, tech_company_inv, 'node_person', 200, -150,
       '{"role": "CTO", "age": "38", "expertise": "AI/ML"}'::jsonb),
      -- Assets
      (uuid_generate_v4(), 'AI Patent Portfolio', 'Key intellectual property assets', sarah_id, tech_company_inv, 'node_object', -150, 100,
       '{"patentCount": "15", "filingDates": "2018-2023"}'::jsonb),
      -- Events
      (uuid_generate_v4(), 'Series C Funding', '$30M funding round', sarah_id, tech_company_inv, 'node_event', 150, 100,
       '{"date": "2022-06-15", "leadInvestor": "Tech Ventures"}'::jsonb);

    -- Insert nodes for Real Estate DD
    INSERT INTO public.node (id, title, description, owner_id, investigation_id, node_type, position_x, position_y, metadata)
    VALUES
      -- Main property
      (uuid_generate_v4(), '123 Manhattan Tower', '30-story commercial building', mike_id, real_estate_inv, 'node_location', 0, 0,
       '{"address": "123 Wall St", "sqft": "250000", "yearBuilt": "1985"}'::jsonb),
      -- Current Owner
      (uuid_generate_v4(), 'Manhattan Properties LLC', 'Current property owner', mike_id, real_estate_inv, 'node_organization', -200, -150,
       '{"type": "LLC", "registered": "2015", "ownership": "100%"}'::jsonb),
      -- Key Tenants
      (uuid_generate_v4(), 'Global Finance Corp', 'Major tenant (15 floors)', mike_id, real_estate_inv, 'node_organization', 200, -150,
       '{"leaseEnd": "2025", "annualRent": "$12M"}'::jsonb),
      -- Property Manager
      (uuid_generate_v4(), 'Robert Wilson', 'Property Manager', mike_id, real_estate_inv, 'node_person', -150, 100,
       '{"role": "Property Manager", "experience": "15 years"}'::jsonb),
      -- Renovation Event
      (uuid_generate_v4(), 'Major Renovation', 'Complete building renovation', mike_id, real_estate_inv, 'node_event', 150, 100,
       '{"date": "2019", "cost": "$25M", "scope": "Full modernization"}'::jsonb);

    -- Insert sample reports
    INSERT INTO public.reports (id, investigation_id, title, content)
    VALUES
      -- Tech Company DD Reports
      (uuid_generate_v4(), tech_company_inv, 'Initial Financial Analysis', 'Detailed analysis of TechCorp''s financial statements shows strong growth...'),
      (uuid_generate_v4(), tech_company_inv, 'IP Portfolio Review', 'Review of 15 patents in AI/ML space indicates strong technological position...'),
      (uuid_generate_v4(), tech_company_inv, 'Management Team Assessment', 'Leadership team assessment reveals experienced executives...'),
      -- Real Estate DD Reports
      (uuid_generate_v4(), real_estate_inv, 'Property Condition Report', 'Building inspection reveals excellent maintenance status...'),
      (uuid_generate_v4(), real_estate_inv, 'Tenant Analysis', 'Analysis of current tenants shows stable, long-term leases...'),
      (uuid_generate_v4(), real_estate_inv, 'Market Analysis', 'Manhattan commercial real estate market analysis indicates strong growth potential...');
END $$;