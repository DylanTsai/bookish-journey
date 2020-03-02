 TABLE public."SymbaApi_country" (
    country_id uuid NOT NULL,
    name character varying(50) NOT NULL,
    code character varying(50),
    description character varying(100),
    is_active boolean NOT NULL,
    is_deleted boolean NOT NULL,
    created_on timestamp with time zone NOT NULL,
    modified_on timestamp with time zone,
    created_by uuid,
    modifeid_by uuid
)