-- Create indexes and primary keys
CREATE UNIQUE INDEX log_node_chain_of_custody_pkey ON public.log_node_chain_of_custody USING btree (id);
CREATE UNIQUE INDEX log_node_suggestions_pkey ON public.log_node_suggestions USING btree (id);
CREATE UNIQUE INDEX log_project_pkey ON public.log_project USING btree (id);
CREATE UNIQUE INDEX log_user_pkey ON public.log_user USING btree (id);
CREATE UNIQUE INDEX node_concept_pkey ON public.node_concept USING btree (node_id);
CREATE UNIQUE INDEX node_event_pkey ON public.node_event USING btree (id);
CREATE UNIQUE INDEX node_location_pkey ON public.node_location USING btree (id);
CREATE UNIQUE INDEX node_object_pkey ON public.node_object USING btree (node_id);
CREATE UNIQUE INDEX node_organization_pkey ON public.node_organization USING btree (node_id);
CREATE UNIQUE INDEX node_person_pkey ON public.node_person USING btree (node_id);
CREATE UNIQUE INDEX organization_pkey ON public.organization USING btree (id);
CREATE UNIQUE INDEX organization_subscription_pkey ON public.organization_subscription USING btree (id);
CREATE UNIQUE INDEX project_access_pkey ON public.project_access USING btree (investigation_id, user_id);