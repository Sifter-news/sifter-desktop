-- Create detailed reports for each investigation type
WITH investigation_ids AS (SELECT id, title FROM public.investigations)
INSERT INTO public.reports (id, investigation_id, title, content)
SELECT 
  uuid_generate_v4(),
  inv.id,
  CASE 
    WHEN inv.title LIKE 'Financial Due Diligence%' THEN
      CASE r % 10
        WHEN 0 THEN 'Financial Statement Analysis 2021-2023'
        WHEN 1 THEN 'IP Portfolio Valuation Report'
        WHEN 2 THEN 'Market Competition Analysis'
        WHEN 3 THEN 'Customer Churn Analysis'
        WHEN 4 THEN 'Tech Stack Assessment'
        WHEN 5 THEN 'Revenue Projection 2024-2026'
        WHEN 6 THEN 'Key Personnel Assessment'
        WHEN 7 THEN 'Outstanding Legal Issues'
        WHEN 8 THEN 'Operational Cost Analysis'
        WHEN 9 THEN 'Growth Strategy Review'
      END
    WHEN inv.title LIKE 'Criminal Investigation%' THEN
      CASE r % 10
        WHEN 0 THEN 'Surveillance Camera Footage Analysis'
        WHEN 1 THEN 'Witness Statement Compilation'
        WHEN 2 THEN 'Physical Evidence Report'
        WHEN 3 THEN 'Suspect Profile Analysis'
        WHEN 4 THEN 'Crime Scene Documentation'
        WHEN 5 THEN 'Digital Evidence Analysis'
        WHEN 6 THEN 'Pattern Analysis Report'
        WHEN 7 THEN 'Vehicle Description Report'
        WHEN 8 THEN 'CCTV Timeline Analysis'
        WHEN 9 THEN 'Forensic Evidence Summary'
      END
    WHEN inv.title LIKE 'Historical%' THEN
      CASE r % 10
        WHEN 0 THEN 'Archaeological Survey Results'
        WHEN 1 THEN 'Carbon Dating Analysis'
        WHEN 2 THEN 'Artifact Catalog'
        WHEN 3 THEN 'Historical Document Analysis'
        WHEN 4 THEN 'Site Mapping Report'
        WHEN 5 THEN 'Preservation Assessment'
        WHEN 6 THEN 'Contemporary Accounts Analysis'
        WHEN 7 THEN 'Material Analysis Results'
        WHEN 8 THEN 'Photographic Documentation'
        WHEN 9 THEN 'Expert Consultation Summary'
      END
    ELSE
      'General Investigation Report ' || r
  END,
  'Detailed findings and analysis for ' || inv.title || ' - Report ' || r
FROM investigation_ids inv
CROSS JOIN generate_series(1, 10) r;