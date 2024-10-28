-- Create new tables
CREATE TABLE "public"."log_node_chain_of_custody" (
    "id" uuid not null default uuid_generate_v4(),
    "node_id" uuid,
    "version_number" integer default 1,
    "change_type" character varying(50),
    "change_description" text,
    "custody_event" boolean default false,
    "file_hash" text,
    "timestamp" timestamp without time zone default CURRENT_TIMESTAMP,
    "performed_by" uuid,
    "source_location" text,
    "recipient_person" uuid,
    "is_physical" boolean default false
);

CREATE TABLE "public"."log_node_suggestions" (
    "id" uuid not null default uuid_generate_v4(),
    "node_id" uuid,
    "user_id" uuid,
    "suggestion" text,
    "status" character varying(50),
    "timestamp" timestamp without time zone default CURRENT_TIMESTAMP
);

CREATE TABLE "public"."log_project" (
    "id" uuid not null default uuid_generate_v4(),
    "investigation_id" uuid,
    "action_type" character varying(50),
    "performed_by" uuid,
    "timestamp" timestamp without time zone default CURRENT_TIMESTAMP
);

CREATE TABLE "public"."log_user" (
    "id" uuid not null default uuid_generate_v4(),
    "user_id" uuid,
    "activity_type" character varying(50),
    "description" text,
    "timestamp" timestamp without time zone default CURRENT_TIMESTAMP
);

CREATE TABLE "public"."node_concept" (
    "node_id" uuid not null,
    "definition" text,
    "evolving_meanings" jsonb
);

CREATE TABLE "public"."node_event" (
    "id" uuid not null default uuid_generate_v4(),
    "event_name" character varying(255),
    "event_type" character varying(50),
    "start_date" timestamp without time zone,
    "end_date" timestamp without time zone,
    "location_id" uuid,
    "description" text,
    "investigation_id" uuid,
    "parent_event_id" uuid,
    "created_at" timestamp without time zone default CURRENT_TIMESTAMP
);

CREATE TABLE "public"."node_location" (
    "id" uuid not null default uuid_generate_v4(),
    "name" character varying(255),
    "coordinates" geography(Point,4326),
    "description" text
);

CREATE TABLE "public"."node_object" (
    "node_id" uuid not null,
    "object_type" character varying(50),
    "ownership" jsonb,
    "metadata" jsonb
);

CREATE TABLE "public"."node_organization" (
    "node_id" uuid not null,
    "legal_name" character varying(255),
    "business_number" character varying(100),
    "parent_org" uuid,
    "subsidiary_org" uuid
);

CREATE TABLE "public"."node_person" (
    "node_id" uuid not null,
    "birth_date" date,
    "death_date" date,
    "gender" character varying(50),
    "aliases" text[],
    "online_usernames" jsonb
);

CREATE TABLE "public"."organization" (
    "id" uuid not null default uuid_generate_v4(),
    "name" character varying(255) not null,
    "description" text,
    "created_by" uuid,
    "created_at" timestamp without time zone default CURRENT_TIMESTAMP
);

CREATE TABLE "public"."organization_subscription" (
    "id" uuid not null default uuid_generate_v4(),
    "organization_id" uuid,
    "plan_id" uuid,
    "start_date" timestamp without time zone not null,
    "end_date" timestamp without time zone,
    "status" character varying(50),
    "created_at" timestamp without time zone default CURRENT_TIMESTAMP
);

CREATE TABLE "public"."project_access" (
    "investigation_id" uuid not null,
    "user_id" uuid not null,
    "role" character varying(50) not null
);