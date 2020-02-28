 TABLE public."SymbaApi_questionmaster" (
    questionmaster_id uuid NOT NULL,
    questiontext character varying(250),
    is_active boolean NOT NULL,
    "is_deleted " boolean NOT NULL,
    created_on timestamp with time zone NOT NULL,
    modified_on timestamp with time zone,
    created_by uuid,
    modifeid_by uuid,
    usertype_id integer
)