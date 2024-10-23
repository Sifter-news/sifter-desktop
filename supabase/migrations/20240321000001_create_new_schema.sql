-- Create subscription tiers table first since it's referenced by user_profiles
CREATE TABLE public.user_subscription_tiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2),
    description TEXT,
    stripe_plan_id VARCHAR(255) UNIQUE
);

-- Create user profiles table with merged subscription information
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Unique identifier for the user
    username VARCHAR(255) NOT NULL, -- User's username
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- When the profile was created
    
    -- Subscription Information
    subscription_plan_id UUID REFERENCES public.user_subscription_tiers(id), -- The subscription tier selected by the user
    stripe_subscription_id VARCHAR(255), -- Stripe subscription ID for handling payments
    subscription_status VARCHAR(50) DEFAULT 'active', -- Status of the subscription (e.g., active, canceled)
    subscription_start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Start date of the subscription
    subscription_end_date TIMESTAMP, -- End date (if subscription has ended)
    last_payment_date TIMESTAMP -- Timestamp for the last payment made
);

-- Create projects table
CREATE TABLE public.user_project (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Unique project ID
    title VARCHAR(255) NOT NULL, -- Project title
    description TEXT, -- Project description
    owner_id UUID REFERENCES public.user_profiles(id), -- Owner of the project
    visibility VARCHAR(20) DEFAULT 'private', -- Visibility status (e.g., private, public)
    view_type VARCHAR(20) DEFAULT 'mind', -- Type of view for the project (mind, text, timeline, map)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Project creation timestamp
);

-- Create project access table
CREATE TABLE public.user_project_access (
    project_id UUID REFERENCES public.user_project(id), -- Reference to the project
    user_id UUID REFERENCES public.user_profiles(id), -- Reference to the user
    role VARCHAR(20) DEFAULT 'viewer', -- Role of the user (e.g., viewer, collaborator)
    PRIMARY KEY (project_id, user_id) -- Composite primary key
);

-- Log project activity
CREATE TABLE public.log_project (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Unique log entry ID
    project_id UUID REFERENCES public.user_project(id), -- Project related to the log entry
    user_id UUID REFERENCES public.user_profiles(id), -- User performing the action
    action VARCHAR(255), -- Description of the action
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Timestamp of the action
);

-- Create node table for generic nodes
CREATE TABLE public.node (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Unique node ID
    title VARCHAR(255) NOT NULL, -- Node title
    description TEXT, -- Node description
    type VARCHAR(50), -- Type of node (person, organization, object, event, etc.)
    avatar TEXT DEFAULT 'default_avatar.png', -- Avatar or image for the node
    is_public BOOLEAN DEFAULT FALSE, -- Whether the node is public or private
    owner_id UUID REFERENCES public.user_profiles(id), -- Owner of the node
    project_id UUID REFERENCES public.user_project(id), -- Project this node belongs to
    parent_node_id UUID REFERENCES public.node(id) ON DELETE SET NULL, -- Parent node
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Node creation timestamp
);

-- Create person-specific nodes
CREATE TABLE public.node_person (
    node_id UUID PRIMARY KEY REFERENCES public.node(id), -- Reference to the generic node
    birth_date DATE, -- Person's birth date
    death_date DATE, -- Person's death date
    gender VARCHAR(10), -- Gender of the person
    aliases TEXT[], -- List of aliases
    online_usernames JSONB -- Online usernames in JSON format
);

-- Create organization-specific nodes
CREATE TABLE public.node_organization (
    node_id UUID PRIMARY KEY REFERENCES public.node(id), -- Reference to the generic node
    legal_name VARCHAR(255), -- Legal name of the organization
    business_number VARCHAR(255), -- Business registration number
    parent_org UUID REFERENCES public.node(id), -- Reference to parent organization (if any)
    subsidiary_org UUID REFERENCES public.node(id) -- Reference to subsidiary organization (if any)
);

-- Create object-specific nodes (handling both physical and digital objects)
CREATE TABLE public.node_object (
    node_id UUID PRIMARY KEY REFERENCES public.node(id), -- Reference to the generic node
    object_type VARCHAR(50), -- Type of object (e.g., physical, digital, document)
    ownership JSONB, -- Ownership metadata stored as JSON
    metadata JSONB -- Metadata specific to the object, e.g., for digital files (hash, format, size) or physical properties
);

-- Create concept-specific nodes
CREATE TABLE public.node_concept (
    node_id UUID PRIMARY KEY REFERENCES public.node(id), -- Reference to the generic node
    definition TEXT, -- Definition of the concept
    evolving_meanings JSONB -- JSON structure to track evolving meanings or related documents
);

-- Create location-specific nodes
CREATE TABLE public.node_location (
    node_id UUID PRIMARY KEY REFERENCES public.node(id), -- Reference to the generic node
    name VARCHAR(255), -- Name of the location
    coordinates POINT, -- Coordinates of the location (latitude, longitude)
    description TEXT, -- Description of the location
    external_id JSONB, -- External location identifiers (e.g., Geonames, Google Place ID, OSM)
    location_type VARCHAR(50), -- Type of location (e.g., city, country, building, etc.)
    address TEXT, -- Optional field for storing the address in text format
    country_code VARCHAR(2), -- ISO country code for the location (e.g., "US", "GB")
    metadata JSONB -- Additional metadata, if needed, for other location-specific properties
);

-- Create event table for tracking events
CREATE TABLE public.event (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Unique event ID
    event_name VARCHAR(255) NOT NULL, -- Name of the event
    event_type VARCHAR(50), -- Type of the event (birth, meeting, transaction, etc.)
    start_date TIMESTAMP, -- Start date and time of the event
    end_date TIMESTAMP, -- End date and time of the event
    location_id UUID REFERENCES public.node_location(node_id), -- Location related to the event
    description TEXT, -- Description of the event
    project_id UUID REFERENCES public.user_project(id), -- Project this event is part of
    parent_event_id UUID REFERENCES public.event(id) ON DELETE SET NULL, -- Parent event (for nested events)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Event creation timestamp
);

-- Log node actions
CREATE TABLE public.log_node (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Unique log entry ID
    node_id UUID REFERENCES public.node(id), -- Node related to the log entry
    user_id UUID REFERENCES public.user_profiles(id), -- User performing the action
    action VARCHAR(255), -- Description of the action
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Timestamp of the action
);

-- Log node version history
CREATE TABLE public.log_node_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Unique log entry ID
    node_id UUID REFERENCES public.node(id), -- Node related to the log entry
    version_number INT NOT NULL, -- Version number
    changes JSONB, -- Changes made in this version (stored as JSON)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Timestamp of the version
);

-- Log chain of custody for documents or objects
CREATE TABLE public.log_chain_of_custody (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Unique log entry ID
    node_id UUID REFERENCES public.node(id), -- Node (document/object) related to the log entry
    user_id UUID REFERENCES public.user_profiles(id), -- User performing the action
    action VARCHAR(255), -- Description of the action (e.g., transferred, received)
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Timestamp of the action
);

-- Log user activity
CREATE TABLE public.log_user (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Unique log entry ID
    user_id UUID REFERENCES public.user_profiles(id), -- User related to the log entry
    action VARCHAR(255), -- Description of the action
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Timestamp of the action
);

-- Store public suggestions for edits to nodes
CREATE TABLE public.log_node_suggestions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Unique suggestion ID
    node_id UUID REFERENCES public.node(id), -- Node related to the suggestion
    user_id UUID REFERENCES public.user_profiles(id), -- User making the suggestion
    suggestion TEXT, -- The suggestion text
    status VARCHAR(20) DEFAULT 'pending', -- Status of the suggestion (pending, approved, rejected)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Suggestion creation timestamp
);
