-- Create node type specific tables
CREATE TABLE IF NOT EXISTS "public"."node_concept" (
    "node_id" uuid NOT NULL,
    "definition" text,
    "evolving_meanings" jsonb,
    CONSTRAINT "node_concept_pkey" PRIMARY KEY ("node_id")
);

CREATE TABLE IF NOT EXISTS "public"."node_event" (
    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "event_name" character varying(255),
    "event_type" character varying(50),
    "start_date" timestamp without time zone,
    "end_date" timestamp without time zone,
    "location_id" uuid,
    "description" text,
    "investigation_id" uuid,
    "parent_event_id" uuid,
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "node_event_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "public"."node_location" (
    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "name" character varying(255),
    "coordinates" geography(Point,4326),
    "description" text,
    CONSTRAINT "node_location_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "public"."node_object" (
    "node_id" uuid NOT NULL,
    "object_type" character varying(50),
    "ownership" jsonb,
    "metadata" jsonb,
    CONSTRAINT "node_object_pkey" PRIMARY KEY ("node_id")
);

CREATE TABLE IF NOT EXISTS "public"."node_organization" (
    "node_id" uuid NOT NULL,
    "legal_name" character varying(255),
    "business_number" character varying(100),
    "parent_org" uuid,
    "subsidiary_org" uuid,
    CONSTRAINT "node_organization_pkey" PRIMARY KEY ("node_id")
);

CREATE TABLE IF NOT EXISTS "public"."node_person" (
    "node_id" uuid NOT NULL,
    "birth_date" date,
    "death_date" date,
    "gender" character varying(50),
    "aliases" text[],
    "online_usernames" jsonb,
    CONSTRAINT "node_person_pkey" PRIMARY KEY ("node_id")
);

ALTER TABLE "public"."node_concept" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."node_object" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."node_organization" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."node_person" ENABLE ROW LEVEL SECURITY;