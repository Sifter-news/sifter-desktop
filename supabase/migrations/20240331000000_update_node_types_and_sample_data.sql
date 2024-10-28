-- Update node table structure
ALTER TABLE public.node
  DROP COLUMN IF EXISTS type,
  DROP COLUMN IF EXISTS visual_style,
  DROP COLUMN IF EXISTS node_type;

ALTER TABLE public.node
  ADD COLUMN type_visual VARCHAR(20) CHECK (type_visual IN ('default', 'compact', 'postit')) DEFAULT 'default',
  ADD COLUMN type_data VARCHAR(50) CHECK (type_data IN (
    'node_concept',
    'node_event',
    'node_location',
    'node_object',
    'node_organization',
    'node_person'
  )) DEFAULT 'node_concept';

-- Add realistic due diligence sample data
INSERT INTO public.investigations (id, title, description, investigation_type, investigation_focus, visibility)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Tech Corp Acquisition Due Diligence', 'Pre-acquisition investigation of Tech Corp including financial, legal, and operational analysis', 'pre-deal', 'node_organization', 'private'),
  ('22222222-2222-2222-2222-222222222222', 'Green Energy Compliance Review', 'Regulatory compliance investigation for renewable energy subsidiary', 'regulatory', 'node_organization', 'private');

-- Sample nodes for Tech Corp investigation
INSERT INTO public.node (id, investigation_id, title, description, type_visual, type_data, position_x, position_y, metadata)
VALUES
  -- Key People
  ('a1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'John Smith', 'CEO of Tech Corp since 2018', 'default', 'node_person', 100, 100, '{"role": "CEO", "tenure": "5 years", "age": "45"}'),
  ('a2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Tech Corp HQ', 'Main headquarters - Silicon Valley', 'compact', 'node_location', 300, 100, '{"address": "123 Tech Ave, CA", "employees": "500"}'),
  
  -- Financial Events
  ('a3333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Series C Funding', '$50M funding round in 2022', 'postit', 'node_event', 500, 100, '{"date": "2022-06-15", "amount": "50000000"}'),
  
  -- Key Assets
  ('a4444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'AI Platform Patent', 'Core technology patent', 'default', 'node_object', 700, 100, '{"patent_number": "US123456", "filed_date": "2021-03-10"}'),

  -- Organizational Structure
  ('a5555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', 'R&D Division', 'Research and Development Unit', 'compact', 'node_organization', 900, 100, '{"employees": "150", "budget": "10000000"}');

-- Sample reports for Tech Corp investigation
INSERT INTO public.reports (id, investigation_id, title, content)
VALUES
  ('r1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Initial Financial Assessment', 'Financial analysis reveals strong revenue growth (45% YoY) with healthy margins. Key concerns include high R&D costs and customer concentration risk with top 3 customers representing 40% of revenue.'),
  ('r2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'IP Portfolio Review', 'Company holds 12 granted patents and 8 pending applications. Core AI technology is well-protected, but there are potential risks in the computer vision segment where competitors hold strong positions.'),
  ('r3333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Management Team Assessment', 'Leadership team demonstrates strong technical expertise and industry experience. Identified succession planning gaps for CTO position. Employee retention rates above industry average at 92%.');

-- Sample nodes for Green Energy investigation
INSERT INTO public.node (id, investigation_id, title, description, type_visual, type_data, position_x, position_y, metadata)
VALUES
  -- Compliance Documentation
  ('b1111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'EPA Permits', 'Environmental Protection Agency Permits', 'default', 'node_object', 100, 300, '{"expiry_date": "2024-12-31", "status": "active"}'),
  
  -- Key Locations
  ('b2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'Solar Farm Alpha', 'Primary solar installation site', 'compact', 'node_location', 300, 300, '{"capacity": "50MW", "area": "500 acres"}'),
  
  -- Critical Events
  ('b3333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'Annual Audit 2023', 'Regulatory compliance audit', 'postit', 'node_event', 500, 300, '{"date": "2023-11-15", "status": "passed"}');

-- Sample reports for Green Energy investigation
INSERT INTO public.reports (id, investigation_id, title, content)
VALUES
  ('r4444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 'Environmental Impact Assessment', 'All sites maintain compliance with EPA guidelines. Carbon offset calculations verified and documented. Minor recommendations for improved wildlife protection measures at Site Alpha.'),
  ('r5555555-5555-5555-5555-555555555555', '22222222-2222-2222-2222-222222222222', 'Regulatory Compliance Summary', 'Current compliance rate: 98%. Two minor violations identified and remediated. New state regulations expected in Q3 2024 will require additional monitoring equipment.');