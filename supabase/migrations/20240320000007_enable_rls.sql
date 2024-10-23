-- Add RLS policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.node ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_access ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Project policies
CREATE POLICY "Users can view their own projects"
  ON public.project FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert their own projects"
  ON public.project FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own projects"
  ON public.project FOR UPDATE
  USING (auth.uid() = owner_id);

-- Node policies
CREATE POLICY "Users can view nodes of their projects"
  ON public.node FOR SELECT
  USING (
    auth.uid() = owner_id OR
    project_id IN (
      SELECT project_id FROM public.project_access
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert nodes in their projects"
  ON public.node FOR INSERT
  WITH CHECK (
    auth.uid() = owner_id AND
    project_id IN (
      SELECT id FROM public.project
      WHERE owner_id = auth.uid()
    )
  );