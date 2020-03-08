TABLE public."SymbaApi_orgdepartment" (
    department_id uuid NOT NULL,
    departmentdesc character varying(30),
    address1 character varying(30),
    address2 character varying(30),
    address3 character varying(30),
    is_active boolean NOT NULL,
    "is_deleted " boolean NOT NULL,
    created_on timestamp with time zone NOT NULL,
    modified_on timestamp with time zone,
    city uuid,
    country uuid,
    created_by uuid,
    modifeid_by uuid,
    org uuid NOT NULL,
    state uuid
)