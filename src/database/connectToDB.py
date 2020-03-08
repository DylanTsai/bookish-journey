#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from flask import current_app, g
import psycopg2

def get_db():
    if 'db' not in g:
        g.db = psycopg2.connect(
            database = "postgres",

            host = "symbatest.c3uotbqk2qpa.us-east-2.rds.amazonaws.com",
            port = "5432",
            
            user = "masterusername",
            password = "masterpassword")

    return g.db


def close_db(e=None):
    db = g.pop('db', None)

    if db is not None:
        db.close()

# connect to a postgres dababase


con = psycopg2.connect(
            database = "postgres",

            host = "symbatest.c3uotbqk2qpa.us-east-2.rds.amazonaws.com",
            port = "5432",
            
            user = "masterusername",
            password = "masterpassword")
# cursor to feed commands
cur = con.cursor()

# you'll get a parameter from the person who goes to the website
# it'll look something like /testRetrieveColFromSymbaApi_country?col='colname'

col = "name"

cur.execute("select "+col+" from public.\"SymbaApi_country\"")
rows = cur.fetchall()
res = ""
for r in rows:
    res += r[0] +'\n'
print(res)
cur.close()
# cur.execute("""CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
#     """)

# cur.execute("""
#     create TABLE public."SymbaApi_country" (
#     country_id uuid NOT NULL,
#     name character varying(50) NOT NULL,
#     code character varying(50),
#     description character varying(100),
#     is_active boolean NOT NULL,
#     is_deleted boolean NOT NULL,
#     created_on timestamp with time zone NOT NULL,
#     modified_on timestamp with time zone,
#     created_by uuid,
#     modifeid_by uuid);
#     """)

# update/insert data as in sql
# cur.execute(""" 
#     insert into "SymbaApi_country" 
#     (country_id,name,code,description,is_active,is_deleted,created_on,modified_on) 
#     values 
#     (uuid_generate_v4(),'China','CHN', 'added country', 't','f',DATE '2020-02-20',DATE '2020-02-20');   
#     """)

# cur.execute(""" 
#     insert into "SymbaApi_country" 
#     (country_id,name,code,description,is_active,is_deleted,created_on,modified_on) 
#     values 
#     (uuid_generate_v4(),'United States','USA', 'added country', 't','f',DATE '2020-02-20',DATE '2020-02-20');   
#     """)


# # retrieve data
# cur.execute("select * from public.\"SymbaApi_country\"")
# rows = cur.fetchall()
# for r in rows:
#     print(list(r))   
    
# # close cursor
# cur.close()

# # to commit the changes to database
# con.commit()

# # close connection
# con.close()


