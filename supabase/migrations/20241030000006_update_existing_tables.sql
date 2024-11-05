-- Update existing tables
ALTER TABLE "public"."investigations" DROP COLUMN IF EXISTS "investigation_focus";
ALTER TABLE "public"."investigations" DROP COLUMN IF EXISTS "updated_at";
ALTER TABLE "public"."investigations" DISABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."node" DROP COLUMN IF EXISTS "color";
ALTER TABLE "public"."node" DROP COLUMN IF EXISTS "metadata";
ALTER TABLE "public"."node" DROP COLUMN IF EXISTS "order_index";
ALTER TABLE "public"."node" DROP COLUMN IF EXISTS "parent_id";
ALTER TABLE "public"."node" DROP COLUMN IF EXISTS "text_align";
ALTER TABLE "public"."node" DROP COLUMN IF EXISTS "text_size";
ALTER TABLE "public"."node" ADD COLUMN IF NOT EXISTS "parent_node_id" uuid;
ALTER TABLE "public"."node" ALTER COLUMN "position_z" SET DEFAULT '0'::numeric;
ALTER TABLE "public"."node" ALTER COLUMN "position_z" SET DATA TYPE numeric USING "position_z"::numeric;
ALTER TABLE "public"."node" DISABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."profiles" DROP COLUMN IF EXISTS "full_name";
ALTER TABLE "public"."profiles" ADD COLUMN IF NOT EXISTS "subscription_end_date" timestamp without time zone;
ALTER TABLE "public"."profiles" ADD COLUMN IF NOT EXISTS "subscription_start_date" timestamp without time zone;

ALTER TABLE "public"."reports" ALTER COLUMN "updated_at" DROP DEFAULT;
ALTER TABLE "public"."reports" DISABLE ROW LEVEL SECURITY;