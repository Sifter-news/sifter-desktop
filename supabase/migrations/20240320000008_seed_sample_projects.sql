DO $$ 
DECLARE
  owner_id UUID;
BEGIN
  -- Get the admin user from profiles
  SELECT id INTO owner_id FROM auth.users WHERE email = 'admin@sifter.news' LIMIT 1;

  -- Insert sample projects
  INSERT INTO projects (id, title, description, owner_id, created_at)
  VALUES 
    (uuid_generate_v4(), 'Project Alpha', 'Description for Project Alpha', owner_id, NOW()),
    (uuid_generate_v4(), 'Project Beta', 'Description for Project Beta', owner_id, NOW());

  -- Insert sample nodes for Project Alpha
  INSERT INTO nodes (id, project_id, title, content, created_at)
  VALUES 
    (uuid_generate_v4(), (SELECT id FROM projects WHERE title = 'Project Alpha'), 'Node 1', 'Content for Node 1', NOW()),
    (uuid_generate_v4(), (SELECT id FROM projects WHERE title = 'Project Alpha'), 'Node 2', 'Content for Node 2', NOW());

  -- Insert sample nodes for Project Beta
  INSERT INTO nodes (id, project_id, title, content, created_at)
  VALUES 
    (uuid_generate_v4(), (SELECT id FROM projects WHERE title = 'Project Beta'), 'Node 1', 'Content for Node 1', NOW()),
    (uuid_generate_v4(), (SELECT id FROM projects WHERE title = 'Project Beta'), 'Node 2', 'Content for Node 2', NOW());
END $$;
