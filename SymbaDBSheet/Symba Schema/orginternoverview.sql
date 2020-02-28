 TABLE public."SymbaApi_orginternoverview" (
    overview_id uuid NOT NULL,
    org uuid NOT NULL,
    video_url character varying(200),
    overview_description character varying(5000),
    file_link character varying(250),
    file_title character varying(100),
    file_description character varying(250),
    is_active boolean,
    is_deleted boolean,
    created_on timestamp with time zone,
    created_by uuid,
    modified_on timestamp with time zone,
    modifeid_by uuid,
    "Type" character varying(10)
)  