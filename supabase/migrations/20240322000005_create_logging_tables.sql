-- Logging tables
CREATE TABLE public.log_node_chain_of_custody (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    node_id UUID REFERENCES public.node(id) ON DELETE CASCADE,
    version_number INT DEFAULT 1,
    change_type VARCHAR(50),
    change_description TEXT,
    custody_event BOOLEAN DEFAULT FALSE,
    file_hash TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    performed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    source_location VARCHAR(255),
    recipient_person UUID REFERENCES public.node(id),
    is_physical BOOLEAN DEFAULT FALSE,
    previous_version_id UUID REFERENCES public.log_node_chain_of_custody(id) ON DELETE SET NULL
);

CREATE TABLE public.log_node_suggestions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    node_id UUID REFERENCES public.node(id),
    user_id UUID REFERENCES public.profiles(id),
    suggestion TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.log_project (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.project(id),
    action_type VARCHAR(50),
    performed_by UUID REFERENCES public.profiles(id),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.log_user (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id),
    activity_type VARCHAR(50),
    description TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);