TABLE public."SymbaApi_organization" (
    org_id uuid NOT NULL,
    name character varying(200) NOT NULL,
    adminpersonname character varying(200),
    adminemail_id character varying(50),
    logo_url character varying(100),
    "admin_Id" integer,
    accounttype character varying(100),
    alloweddomainname character varying(100),
    allowedipaddress character varying(100),
    is_active boolean NOT NULL,
    is_deleted boolean NOT NULL,
    created_on timestamp with time zone NOT NULL,
    modified_on timestamp with time zone,
    created_by uuid,
    modifeid_by uuid
)