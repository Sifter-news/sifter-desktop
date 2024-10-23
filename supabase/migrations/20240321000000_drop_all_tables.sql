-- Drop all existing tables in the correct order to handle dependencies
DROP TABLE IF EXISTS public.pending_edits;
DROP TABLE IF EXISTS public.event;
DROP TABLE IF EXISTS public.location;
DROP TABLE IF EXISTS public.concept_node;
DROP TABLE IF EXISTS public.object_node;
DROP TABLE IF EXISTS public.organization_node;
DROP TABLE IF EXISTS public.person_node;
DROP TABLE IF EXISTS public.node;
DROP TABLE IF EXISTS public.project_access;
DROP TABLE IF EXISTS public.project;
DROP TABLE IF EXISTS public.subscription;
DROP TABLE IF EXISTS public.subscription_plan;
DROP TABLE IF EXISTS public.user_role_assignment;
DROP TABLE IF EXISTS public.user_role;
DROP TABLE IF EXISTS public.profiles;