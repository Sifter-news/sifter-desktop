-- Add foreign key constraints
ALTER TABLE "public"."log_node_chain_of_custody" 
    ADD CONSTRAINT "log_node_chain_of_custody_node_id_fkey" 
    FOREIGN KEY ("node_id") REFERENCES node(id);

ALTER TABLE "public"."log_node_chain_of_custody" 
    ADD CONSTRAINT "log_node_chain_of_custody_performed_by_fkey" 
    FOREIGN KEY ("performed_by") REFERENCES profiles(id);

ALTER TABLE "public"."log_node_chain_of_custody" 
    ADD CONSTRAINT "log_node_chain_of_custody_recipient_person_fkey" 
    FOREIGN KEY ("recipient_person") REFERENCES node(id);

ALTER TABLE "public"."log_node_suggestions" 
    ADD CONSTRAINT "log_node_suggestions_node_id_fkey" 
    FOREIGN KEY ("node_id") REFERENCES node(id);

ALTER TABLE "public"."log_node_suggestions" 
    ADD CONSTRAINT "log_node_suggestions_user_id_fkey" 
    FOREIGN KEY ("user_id") REFERENCES profiles(id);

ALTER TABLE "public"."log_project" 
    ADD CONSTRAINT "log_project_investigation_id_fkey" 
    FOREIGN KEY ("investigation_id") REFERENCES investigations(id);

ALTER TABLE "public"."log_project" 
    ADD CONSTRAINT "log_project_performed_by_fkey" 
    FOREIGN KEY ("performed_by") REFERENCES profiles(id);

ALTER TABLE "public"."log_user" 
    ADD CONSTRAINT "log_user_user_id_fkey" 
    FOREIGN KEY ("user_id") REFERENCES profiles(id);

ALTER TABLE "public"."node" 
    ADD CONSTRAINT "node_parent_node_id_fkey" 
    FOREIGN KEY ("parent_node_id") REFERENCES node(id) ON DELETE SET NULL;

ALTER TABLE "public"."node_concept" 
    ADD CONSTRAINT "node_concept_node_id_fkey" 
    FOREIGN KEY ("node_id") REFERENCES node(id);

ALTER TABLE "public"."node_event" 
    ADD CONSTRAINT "node_event_investigation_id_fkey" 
    FOREIGN KEY ("investigation_id") REFERENCES investigations(id);

ALTER TABLE "public"."node_event" 
    ADD CONSTRAINT "node_event_location_id_fkey" 
    FOREIGN KEY ("location_id") REFERENCES node_location(id);

ALTER TABLE "public"."node_event" 
    ADD CONSTRAINT "node_event_parent_event_id_fkey" 
    FOREIGN KEY ("parent_event_id") REFERENCES node_event(id) ON DELETE SET NULL;

ALTER TABLE "public"."node_object" 
    ADD CONSTRAINT "node_object_node_id_fkey" 
    FOREIGN KEY ("node_id") REFERENCES node(id);

ALTER TABLE "public"."node_organization" 
    ADD CONSTRAINT "node_organization_node_id_fkey" 
    FOREIGN KEY ("node_id") REFERENCES node(id);

ALTER TABLE "public"."node_organization" 
    ADD CONSTRAINT "node_organization_parent_org_fkey" 
    FOREIGN KEY ("parent_org") REFERENCES node(id);

ALTER TABLE "public"."node_organization" 
    ADD CONSTRAINT "node_organization_subsidiary_org_fkey" 
    FOREIGN KEY ("subsidiary_org") REFERENCES node(id);

ALTER TABLE "public"."node_person" 
    ADD CONSTRAINT "node_person_node_id_fkey" 
    FOREIGN KEY ("node_id") REFERENCES node(id);

ALTER TABLE "public"."organization" 
    ADD CONSTRAINT "organization_created_by_fkey" 
    FOREIGN KEY ("created_by") REFERENCES profiles(id);

ALTER TABLE "public"."organization_subscription" 
    ADD CONSTRAINT "organization_subscription_organization_id_fkey" 
    FOREIGN KEY ("organization_id") REFERENCES organization(id);

ALTER TABLE "public"."organization_subscription" 
    ADD CONSTRAINT "organization_subscription_plan_id_fkey" 
    FOREIGN KEY ("plan_id") REFERENCES subscription_plans(id);

ALTER TABLE "public"."project_access" 
    ADD CONSTRAINT "project_access_investigation_id_fkey" 
    FOREIGN KEY ("investigation_id") REFERENCES investigations(id);

ALTER TABLE "public"."project_access" 
    ADD CONSTRAINT "project_access_user_id_fkey" 
    FOREIGN KEY ("user_id") REFERENCES profiles(id);