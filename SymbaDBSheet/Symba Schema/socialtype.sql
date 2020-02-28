 TABLE public."SymbaApi_socialtype" (
    socialtype_id uuid NOT NULL,
    socialnetwork_type integer,
    url character varying(100),
    is_active boolean NOT NULL,
    "is_deleted " boolean NOT NULL,
    created_on timestamp with time zone NOT NULL,
    modified_on timestamp with time zone,
    created_by uuid,
    modifeid_by uuid,
    user_id uuid,
    resume_url character varying(500)
)
   