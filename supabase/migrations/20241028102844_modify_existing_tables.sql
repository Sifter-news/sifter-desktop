-- Modify existing tables
ALTER TABLE "public"."investigations" DROP COLUMN IF EXISTS "investigation_focus";
ALTER TABLE "public"."investigations" DROP COLUMN IF EXISTS "updated_at";
ALTER TABLE "public"."investigations" DISABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."node" DROP COLUMN IF EXISTS "metadata";
ALTER TABLE "public"."node" ADD COLUMN IF NOT EXISTS "type" character varying(50);
ALTER TABLE "public"."node" DISABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."reports" DISABLE ROW LEVEL SECURITY;