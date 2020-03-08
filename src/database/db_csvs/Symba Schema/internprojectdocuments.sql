 TABLE public."SymbaApi_internprojectdocuments" (
    internprojectdocuments_id uuid NOT NULL,
    is_active boolean NOT NULL,
    "is_deleted " boolean NOT NULL,
    created_on timestamp with time zone NOT NULL,
    modified_on timestamp with time zone,
    created_by uuid,
    intern uuid NOT NULL,
    modifeid_by uuid,
    project uuid NOT NULL,
    documentname character varying(100),
    pdf_url character varying(100),
    source_url character varying(500),
    org uuid,
    documentdescription character varying(100)
)