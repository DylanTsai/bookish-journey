 TABLE public."SymbaApi_projectmaster" (
    project_id uuid NOT NULL,
    name character varying(50) NOT NULL,
    description character varying(5000) NOT NULL,
    instructions character varying(5000),
    status integer,
    is_active boolean NOT NULL,
    is_deleted boolean NOT NULL,
    created_on timestamp with time zone NOT NULL,
    modified_on timestamp with time zone,
    created_by uuid,
    modifeid_by uuid,
    org uuid,
    start_date date,
    due_date date,
    is_locked boolean
)