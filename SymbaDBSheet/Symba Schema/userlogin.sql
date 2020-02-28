 TABLE public."SymbaApi_userlogin" (
    userlogin_id  uuid  NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(100) NOT NULL,
    is_active boolean NOT NULL,
    is_deleted boolean NOT NULL,
    created_on timestamp with time zone NOT NULL,
    modified_on timestamp with time zone,
    created_by uuid,
    modifeid_by uuid,
    org uuid,
    "user" uuid
);
 