-- Create 10 reports per investigation with specific due diligence content
WITH investigation_ids AS (SELECT id, title FROM public.investigations)
INSERT INTO public.reports (id, investigation_id, title, content)
SELECT 
  uuid_generate_v4(),
  inv.id,
  CASE 
    WHEN inv.title LIKE 'Financial%' THEN
      CASE r % 10
        WHEN 0 THEN 'Revenue Analysis'
        WHEN 1 THEN 'Cash Flow Assessment'
        WHEN 2 THEN 'Balance Sheet Review'
        WHEN 3 THEN 'Financial Projections'
        WHEN 4 THEN 'Investment History'
        WHEN 5 THEN 'Risk Assessment'
        WHEN 6 THEN 'Profit Margins Analysis'
        WHEN 7 THEN 'Working Capital Management'
        WHEN 8 THEN 'Debt Structure Review'
        WHEN 9 THEN 'Financial Controls Assessment'
      END
    WHEN inv.title LIKE 'Legal%' THEN
      CASE r % 10
        WHEN 0 THEN 'Corporate Structure'
        WHEN 1 THEN 'Regulatory Compliance'
        WHEN 2 THEN 'Contract Review'
        WHEN 3 THEN 'Intellectual Property'
        WHEN 4 THEN 'Pending Litigation'
        WHEN 5 THEN 'License Status'
        WHEN 6 THEN 'Employment Agreements'
        WHEN 7 THEN 'Data Protection Compliance'
        WHEN 8 THEN 'Corporate Governance'
        WHEN 9 THEN 'Legal Risk Assessment'
      END
    WHEN inv.title LIKE 'Market%' THEN
      CASE r % 10
        WHEN 0 THEN 'Market Size Analysis'
        WHEN 1 THEN 'Competitor Mapping'
        WHEN 2 THEN 'Growth Opportunities'
        WHEN 3 THEN 'Customer Analysis'
        WHEN 4 THEN 'Distribution Channels'
        WHEN 5 THEN 'Market Trends'
        WHEN 6 THEN 'Pricing Strategy'
        WHEN 7 THEN 'Market Entry Barriers'
        WHEN 8 THEN 'Customer Segmentation'
        WHEN 9 THEN 'Brand Position Analysis'
      END
    WHEN inv.title LIKE 'Technical%' THEN
      CASE r % 10
        WHEN 0 THEN 'Architecture Review'
        WHEN 1 THEN 'Security Assessment'
        WHEN 2 THEN 'Scalability Analysis'
        WHEN 3 THEN 'Tech Stack Evaluation'
        WHEN 4 THEN 'Infrastructure Costs'
        WHEN 5 THEN 'Technical Debt'
        WHEN 6 THEN 'Development Processes'
        WHEN 7 THEN 'System Integration'
        WHEN 8 THEN 'Performance Metrics'
        WHEN 9 THEN 'Disaster Recovery'
      END
    WHEN inv.title LIKE 'Environmental%' THEN
      CASE r % 10
        WHEN 0 THEN 'Carbon Footprint'
        WHEN 1 THEN 'Waste Management'
        WHEN 2 THEN 'Energy Efficiency'
        WHEN 3 THEN 'Environmental Compliance'
        WHEN 4 THEN 'Sustainability Initiatives'
        WHEN 5 THEN 'Environmental Risks'
        WHEN 6 THEN 'Water Management'
        WHEN 7 THEN 'Biodiversity Impact'
        WHEN 8 THEN 'Supply Chain Sustainability'
        WHEN 9 THEN 'Climate Change Adaptation'
      END
    ELSE
      CASE r % 10
        WHEN 0 THEN 'Team Structure'
        WHEN 1 THEN 'Compensation Analysis'
        WHEN 2 THEN 'Culture Assessment'
        WHEN 3 THEN 'Policy Review'
        WHEN 4 THEN 'Training Programs'
        WHEN 5 THEN 'Retention Analysis'
        WHEN 6 THEN 'Succession Planning'
        WHEN 7 THEN 'Employee Engagement'
        WHEN 8 THEN 'Performance Management'
        WHEN 9 THEN 'Recruitment Process'
      END
  END,
  'Detailed analysis and findings for ' || inv.title || ' - Report ' || r
FROM investigation_ids inv
CROSS JOIN generate_series(1, 10) r;