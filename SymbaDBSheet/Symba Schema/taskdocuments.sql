 TABLE public."SymbaApi_taskdocuments" (
    document_id uuid NOT NULL,
    documentname character varying(100) NOT NULL,
    pdf_url character varying(100),
    source_url character varying(100),
    is_active boolean NOT NULL,
    is_deleted boolean NOT NULL,
    created_on timestamp with time zone NOT NULL,
    modified_on timestamp with time zone,
    created_by uuid,
    modifeid_by uuid,
    org uuid,
    task uuid NOT NULL
);
 