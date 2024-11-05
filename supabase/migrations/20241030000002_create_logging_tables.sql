-- Create logging tables
CREATE TABLE IF NOT EXISTS "public"."log_node_chain_of_custody" (
    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "node_id" uuid,
    "version_number" integer DEFAULT 1,
    "change_type" character varying(50),
    "change_description" text,
    "custody_event" boolean DEFAULT false,
    "file_hash" text,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "performed_by" uuid,
    "source_location" text,
    "recipient_person" uuid,
    "is_physical" boolean DEFAULT false,
    CONSTRAINT "log_node_chain_of_custody_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "public"."log_node_suggestions" (
    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "node_id" uuid,
    "user_id" uuid,
    "suggestion" text,
    "status" character varying(50),
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "log_node_suggestions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "public"."log_project" (
    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "investigation_id" uuid,
    "action_type" character varying(50),
    "performed_by" uuid,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "log_project_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "public"."log_user" (
    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "user_id" uuid,
    "activity_type" character varying(50),
    "description" text,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "log_user_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "public"."log_node_chain_of_custody" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."log_node_suggestions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."log_project" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."log_user" ENABLE ROW LEVEL SECURITY;