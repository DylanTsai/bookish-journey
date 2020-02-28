 TABLE public."SymbaApi_taskmaster" (
    task_id uuid NOT NULL,
    name character varying(100) NOT NULL,
    duedate timestamp with time zone,
    comments character varying(500),
    status integer,
    is_active boolean NOT NULL,
    is_deleted boolean NOT NULL,
    created_on timestamp with time zone NOT NULL,
    modified_on timestamp with time zone,
    created_by uuid,
    modifeid_by uuid,
    org uuid,
    project uuid
);
 