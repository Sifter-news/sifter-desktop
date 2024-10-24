-- Table: user_role
CREATE TABLE public.user_role (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL,
    description TEXT
);

-- Table: user_role_assignment
CREATE TABLE public.user_role_assignment (
    user_id UUID REFERENCES public.profiles(id),
    role_id UUID REFERENCES public.user_role(id),
    PRIMARY KEY (user_id, role_id)
);