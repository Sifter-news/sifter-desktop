-- Create node_person table
CREATE TABLE public.node_person (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    node_id UUID REFERENCES public.node(id) ON DELETE CASCADE,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    birth_date DATE,
    nationality VARCHAR(100),
    occupation VARCHAR(255),
    contact_info JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create node_organization table
CREATE TABLE public.node_organization (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    node_id UUID REFERENCES public.node(id) ON DELETE CASCADE,
    org_name VARCHAR(255),
    org_type VARCHAR(100),
    registration_number VARCHAR(100),
    founding_date DATE,
    headquarters_location VARCHAR(255),
    contact_info JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create node_document table
CREATE TABLE public.node_document (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    node_id UUID REFERENCES public.node(id) ON DELETE CASCADE,
    document_type VARCHAR(100),
    file_url VARCHAR(255),
    file_name VARCHAR(255),
    file_size BIGINT,
    mime_type VARCHAR(100),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create node_relationship table
CREATE TABLE public.node_relationship (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_node_id UUID REFERENCES public.node(id) ON DELETE CASCADE,
    target_node_id UUID REFERENCES public.node(id) ON DELETE CASCADE,
    relationship_type VARCHAR(100),
    description TEXT,
    start_date DATE,
    end_date DATE,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(source_node_id, target_node_id, relationship_type)
);

-- Create node_financial_transaction table
CREATE TABLE public.node_financial_transaction (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    node_id UUID REFERENCES public.node(id) ON DELETE CASCADE,
    transaction_type VARCHAR(100),
    amount DECIMAL(15, 2),
    currency VARCHAR(3),
    transaction_date DATE,
    source_account VARCHAR(255),
    destination_account VARCHAR(255),
    description TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create node_communication table
CREATE TABLE public.node_communication (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    node_id UUID REFERENCES public.node(id) ON DELETE CASCADE,
    communication_type VARCHAR(100),
    participants JSONB,
    content TEXT,
    timestamp TIMESTAMP,
    platform VARCHAR(100),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for better query performance
CREATE INDEX idx_node_person_node_id ON public.node_person(node_id);
CREATE INDEX idx_node_organization_node_id ON public.node_organization(node_id);
CREATE INDEX idx_node_document_node_id ON public.node_document(node_id);
CREATE INDEX idx_node_relationship_source ON public.node_relationship(source_node_id);
CREATE INDEX idx_node_relationship_target ON public.node_relationship(target_node_id);
CREATE INDEX idx_node_financial_transaction_node_id ON public.node_financial_transaction(node_id);
CREATE INDEX idx_node_communication_node_id ON public.node_communication(node_id);