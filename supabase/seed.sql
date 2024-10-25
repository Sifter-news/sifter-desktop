-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Load seed files in order
\i seed/01_plans.sql
\i seed/02_users.sql
\i seed/03_investigations.sql
\i seed/04_reports.sql
\i seed/05_nodes.sql