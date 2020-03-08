 TABLE public."SymbaApi_supervisorinternassignment" (
    is_active boolean NOT NULL,
    is_deleted boolean NOT NULL,
    created_on timestamp with time zone NOT NULL,
    modified_on timestamp with time zone,
    created_by uuid,
    intern uuid NOT NULL,
    modifeid_by uuid,
    org uuid,
    supervisor uuid NOT NULL,
    supervisor_intern_assignment_id uuid NOT NULL
);
 