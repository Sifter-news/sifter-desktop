-- Modify existing tables (but keep avatar_url)
ALTER TABLE "public"."investigations" DROP COLUMN "investigation_focus";
ALTER TABLE "public"."investigations" DROP COLUMN "updated_at";
ALTER TABLE "public"."investigations" DISABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."node" DROP COLUMN "metadata";
ALTER TABLE "public"."node" ADD COLUMN "type" character varying(50);
ALTER TABLE "public"."node" DISABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."reports" DISABLE ROW LEVEL SECURITY;