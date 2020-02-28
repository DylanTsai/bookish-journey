#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import psycopg2

# connect to a postgres dababase
con = psycopg2.connect(
        host = "localhost",
        port = "5432",
        database = "tang",
        user = "postgres",
        password = "")

# cursor to feed commands
cur = con.cursor()

# update/insert data as in sql
cur.execute(""" 
    insert into "SymbaApi_country" 
    (country_id,name,code,description,is_active,is_deleted,created_on,modified_on) 
    values 
    (uuid_generate_v4(),'China','CHN', 'added country', 't','f',DATE '2020-02-20',DATE '2020-02-20');   """
    )

cur.execute(""" 
    insert into "SymbaApi_country" 
    (country_id,name,code,description,is_active,is_deleted,created_on,modified_on) 
    values 
    (uuid_generate_v4(),'United States','USA', 'added country', 't','f',DATE '2020-02-20',DATE '2020-02-20');   """
    )


# retrieve data
cur.execute("select * from public.\"SymbaApi_country\"")
rows = cur.fetchall()
for r in rows:
    print(list(r))   
    
# close cursor
cur.close()

# to commit the changes to database
con.commit()

# close connection
con.close()


