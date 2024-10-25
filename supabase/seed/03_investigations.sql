-- Create investigations with realistic scenarios
WITH user_ids AS (SELECT id FROM public.profiles)
INSERT INTO public.investigations (id, title, description, owner_id, visibility, view_type)
SELECT 
  uuid_generate_v4(),
  CASE (i % 9)
    WHEN 0 THEN 'Financial Due Diligence - Tech Startup Acquisition'
    WHEN 1 THEN 'Criminal Investigation - Downtown Robbery Series'
    WHEN 2 THEN 'Historical Research - Civil War Battle Site'
    WHEN 3 THEN 'M&A Due Diligence - Healthcare Merger'
    WHEN 4 THEN 'Cold Case Investigation - 1985 Missing Person'
    WHEN 5 THEN 'Archaeological Investigation - Ancient Trade Route'
    WHEN 6 THEN 'Corporate Fraud Investigation - Accounting Irregularities'
    WHEN 7 THEN 'Environmental Due Diligence - Industrial Site'
    WHEN 8 THEN 'Historical Analysis - Medieval Manuscript Authentication'
  END,
  CASE (i % 9)
    WHEN 0 THEN 'Comprehensive analysis of startup financials, IP portfolio, and market position for potential acquisition'
    WHEN 1 THEN 'Investigation of connected robbery incidents in downtown area between January-March 2024'
    WHEN 2 THEN 'Archaeological and historical analysis of newly discovered Civil War battle site in Virginia'
    WHEN 3 THEN 'Pre-merger analysis of healthcare provider including compliance, assets, and liabilities'
    WHEN 4 THEN 'Re-examination of cold case involving disappearance of local resident Sarah Johnson'
    WHEN 5 THEN 'Study of ancient trade routes through satellite imagery and archaeological findings'
    WHEN 6 THEN 'Investigation into suspected financial statement manipulation and insider trading'
    WHEN 7 THEN 'Environmental impact assessment and contamination analysis of former industrial site'
    WHEN 8 THEN 'Authentication and provenance research of recently discovered medieval manuscript'
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
CROSS JOIN generate_series(1, 9) i;