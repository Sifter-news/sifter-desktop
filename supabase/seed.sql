-- Insert sample investigations and reports
INSERT INTO public.investigation (id, title, description, owner_id)
VALUES (uuid_generate_v4(), 'Investigation 1', 'Description for investigation 1', 'UUID_OF_OWNER');

INSERT INTO public.report (id, title, description, investigation_id)
VALUES (uuid_generate_v4(), 'Report 1', 'Description for report 1', 'UUID_OF_INVESTIGATION');