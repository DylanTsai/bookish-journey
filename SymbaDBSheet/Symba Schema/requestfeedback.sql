TABLE public."SymbaApi_requestfeedback" (
    requestfeedback_id uuid NOT NULL,
    internuser_id uuid,
    "recipient_Name" character varying(200),
    recipient_email character varying(100) NOT NULL,
    project character varying(250),
    feedback_stars integer,
    feedback_q1_response character varying(500),
    feedback_q2_response character varying(500),
    is_active boolean NOT NULL,
    is_deleted boolean NOT NULL,
    created_on timestamp with time zone,
    created_by uuid,
    modified_on timestamp with time zone,
    modified_by uuid,
    org uuid,
    hire_again boolean,
    request_date timestamp with time zone,
    project_message character varying(5000),
    project_attached_file character varying(500),
    status boolean
)
 