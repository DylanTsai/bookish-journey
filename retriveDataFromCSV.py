#!/usr/bin/env python3
# -*- coding: utf-8 -*-

# Local Excel Version
import pandas as pd

data = pd.read_csv("SymbaDBSheet/country.csv") 

for index, row in data.iterrows():
    print(row['country_id'], row['name'],row['code'],row['description'])    # can add more retrivals
    
len(data)

# We should not update CSV files because of the relation, we use update the database using only psycopg2 


