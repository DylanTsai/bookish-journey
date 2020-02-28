TABLE public."SymbaApi_projectuserassignment" (
    projectuserassignment_id uuid NOT NULL,
    duedate timestamp with time zone,
    is_active boolean NOT NULL,
    created_on timestamp with time zone NOT NULL,
    modified_on timestamp with time zone,
    created_by uuid,
    modifeid_by uuid,
    org uuid,
    project uuid NOT NULL,
    "user" uuid,
    "is_deleted " boolean,
    project_status integer,
    project_feedback_stars integer,
    project_feedback_description character varying(5000)
)