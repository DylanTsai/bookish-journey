import connectToDB as ctdb




def write_user_info(id,password,country,school,visa,state,city,fname,lname,language,start,end,hours,interest,skill):
    """
    Function that Writes user inputted information to database
    Uses connectToDB module to manage connecting to the database
    Does not Return Anything
    """
    # Connect to DB
    db = ctdb.get_db()
    cur = db.cursor()
    
    if checkEmail(cur,id):
        # Credentials Table
        insert_user_creds(cur,id,password)
        # Profile Table
        insert_intern_profile(cur,id,country,school,visa,state,city,fname,lname)
        # TimeAvailable Table
        insert_intern_time(cur,id,hours)
        #Intern Language Table
        insert_intern_language(cur,id,language)
        #Time Frame Table
        insert_time_frame(cur,id,start,end,hours)
        # Intrest Table
        insert_intrest(cur,id,interest)
        # Skill Table
        insert_intern_skill(cur,id,skill)
        # Commit to datatables 
        db.commit()
        #Close Communication
        cur.close()
        ctdb.close_db()
    else:
        print("Error User Name Already in the System")


# Credentials
def insert_user_creds(cur,id,password):
    """Helper Function that Inserts data into the mentioned Table"""
    cur.execute("INSERT INTO InternCredentials (id,password) VALUES(%s,%s)", (id,password))

# Profile
def insert_intern_profile(cur,id,country,school,visa,state,city,fname,lname):
    """Helper Function that Inserts data into the mentioned Table"""
    cur.execute("INSERT INTO InternProfile (id,country,college_education,visa_status,state,city,first_name,last_name,email) VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)", (id, country, school, visa, state, city, fname,lname,id))

# Time
def insert_intern_time(cur,id,hours):
    """Helper Function that Inserts data into the mentioned Table"""
    cur.execute("INSERT INTO InternTimeAvailable (intern,hours) VALUES(%s,%s)", (id, hours))

# Language
def insert_intern_language(cur,id,language):
    """Helper Function that Inserts data into the mentioned Table"""
    cur.execute("INSERT INTO InternLanguage (intern,language) VALUES(%s,%s)", (id, language))

# Time Frame
def insert_time_frame(cur,id,start,end,hours):
    """Helper Function that Inserts data into the mentioned Table"""
    cur.execute("INSERT INTO AvailableTimeFrame (intern,available_start_date,available_end_date,max_hours_per_week) VALUES(%s,%s,%s,%s)",(id,start,end,hours))

#InternIntrests
def insert_intrest(cur,id,intrest):
    """Helper Function that Inserts data into the mentioned Table"""
    cur.execute("INSERT INTO InternInterests(intern,intrest) VALUES(%s,%s)",(id,intrest))

#InternSkills
def insert_intern_skill(cur,id,skill):
    """Helper Function that Inserts data into the mentioned Table"""
    cur.execute("INSERT INTO InternSkills(intern,skills) VALUES(%s,%s)",(id,skill))


def checkEmail(cur,user):
    """
    Returns True if the email is not already in the Database
    Returns False Otherwise 
    """
    sql = """SELECT COUNT(*) FROM InternProfile WHERE Email='%s'""" % (user)
    cur.execute(sql)
    value = cur.fetchone()
    if value>0: return False
    else: return True






















