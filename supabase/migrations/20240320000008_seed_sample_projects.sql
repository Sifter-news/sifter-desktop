-- Seed sample projects and nodes
DO $$
DECLARE
  owner_id UUID;
BEGIN
  -- Get the admin user from profiles
  SELECT id INTO owner_id FROM auth.users WHERE email = 'sifter-admin' LIMIT 1;

  -- Pre-deal Due Diligence Projects
  INSERT INTO public.project (id, title, description, owner_id, visibility)
  VALUES 
    (uuid_generate_v4(), 'Tech Startup Acquisition DD', 'Comprehensive due diligence for potential acquisition of AI startup TechVision Inc.', owner_id, 'private'),
    (uuid_generate_v4(), 'Healthcare Provider Merger', 'Pre-deal investigation of MedCare Solutions merger opportunity', owner_id, 'private'),
    (uuid_generate_v4(), 'Real Estate Portfolio Analysis', 'Due diligence on commercial real estate portfolio acquisition', owner_id, 'private'),
    (uuid_generate_v4(), 'Manufacturing Plant Acquisition', 'Investigation of industrial manufacturing facility purchase', owner_id, 'private'),
    (uuid_generate_v4(), 'SaaS Company Valuation', 'Pre-investment analysis of CloudTech Solutions', owner_id, 'private');

  -- Add detailed nodes for Tech Startup Acquisition
  WITH project_id AS (
    SELECT id FROM public.project WHERE title = 'Tech Startup Acquisition DD' LIMIT 1
  )
  INSERT INTO public.node (id, title, description, type, owner_id, project_id, x, y)
  VALUES
    (uuid_generate_v4(), 'Financial Analysis', 'Revenue: $5.2M (2023), Growth: 156% YoY, Burn rate: $250K/month', 'basic', owner_id, (SELECT id FROM project_id), 100, 100),
    (uuid_generate_v4(), 'IP Portfolio', '12 pending patents, 3 granted patents in AI/ML', 'object', owner_id, (SELECT id FROM project_id), 300, 100),
    (uuid_generate_v4(), 'Team Assessment', 'Technical team: 28 engineers (15 PhD), Leadership: Ex-Google/Meta', 'basic', owner_id, (SELECT id FROM project_id), 500, 100),
    (uuid_generate_v4(), 'Market Analysis', 'TAM: $50B, Current market share: 2.3%, Growth potential: High', 'basic', owner_id, (SELECT id FROM project_id), 100, 300),
    (uuid_generate_v4(), 'Customer Contracts', '3 enterprise clients (Fortune 500), 128 SMB customers', 'object', owner_id, (SELECT id FROM project_id), 300, 300),
    (uuid_generate_v4(), 'Tech Stack Review', 'Modern architecture, Scalable infrastructure, Technical debt: Low', 'basic', owner_id, (SELECT id FROM project_id), 500, 300);

END $$;