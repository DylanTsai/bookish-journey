 TABLE public."SymbaApi_questionresponses" (
    questionresponse_id uuid NOT NULL,
    question_response character varying(1000),
    is_active boolean NOT NULL,
    "is_deleted " boolean NOT NULL,
    created_on timestamp with time zone NOT NULL,
    modified_on timestamp with time zone,
    created_by uuid,
    "user" uuid NOT NULL,
    modifeid_by uuid,
    questionmaster_id uuid NOT NULL
)