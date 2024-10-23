-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_project ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_project_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.node ENABLE ROW LEVEL SECURITY;

-- User Profiles policies
CREATE POLICY "Users can view their own profile"
    ON public.user_profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.user_profiles FOR UPDATE
    USING (auth.uid() = id);

-- Project policies
CREATE POLICY "Users can view their own projects"
    ON public.user_project FOR SELECT
    USING (auth.uid() = owner_id OR visibility = 'public');

CREATE POLICY "Users can insert their own projects"
    ON public.user_project FOR INSERT
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own projects"
    ON public.user_project FOR UPDATE
    USING (auth.uid() = owner_id);

-- Node policies
CREATE POLICY "Users can view nodes of their projects"
    ON public.node FOR SELECT
    USING (
        auth.uid() = owner_id OR
        project_id IN (
            SELECT id FROM public.user_project
            WHERE owner_id = auth.uid() OR visibility = 'public'
        )
    );

CREATE POLICY "Users can insert nodes in their projects"
    ON public.node FOR INSERT
    WITH CHECK (
        auth.uid() = owner_id AND
        project_id IN (
            SELECT id FROM public.user_project
            WHERE owner_id = auth.uid()
        )
    );