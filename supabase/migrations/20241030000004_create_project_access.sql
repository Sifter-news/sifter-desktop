CREATE TABLE IF NOT EXISTS "public"."project_access" (
    "investigation_id" uuid NOT NULL,
    "user_id" uuid NOT NULL,
    "role" character varying(50) NOT NULL,
    CONSTRAINT "project_access_pkey" PRIMARY KEY ("investigation_id", "user_id")
);

ALTER TABLE "public"."project_access" ENABLE ROW LEVEL SECURITY;