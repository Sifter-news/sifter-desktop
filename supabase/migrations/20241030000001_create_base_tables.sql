-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "wrappers" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Create base tables
CREATE TABLE IF NOT EXISTS "public"."organization" (
    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "name" character varying(255) NOT NULL,
    "description" text,
    "created_by" uuid,
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "organization_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "public"."organization_subscription" (
    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "organization_id" uuid,
    "plan_id" uuid,
    "start_date" timestamp without time zone NOT NULL,
    "end_date" timestamp without time zone,
    "status" character varying(50),
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "organization_subscription_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "public"."organization" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."organization_subscription" ENABLE ROW LEVEL SECURITY;