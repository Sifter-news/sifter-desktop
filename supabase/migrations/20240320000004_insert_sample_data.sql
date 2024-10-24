-- Insert some sample data into the profiles and nodes
INSERT INTO public.profiles (id, username, email) 
VALUES 
  (uuid_generate_v4(), 'JohnDoe', 'johndoe@example.com'),
  (uuid_generate_v4(), 'JaneDoe', 'janedoe@example.com');

-- Get the ID of JohnDoe for reference
WITH profile_id AS (
  SELECT id FROM public.profiles WHERE username = 'JohnDoe' LIMIT 1
)
INSERT INTO public.node (id, title, description, type, owner_id)
SELECT 
  uuid_generate_v4(),
  'Node 1',
  'Description of node 1',
  'type1',
  id
FROM profile_id;