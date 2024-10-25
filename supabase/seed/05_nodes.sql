-- Create nodes with realistic investigation data points
WITH investigation_ids AS (SELECT id FROM public.investigations)
INSERT INTO public.node (id, title, description, type, owner_id, investigation_id)
SELECT 
  uuid_generate_v4(),
  CASE (n % 12)
    WHEN 0 THEN 'Key Witness Statement'
    WHEN 1 THEN 'Financial Document'
    WHEN 2 THEN 'Physical Evidence'
    WHEN 3 THEN 'Location Data'
    WHEN 4 THEN 'Timeline Event'
    WHEN 5 THEN 'Historical Record'
    WHEN 6 THEN 'Interview Transcript'
    WHEN 7 THEN 'Analysis Result'
    WHEN 8 THEN 'Digital Evidence'
    WHEN 9 THEN 'Expert Opinion'
    WHEN 10 THEN 'Document Reference'
    WHEN 11 THEN 'Connection Point'
  END || ' ' || n,
  CASE (n % 12)
    WHEN 0 THEN 'Statement from witness regarding observed activities on the specified date'
    WHEN 1 THEN 'Financial records showing transaction patterns and anomalies'
    WHEN 2 THEN 'Physical evidence collected from the scene with chain of custody'
    WHEN 3 THEN 'GPS coordinates and location significance details'
    WHEN 4 THEN 'Significant event in the investigation timeline'
    WHEN 5 THEN 'Historical document or record relevant to the investigation'
    WHEN 6 THEN 'Transcript from interview with person of interest'
    WHEN 7 THEN 'Results from analysis of collected evidence'
    WHEN 8 THEN 'Digital evidence including metadata and source'
    WHEN 9 THEN 'Expert analysis and professional opinion'
    WHEN 10 THEN 'Reference to important documentation'
    WHEN 11 THEN 'Connection point between multiple pieces of evidence'
  END,
  CASE (n % 4)
    WHEN 0 THEN 'evidence'
    WHEN 1 THEN 'witness'
    WHEN 2 THEN 'document'
    WHEN 3 THEN 'location'
  END,
  (SELECT id FROM public.profiles ORDER BY random() LIMIT 1),
  inv.id
FROM investigation_ids inv
CROSS JOIN generate_series(1, 20) n;