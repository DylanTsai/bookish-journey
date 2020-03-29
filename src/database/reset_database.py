#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from flask import current_app, g
import psycopg2

con = psycopg2.connect(
            database = "symbatest",

            host = "symbatest.c3uotbqk2qpa.us-east-2.rds.amazonaws.com",
            port = "5432",
            
            user = "masterusername",
            password = "masterpassword")

# cursor to feed commands
cur = con.cursor()

cur.execute("""
DROP TABLE IF EXISTS "InternProfile" CASCADE;
DROP TABLE IF EXISTS "Major" CASCADE;
DROP TABLE IF EXISTS "InternCredentials" CASCADE;
DROP TABLE IF EXISTS "Challenge" CASCADE;
DROP TABLE IF EXISTS "CompletedChallenge" CASCADE;
DROP TABLE IF EXISTS "Position" CASCADE;
DROP TABLE IF EXISTS "PositionApplicants" CASCADE;
DROP TABLE IF EXISTS "PositionSkills" CASCADE;
DROP TABLE IF EXISTS "InternEmployee" CASCADE;
DROP TABLE IF EXISTS "Country" CASCADE;
DROP TABLE IF EXISTS "Company" CASCADE;
DROP TABLE IF EXISTS "InternTimeAvailable" CASCADE;
DROP TABLE IF EXISTS "Hour" CASCADE;
DROP TABLE IF EXISTS "InternSkills" CASCADE;
DROP TABLE IF EXISTS "Skill" CASCADE;
DROP TABLE IF EXISTS "InternLanguage" CASCADE;
DROP TABLE IF EXISTS "Language" CASCADE;
DROP TABLE IF EXISTS "Interest" CASCADE;
DROP TABLE IF EXISTS "InterestCategory" CASCADE;
DROP TABLE IF EXISTS "InternInterests" CASCADE;
DROP TABLE IF EXISTS "AvailableTimeFrame" CASCADE;
DROP TABLE IF EXISTS "HoursPerWeek" CASCADE;

CREATE TABLE "InternProfile" (
  "intern_id" SERIAL PRIMARY KEY,
  "last_name" varchar(100),
  "first_name" varchar(100),
  "email" varchar(100),
  "country" int,
  "state" varchar(100),
  "city" varchar(100),
  "local_time_zone" int,
  "college_education" varchar(500),
  "major_1" int,
  "major_2" int,
  "minor_1" int,
  "minor_2" int,
  "self_intro" varchar(500),
  "resume_fpath" varchar(500),
  "symba_challenge_points" int
);

CREATE TABLE "Major" (
  "major_id" SERIAL PRIMARY KEY,
  "major_name" varchar(50)
);

CREATE TABLE "InternCredentials" (
  "intern" int,
  "password" varchar(50)
);

CREATE TABLE "Challenge" (
  "challenge_id" SERIAL PRIMARY KEY,
  "challenge_name" varchar(50),
  "challenge_link" varchar(500)
);

CREATE TABLE "CompletedChallenge" (
  "intern" int,
  "challenge" int
);

CREATE TABLE "Position" (
  "position_id" SERIAL PRIMARY KEY,
  "company" int,
  "position_title" varchar(500),
  "start_date" date,
  "end_date" date,
  "is_part_time" boolean,
  "location" varchar(500),
  "description" varchar(1000),
  "challenge" int
);

CREATE TABLE "PositionApplicants" (
  "applicant" int,
  "position" int
);

CREATE TABLE "PositionSkills" (
  "position" int,
  "skill" int
);

CREATE TABLE "InternEmployee" (
  "intern" int,
  "company" int,
  "position" varchar(255),
  "rate_per_hour" int,
  "start_date" date,
  "end_date" date
);

CREATE TABLE "Country" (
  "country_id" SERIAL PRIMARY KEY,
  "name" varchar(500)
);

CREATE TABLE "Company" (
  "company_id" SERIAL PRIMARY KEY,
  "company_name" varchar(100),
  "company_email" varchar(100),
  "company_website" varchar(500)
);

CREATE TABLE "InternTimeAvailable" (
  "intern" int,
  "hour" int
);

CREATE TABLE "Hour" (
  "hour_id" SERIAL PRIMARY KEY,
  "hour_name" int
);

CREATE TABLE "InternSkills" (
  "intern" int,
  "skill" int
);

CREATE TABLE "Skill" (
  "skill_id" SERIAL PRIMARY KEY,
  "skill_name" varchar(100)
);

CREATE TABLE "InternLanguage" (
  "intern" int,
  "language" int
);

CREATE TABLE "Language" (
  "language_id" SERIAL PRIMARY KEY,
  "language_name" varchar(30)
);

CREATE TABLE "Interest" (
  "interest_id" SERIAL PRIMARY KEY,
  "interest_name" varchar(100),
  "category" int
);

CREATE TABLE "InterestCategory" (
  "interest_category_id" SERIAL PRIMARY KEY,
  "interest_category_name" varchar(100)
);

CREATE TABLE "InternInterests" (
  "intern" int,
  "interest" int
);

CREATE TABLE "AvailableTimeFrame" (
  "intern" int,
  "available_start_date" date,
  "available_end_date" date,
  "max_hours_per_week" int
);

CREATE TABLE "HoursPerWeek" (
  "hours_per_week_id" SERIAL PRIMARY KEY,
  "hours_range" varchar(20)
);

ALTER TABLE "InternProfile" ADD FOREIGN KEY ("country") REFERENCES "Country" ("country_id");

ALTER TABLE "InternProfile" ADD FOREIGN KEY ("major_1") REFERENCES "Major" ("major_id");

ALTER TABLE "InternProfile" ADD FOREIGN KEY ("major_2") REFERENCES "Major" ("major_id");

ALTER TABLE "InternProfile" ADD FOREIGN KEY ("minor_1") REFERENCES "Major" ("major_id");

ALTER TABLE "InternProfile" ADD FOREIGN KEY ("minor_2") REFERENCES "Major" ("major_id");

ALTER TABLE "InternCredentials" ADD FOREIGN KEY ("intern") REFERENCES "InternProfile" ("intern_id");

ALTER TABLE "CompletedChallenge" ADD FOREIGN KEY ("intern") REFERENCES "InternProfile" ("intern_id");

ALTER TABLE "CompletedChallenge" ADD FOREIGN KEY ("challenge") REFERENCES "Challenge" ("challenge_id");

ALTER TABLE "Position" ADD FOREIGN KEY ("company") REFERENCES "Company" ("company_id");

ALTER TABLE "Position" ADD FOREIGN KEY ("challenge") REFERENCES "Challenge" ("challenge_id");

ALTER TABLE "PositionApplicants" ADD FOREIGN KEY ("applicant") REFERENCES "InternProfile" ("intern_id");

ALTER TABLE "PositionApplicants" ADD FOREIGN KEY ("position") REFERENCES "Position" ("position_id");

ALTER TABLE "PositionSkills" ADD FOREIGN KEY ("position") REFERENCES "Position" ("position_id");

ALTER TABLE "PositionSkills" ADD FOREIGN KEY ("skill") REFERENCES "Skill" ("skill_id");

ALTER TABLE "InternEmployee" ADD FOREIGN KEY ("intern") REFERENCES "InternProfile" ("intern_id");

ALTER TABLE "InternEmployee" ADD FOREIGN KEY ("company") REFERENCES "Company" ("company_id");

ALTER TABLE "InternTimeAvailable" ADD FOREIGN KEY ("intern") REFERENCES "InternProfile" ("intern_id");

ALTER TABLE "InternTimeAvailable" ADD FOREIGN KEY ("hour") REFERENCES "Hour" ("hour_id");

ALTER TABLE "InternSkills" ADD FOREIGN KEY ("intern") REFERENCES "InternProfile" ("intern_id");

ALTER TABLE "InternSkills" ADD FOREIGN KEY ("skill") REFERENCES "Skill" ("skill_id");

ALTER TABLE "InternLanguage" ADD FOREIGN KEY ("intern") REFERENCES "InternProfile" ("intern_id");

ALTER TABLE "InternLanguage" ADD FOREIGN KEY ("language") REFERENCES "Language" ("language_id");

ALTER TABLE "Interest" ADD FOREIGN KEY ("category") REFERENCES "InterestCategory" ("interest_category_id");

ALTER TABLE "InternInterests" ADD FOREIGN KEY ("intern") REFERENCES "InternProfile" ("intern_id");

ALTER TABLE "InternInterests" ADD FOREIGN KEY ("interest") REFERENCES "Interest" ("interest_id");

ALTER TABLE "AvailableTimeFrame" ADD FOREIGN KEY ("intern") REFERENCES "InternProfile" ("intern_id");

ALTER TABLE "AvailableTimeFrame" ADD FOREIGN KEY ("max_hours_per_week") REFERENCES "HoursPerWeek" ("hours_per_week_id");

--Insert into Hour
INSERT INTO "public"."Hour" ("hour_id", "hour_name") VALUES ('0', '0');
INSERT INTO "public"."Hour" ("hour_id", "hour_name") VALUES ('1', '1');
INSERT INTO "public"."Hour" ("hour_id", "hour_name") VALUES ('2', '2');
INSERT INTO "public"."Hour" ("hour_id", "hour_name") VALUES ('3', '3');
INSERT INTO "public"."Hour" ("hour_id", "hour_name") VALUES ('4', '4');
INSERT INTO "public"."Hour" ("hour_id", "hour_name") VALUES ('5', '5');
INSERT INTO "public"."Hour" ("hour_id", "hour_name") VALUES ('6', '6');
INSERT INTO "public"."Hour" ("hour_id", "hour_name") VALUES ('7', '7');
INSERT INTO "public"."Hour" ("hour_id", "hour_name") VALUES ('8', '8');
INSERT INTO "public"."Hour" ("hour_id", "hour_name") VALUES ('9', '9');
INSERT INTO "public"."Hour" ("hour_id", "hour_name") VALUES ('10', '10');
INSERT INTO "public"."Hour" ("hour_id", "hour_name") VALUES ('11', '11');
INSERT INTO "public"."Hour" ("hour_id", "hour_name") VALUES ('12', '12');
INSERT INTO "public"."Hour" ("hour_id", "hour_name") VALUES ('13', '13');
INSERT INTO "public"."Hour" ("hour_id", "hour_name") VALUES ('14', '14');
INSERT INTO "public"."Hour" ("hour_id", "hour_name") VALUES ('15', '15');
INSERT INTO "public"."Hour" ("hour_id", "hour_name") VALUES ('16', '16');
INSERT INTO "public"."Hour" ("hour_id", "hour_name") VALUES ('17', '17');
INSERT INTO "public"."Hour" ("hour_id", "hour_name") VALUES ('18', '18');
INSERT INTO "public"."Hour" ("hour_id", "hour_name") VALUES ('19', '19');
INSERT INTO "public"."Hour" ("hour_id", "hour_name") VALUES ('20', '20');
INSERT INTO "public"."Hour" ("hour_id", "hour_name") VALUES ('21', '21');
INSERT INTO "public"."Hour" ("hour_id", "hour_name") VALUES ('22', '22');
INSERT INTO "public"."Hour" ("hour_id", "hour_name") VALUES ('23', '23');
INSERT INTO "public"."Hour" ("hour_id", "hour_name") VALUES ('24', '24');

--Insert into Language
INSERT INTO "public"."Language" ("language_id", "language_name") VALUES ('1', 'English');
INSERT INTO "public"."Language" ("language_id", "language_name") VALUES ('2', 'Mandarin');
INSERT INTO "public"."Language" ("language_id", "language_name") VALUES ('3', 'Hindi');
INSERT INTO "public"."Language" ("language_id", "language_name") VALUES ('4', 'Spanish');
INSERT INTO "public"."Language" ("language_id", "language_name") VALUES ('5', 'French');
INSERT INTO "public"."Language" ("language_id", "language_name") VALUES ('6', 'German');
INSERT INTO "public"."Language" ("language_id", "language_name") VALUES ('7', 'Arabic');
INSERT INTO "public"."Language" ("language_id", "language_name") VALUES ('8', 'Russian');
INSERT INTO "public"."Language" ("language_id", "language_name") VALUES ('9', 'Portuguese');

--Insert into HoursPerWeek
INSERT INTO "public"."HoursPerWeek" ("hours_per_week_id", "hours_range") VALUES ('1', '5');
INSERT INTO "public"."HoursPerWeek" ("hours_per_week_id", "hours_range") VALUES ('2', '10');
INSERT INTO "public"."HoursPerWeek" ("hours_per_week_id", "hours_range") VALUES ('3', '15');
INSERT INTO "public"."HoursPerWeek" ("hours_per_week_id", "hours_range") VALUES ('4', '20');
INSERT INTO "public"."HoursPerWeek" ("hours_per_week_id", "hours_range") VALUES ('5', '25');
INSERT INTO "public"."HoursPerWeek" ("hours_per_week_id", "hours_range") VALUES ('6', '30');
INSERT INTO "public"."HoursPerWeek" ("hours_per_week_id", "hours_range") VALUES ('7', '40');
INSERT INTO "public"."HoursPerWeek" ("hours_per_week_id", "hours_range") VALUES ('8', '50');

--Insert into InterestCategory
INSERT INTO "public"."InterestCategory" ("interest_category_id", "interest_category_name") VALUES ('1', 'Computer Science');
INSERT INTO "public"."InterestCategory" ("interest_category_id", "interest_category_name") VALUES ('2', 'Finance');
INSERT INTO "public"."InterestCategory" ("interest_category_id", "interest_category_name") VALUES ('3', 'Biology');
INSERT INTO "public"."InterestCategory" ("interest_category_id", "interest_category_name") VALUES ('4', 'History');
INSERT INTO "public"."InterestCategory" ("interest_category_id", "interest_category_name") VALUES ('5', 'Art');
INSERT INTO "public"."InterestCategory" ("interest_category_id", "interest_category_name") VALUES ('6', 'Economics');

--Insert into Interest
INSERT INTO "public"."Interest" ("interest_id", "interest_name", "category") VALUES ('1', 'Algorithms', '1');
INSERT INTO "public"."Interest" ("interest_id", "interest_name", "category") VALUES ('2', 'Machine Learning', '1');
INSERT INTO "public"."Interest" ("interest_id", "interest_name", "category") VALUES ('3', 'Stock Market', '2');
INSERT INTO "public"."Interest" ("interest_id", "interest_name", "category") VALUES ('4', 'DNA', '3');
INSERT INTO "public"."Interest" ("interest_id", "interest_name", "category") VALUES ('5', 'World War II', '4');
INSERT INTO "public"."Interest" ("interest_id", "interest_name", "category") VALUES ('6', 'Black Friday', '6');

--Insert into Skill
INSERT INTO "public"."Skill" ("skill_id", "skill_name") VALUES ('1', 'Java');
INSERT INTO "public"."Skill" ("skill_id", "skill_name") VALUES ('2', 'Python');
INSERT INTO "public"."Skill" ("skill_id", "skill_name") VALUES ('3', 'C++');
INSERT INTO "public"."Skill" ("skill_id", "skill_name") VALUES ('4', 'Javascript');
INSERT INTO "public"."Skill" ("skill_id", "skill_name") VALUES ('5', 'SQL');
INSERT INTO "public"."Skill" ("skill_id", "skill_name") VALUES ('6', 'HTML');
INSERT INTO "public"."Skill" ("skill_id", "skill_name") VALUES ('7', 'Bloomberg Terminal');

--Insert into Major
INSERT INTO "public"."Major" ("major_id", "major_name") VALUES ('1', 'Computer Science');
INSERT INTO "public"."Major" ("major_id", "major_name") VALUES ('2', 'Operations Research and Information Engineering');
INSERT INTO "public"."Major" ("major_id", "major_name") VALUES ('3', 'Mathematics');
INSERT INTO "public"."Major" ("major_id", "major_name") VALUES ('4', 'Biology');
INSERT INTO "public"."Major" ("major_id", "major_name") VALUES ('5', 'Economics');
INSERT INTO "public"."Major" ("major_id", "major_name") VALUES ('6', 'History');

--Insert into Country
INSERT INTO "public"."Country" ("country_id", "name") VALUES ('1', 'United States');
INSERT INTO "public"."Country" ("country_id", "name") VALUES ('2', 'China');
INSERT INTO "public"."Country" ("country_id", "name") VALUES ('3', 'India');
INSERT INTO "public"."Country" ("country_id", "name") VALUES ('4', 'Canada');
INSERT INTO "public"."Country" ("country_id", "name") VALUES ('5', 'Russia');
INSERT INTO "public"."Country" ("country_id", "name") VALUES ('6', 'France');
INSERT INTO "public"."Country" ("country_id", "name") VALUES ('7', 'Germany');

--Insert into Intern
--Note here that we don't need to insert anything to major 2 if he doesnt have it
INSERT INTO "public"."InternProfile" ("intern_id", "last_name", "first_name", "email", "country", "state", "city", "local_time_zone", "college_education", "major_1", "minor_1", "self_intro", "resume_fpath", "symba_challenge_points") VALUES ('1', 'Zhihao', 'Tang', 'zt222@cornell.edu', '1', 'NY', 'Ithaca', '-4', 'Cornell University', '1', '3', 'test', 'https://www.linkedin.com/in/zhihao-tang/', '0');
INSERT INTO "public"."InternProfile" ("intern_id", "last_name", "first_name", "email", "country", "state", "city", "local_time_zone", "college_education", "major_1", "major_2", "self_intro", "resume_fpath", "symba_challenge_points") VALUES ('2', 'Eric', 'Ma', 'eric@cornell.edu', '1', 'NY', 'Ithaca', '-4', 'Cornell University', '4', '6', 'test_for_eric', 'https://github.com/ZTang813', '0');

--Insert into Intern credentials
INSERT INTO "public"."InternCredentials" ("intern", "password") VALUES ('1', 'tzhpassword1');
INSERT INTO "public"."InternCredentials" ("intern", "password") VALUES ('2', 'tzhpassword2');

--Insert into InterTimeAvaliable
INSERT INTO "public"."InternTimeAvailable" ("intern", "hour") VALUES ('1', '10');
INSERT INTO "public"."InternTimeAvailable" ("intern", "hour") VALUES ('1', '11');
INSERT INTO "public"."InternTimeAvailable" ("intern", "hour") VALUES ('1', '12');
INSERT INTO "public"."InternTimeAvailable" ("intern", "hour") VALUES ('1', '13');
INSERT INTO "public"."InternTimeAvailable" ("intern", "hour") VALUES ('1', '14');
INSERT INTO "public"."InternTimeAvailable" ("intern", "hour") VALUES ('1', '15');
INSERT INTO "public"."InternTimeAvailable" ("intern", "hour") VALUES ('1', '16');
INSERT INTO "public"."InternTimeAvailable" ("intern", "hour") VALUES ('1', '17');
INSERT INTO "public"."InternTimeAvailable" ("intern", "hour") VALUES ('2', '20');
INSERT INTO "public"."InternTimeAvailable" ("intern", "hour") VALUES ('2', '21');
INSERT INTO "public"."InternTimeAvailable" ("intern", "hour") VALUES ('2', '22');
INSERT INTO "public"."InternTimeAvailable" ("intern", "hour") VALUES ('2', '23');

--Insert into InternLanguage
INSERT INTO "public"."InternLanguage" ("intern", "language") VALUES ('1', '1');
INSERT INTO "public"."InternLanguage" ("intern", "language") VALUES ('1', '2');
INSERT INTO "public"."InternLanguage" ("intern", "language") VALUES ('2', '1');
INSERT INTO "public"."InternLanguage" ("intern", "language") VALUES ('2', '3');

--Insert into AvaliableTimeFrame
--last'2' means 10 hours a week
INSERT INTO "public"."AvailableTimeFrame" ("intern", "available_start_date", "available_end_date", "max_hours_per_week") VALUES ('1', '2020-03-01', '2020-05-31', '2'); 
INSERT INTO "public"."AvailableTimeFrame" ("intern", "available_start_date", "available_end_date", "max_hours_per_week") VALUES ('1', '2020-06-01', '2020-08-31', '7'); 
INSERT INTO "public"."AvailableTimeFrame" ("intern", "available_start_date", "available_end_date", "max_hours_per_week") VALUES ('2', '2020-04-01', '2020-09-30', '4'); 

--Insert into InternInterests
INSERT INTO "public"."InternInterests" ("intern", "interest") VALUES ('1', '1');
INSERT INTO "public"."InternInterests" ("intern", "interest") VALUES ('1', '2');
INSERT INTO "public"."InternInterests" ("intern", "interest") VALUES ('1', '3');
INSERT INTO "public"."InternInterests" ("intern", "interest") VALUES ('2', '2');
INSERT INTO "public"."InternInterests" ("intern", "interest") VALUES ('2', '4');
INSERT INTO "public"."InternInterests" ("intern", "interest") VALUES ('2', '5');

--Insert into Challenge
INSERT INTO "public"."Challenge" ("challenge_id", "challenge_name", "challenge_link") VALUES ('1', 'Leet Code #1', 'https://leetcode.com/problems/two-sum/');
INSERT INTO "public"."Challenge" ("challenge_id", "challenge_name", "challenge_link") VALUES ('2', 'Leet Code #2', 'https://leetcode.com/problems/add-two-numbers/');
INSERT INTO "public"."Challenge" ("challenge_id", "challenge_name", "challenge_link") VALUES ('3', 'Leet Code #3', 'https://leetcode.com/problems/longest-substring-without-repeating-characters/');


--Insert into Company
INSERT INTO "public"."Company" ("company_id", "company_name", "company_email", "company_website") VALUES ('1', 'Test Company1', 'zt222@cornell.edu', 'www.google.com');
INSERT INTO "public"."Company" ("company_id", "company_name", "company_email", "company_website") VALUES ('2', 'Test Company2', 'zt222@cornell.edu', 'www.youtube.com');

--Insert into Position
INSERT INTO "public"."Position" ("position_id", "company", "position_title", "start_date", "end_date", "is_part_time", "location", "description", "challenge") VALUES ('1', '1', 'Data Analyst Intern', '2020-04-01', '2020-05-01', 't', 'Ithaca', ' Test stuff again 1','1');
INSERT INTO "public"."Position" ("position_id", "company", "position_title", "start_date", "end_date", "is_part_time", "location", "description", "challenge") VALUES ('2', '1', 'SDE Intern', '2020-06-01', '2020-08-01', 't', 'Ithaca', ' Test stuff again 2', '2');
INSERT INTO "public"."Position" ("position_id", "company", "position_title", "start_date", "end_date", "is_part_time", "location", "description", "challenge") VALUES ('3', '2', 'Market Intern', '2020-03-02', '2020-03-014', 't', 'Ithaca', ' Test stuff again 3', '1');
INSERT INTO "public"."Position" ("position_id", "company", "position_title", "start_date", "end_date", "is_part_time", "location", "description", "challenge") VALUES ('4', '2', 'Finance Intern', '2020-09-01', '2020-12-01', 't', 'Ithaca', ' Test stuff again 4', '3');

--Insert into PositionSkills
INSERT INTO "public"."PositionSkills" ("position", "skill") VALUES ('1', '1');
INSERT INTO "public"."PositionSkills" ("position", "skill") VALUES ('1', '2');
INSERT INTO "public"."PositionSkills" ("position", "skill") VALUES ('2', '1');
INSERT INTO "public"."PositionSkills" ("position", "skill") VALUES ('2', '2');
INSERT INTO "public"."PositionSkills" ("position", "skill") VALUES ('3', '4');
INSERT INTO "public"."PositionSkills" ("position", "skill") VALUES ('3', '7');
INSERT INTO "public"."PositionSkills" ("position", "skill") VALUES ('4', '6');
INSERT INTO "public"."PositionSkills" ("position", "skill") VALUES ('4', '7');
INSERT INTO "public"."PositionSkills" ("position", "skill") VALUES ('1', '5');
	""")

# close cursor
cur.close()

# to commit the changes to database
con.commit()

# close connection
con.close()


