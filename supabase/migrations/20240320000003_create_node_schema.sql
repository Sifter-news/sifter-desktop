-- Generic node table creation
CREATE TABLE public.node (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255),
    description TEXT,
    type VARCHAR(50),
    avatar TEXT DEFAULT 'default_avatar.png',
    is_public BOOLEAN DEFAULT FALSE,
    owner_id UUID REFERENCES public.profiles(id),
    investigation_id UUID REFERENCES public.investigations(id),
    parent_node_id UUID REFERENCES public.node(id) ON DELETE SET NULL,
    x FLOAT DEFAULT 0,
    y FLOAT DEFAULT 0,
    width INTEGER DEFAULT 200,
    height INTEGER DEFAULT 200,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);