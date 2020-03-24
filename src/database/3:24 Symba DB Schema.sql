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
  "description" varchar(1000)
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
