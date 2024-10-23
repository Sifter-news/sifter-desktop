-- Seed sample projects and nodes
DO $$
DECLARE
  owner_id UUID;
BEGIN
  -- Get the first user from profiles as owner
  SELECT id INTO owner_id FROM public.profiles LIMIT 1;

  -- 1. Pre-deal Due Diligence Project
  INSERT INTO public.project (id, title, description, owner_id, visibility)
  VALUES (
    uuid_generate_v4(),
    'Tech Startup Acquisition Due Diligence',
    'Investigation into potential acquisition of AI startup TechCorp',
    owner_id,
    'private'
  );

  -- Add nodes for due diligence project
  WITH project_id AS (
    SELECT id FROM public.project WHERE title = 'Tech Startup Acquisition Due Diligence' LIMIT 1
  )
  INSERT INTO public.node (id, title, description, type, owner_id, project_id, x, y)
  VALUES
    (uuid_generate_v4(), 'Financial Analysis', 'Review of company financials 2021-2023', 'basic', owner_id, (SELECT id FROM project_id), 100, 100),
    (uuid_generate_v4(), 'TechCorp Inc.', 'Target company profile and history', 'organization', owner_id, (SELECT id FROM project_id), 300, 100),
    (uuid_generate_v4(), 'IP Portfolio', 'Analysis of patents and trademarks', 'object', owner_id, (SELECT id FROM project_id), 500, 100);

  -- 2. WW2 Research Project
  INSERT INTO public.project (id, title, description, owner_id, visibility)
  VALUES (
    uuid_generate_v4(),
    'World War II Pacific Theater Research',
    'Historical investigation of key Pacific Theater battles',
    owner_id,
    'public'
  );

  -- Add nodes for WW2 project
  WITH project_id AS (
    SELECT id FROM public.project WHERE title = 'World War II Pacific Theater Research' LIMIT 1
  )
  INSERT INTO public.node (id, title, description, type, owner_id, project_id, x, y)
  VALUES
    (uuid_generate_v4(), 'Battle of Midway', 'June 4-7, 1942: Turning point in the Pacific War', 'event', owner_id, (SELECT id FROM project_id), 100, 200),
    (uuid_generate_v4(), 'Admiral Nimitz', 'Commander of the Pacific Fleet', 'person', owner_id, (SELECT id FROM project_id), 300, 200),
    (uuid_generate_v4(), 'Pearl Harbor', 'December 7, 1941: Attack location', 'location', owner_id, (SELECT id FROM project_id), 500, 200);

  -- 3. Murder Investigation Project
  INSERT INTO public.project (id, title, description, owner_id, visibility)
  VALUES (
    uuid_generate_v4(),
    'Cold Case: Thompson Murder 1985',
    'Re-investigation of unsolved murder case from 1985',
    owner_id,
    'private'
  );

  -- Add nodes for murder investigation
  WITH project_id AS (
    SELECT id FROM public.project WHERE title = 'Cold Case: Thompson Murder 1985' LIMIT 1
  )
  INSERT INTO public.node (id, title, description, type, owner_id, project_id, x, y)
  VALUES
    (uuid_generate_v4(), 'Crime Scene', 'Downtown apartment, 123 Main St', 'location', owner_id, (SELECT id FROM project_id), 100, 300),
    (uuid_generate_v4(), 'Victim: John Thompson', 'Details about the victim', 'person', owner_id, (SELECT id FROM project_id), 300, 300),
    (uuid_generate_v4(), 'Murder Weapon', 'Kitchen knife found at scene', 'object', owner_id, (SELECT id FROM project_id), 500, 300);

  -- 4. Environmental Impact Study
  INSERT INTO public.project (id, title, description, owner_id, visibility)
  VALUES (
    uuid_generate_v4(),
    'River Valley Pollution Investigation',
    'Study of industrial pollution impact on local ecosystem',
    owner_id,
    'public'
  );

  -- Add nodes for environmental study
  WITH project_id AS (
    SELECT id FROM public.project WHERE title = 'River Valley Pollution Investigation' LIMIT 1
  )
  INSERT INTO public.node (id, title, description, type, owner_id, project_id, x, y)
  VALUES
    (uuid_generate_v4(), 'Chemical Analysis', 'Water quality test results 2023', 'basic', owner_id, (SELECT id FROM project_id), 100, 400),
    (uuid_generate_v4(), 'Factory XYZ', 'Main pollution source identified', 'organization', owner_id, (SELECT id FROM project_id), 300, 400),
    (uuid_generate_v4(), 'River Delta', 'Most affected geographical area', 'location', owner_id, (SELECT id FROM project_id), 500, 400);

  -- 5. Political Corruption Investigation
  INSERT INTO public.project (id, title, description, owner_id, visibility)
  VALUES (
    uuid_generate_v4(),
    'City Hall Corruption Probe',
    'Investigation into alleged misuse of public funds',
    owner_id,
    'private'
  );

  -- Add nodes for corruption investigation
  WITH project_id AS (
    SELECT id FROM public.project WHERE title = 'City Hall Corruption Probe' LIMIT 1
  )
  INSERT INTO public.node (id, title, description, type, owner_id, project_id, x, y)
  VALUES
    (uuid_generate_v4(), 'Mayor Johnson', 'Key person of interest', 'person', owner_id, (SELECT id FROM project_id), 100, 500),
    (uuid_generate_v4(), 'Construction Contracts', 'Suspicious bid awards 2022-2023', 'object', owner_id, (SELECT id FROM project_id), 300, 500),
    (uuid_generate_v4(), 'City Treasury', 'Financial records analysis', 'basic', owner_id, (SELECT id FROM project_id), 500, 500);

END $$;