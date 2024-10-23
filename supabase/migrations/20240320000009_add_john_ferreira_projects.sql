-- Insert John Ferreira's demo projects
DO $$
DECLARE
  user_id UUID;
BEGIN
  -- Get John Ferreira's user ID (will be created by the auth system)
  SELECT id INTO user_id FROM auth.users WHERE email = 'john.ferreira@example.com' LIMIT 1;

  -- Only proceed if we found the user
  IF user_id IS NOT NULL THEN
    -- Insert the demo projects
    INSERT INTO public.project (title, description, owner_id, visibility)
    VALUES 
      ('Human Survival Needs', 'An investigation into the essential elements required for human survival, including physiological needs, safety, and psychological well-being.', user_id, 'public'),
      ('Startup Investment Due Diligence', 'A comprehensive investigation into the key aspects of evaluating a potential startup investment, covering financial, legal, and market analysis.', user_id, 'public'),
      ('Climate Change', 'Climate change is a long-term shift in global or regional climate patterns. Often climate change refers specifically to the rise in global temperatures from the mid-20th century to present.', user_id, 'public'),
      ('Artificial Intelligence', 'Artificial Intelligence (AI) is the simulation of human intelligence processes by machines, especially computer systems. These processes include learning, reasoning, and self-correction.', user_id, 'public'),
      ('Cold Case Investigation', 'A detailed investigation into unsolved cases, analyzing evidence, testimonies, and new leads.', user_id, 'public');
  END IF;
END $$;