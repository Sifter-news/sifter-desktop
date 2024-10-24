-- Create 6 investigations per user with due diligence focus
WITH user_ids AS (SELECT id FROM public.profiles)
INSERT INTO public.investigations (id, title, description, owner_id, visibility, view_type)
SELECT 
  uuid_generate_v4(),
  CASE (i % 6)
    WHEN 0 THEN 'Financial Due Diligence - ' || u.id
    WHEN 1 THEN 'Legal Compliance Review - ' || u.id
    WHEN 2 THEN 'Market Competition Analysis - ' || u.id
    WHEN 3 THEN 'Technical Infrastructure Assessment - ' || u.id
    WHEN 4 THEN 'Environmental Impact Study - ' || u.id
    WHEN 5 THEN 'Human Resources Due Diligence - ' || u.id
  END,
  CASE (i % 6)
    WHEN 0 THEN 'Comprehensive financial analysis including cash flow, revenue models, and financial projections'
    WHEN 1 THEN 'Review of legal structure, contracts, and regulatory compliance status'
    WHEN 2 THEN 'Analysis of market position, competitive landscape, and growth potential'
    WHEN 3 THEN 'Assessment of technical infrastructure, scalability, and security measures'
    WHEN 4 THEN 'Evaluation of environmental impact and sustainability practices'
    WHEN 5 THEN 'Review of HR policies, team composition, and organizational culture'
  END,
  u.id,
  CASE (i % 3) 
    WHEN 0 THEN 'private'
    WHEN 1 THEN 'public'
    ELSE 'organization'
  END,
  CASE (i % 4)
    WHEN 0 THEN 'mind'
    WHEN 1 THEN 'timeline'
    WHEN 2 THEN 'map'
    ELSE 'text'
  END
FROM user_ids u
CROSS JOIN generate_series(1, 6) i;