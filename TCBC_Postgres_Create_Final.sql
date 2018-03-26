CREATE TABLE "users" (
  "id" serial NOT NULL,
  "password" varchar(255),
  "first_name" varchar(50) NOT NULL,
  "last_name" varchar(50) NOT NULL,
  "phone_1" varchar(25),
  "email" varchar(50),
  "role" int NOT NULL,
  "member_id" int,
  "goal" int,
  CONSTRAINT users_pk PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);


CREATE TABLE "rides" (
  "id" serial NOT NULL,
  "rides_name" varchar(50) NOT NULL,
  "rides_category" int NOT NULL,
  "rides_date" TIMESTAMP NOT NULL,
  "description" text NOT NULL,
  "ride_leader" int NOT NULL,
  "ride_location" text NOT NULL,
  "url" varchar(255),
  "approved" BOOLEAN NOT NULL DEFAULT 'false',
  "completed" BOOLEAN NOT NULL DEFAULT 'false',
  "cancelled" BOOLEAN NOT NULL DEFAULT 'false',
  CONSTRAINT rides_pk PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "user_roles" (
  "id" serial NOT NULL,
  "role" varchar(25) NOT NULL,
  CONSTRAINT user_roles_pk PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "rides_users" (
  "id" serial NOT NULL,
  "ride_id" int NOT NULL,
  "user_id" int NOT NULL,
  "actual_distance" int NOT NULL DEFAULT 0,
  "selected_distance" int NOT NULL,
  "checked_in" BOOLEAN NOT NULL DEFAULT 'false',
  "waiver_signed" BOOLEAN DEFAULT 'false',
  CONSTRAINT rides_users_pk PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "rides_distances" (
  "id" serial NOT NULL,
  "ride_id" int NOT NULL,
  "distance" int NOT NULL,
  CONSTRAINT rides_distances_pk PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "member_info" (
  "member_id" int NOT NULL,
  "membership_start" DATE ,
  "membership_expiration" DATE,
  "first_name" varchar(50) ,
  "middle_name" varchar(50),
  "last_name" varchar(50),
  "city" varchar(50),
  "state" varchar(50),
  "zip" varchar(50),
  "gender" varchar(10),
  "phone_1" varchar(25),
  "phone_2" varchar(25),
  "email" varchar(50),
  CONSTRAINT member_info_pk PRIMARY KEY ("member_id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" text,
	"name" text
	);







												-- Category Data --
												
INSERT INTO "public"."categories"("id", "type", "name") VALUES(1, 'A', 'Very Strenuous') RETURNING "id", "type", "name";
INSERT INTO "public"."categories"("id", "type", "name") VALUES(2, 'A/B', 'Strenuous') RETURNING "id", "type", "name";
INSERT INTO "public"."categories"("id", "type", "name") VALUES(3, 'B', 'Brisk') RETURNING "id", "type", "name";
INSERT INTO "public"."categories"("id", "type", "name") VALUES(4, 'B/C', 'Moderate') RETURNING "id", "type", "name";
INSERT INTO "public"."categories"("id", "type", "name") VALUES(5, 'C', 'Relaxed') RETURNING "id", "type", "name";
INSERT INTO "public"."categories"("id", "type", "name") VALUES(6, 'MB-A', 'Members Only') RETURNING "id", "type", "name";
INSERT INTO "public"."categories"("id", "type", "name") VALUES(7, 'MB-AB', 'Members Only') RETURNING "id", "type", "name";
INSERT INTO "public"."categories"("id", "type", "name") VALUES(8, 'MB-B', 'Members Only') RETURNING "id", "type", "name";
INSERT INTO "public"."categories"("id", "type", "name") VALUES(9, 'MB-C', 'Members Only') RETURNING "id", "type", "name";
INSERT INTO "public"."categories"("id", "type", "name") VALUES(10, 'N-A', 'Night') RETURNING "id", "type", "name";
INSERT INTO "public"."categories"("id", "type", "name") VALUES(11, 'N-A/B', 'Night') RETURNING "id", "type", "name";
INSERT INTO "public"."categories"("id", "type", "name") VALUES(12, 'N-B', 'Night') RETURNING "id", "type", "name";
INSERT INTO "public"."categories"("id", "type", "name") VALUES(13, 'N-B/C', 'Night') RETURNING "id", "type", "name";
INSERT INTO "public"."categories"("id", "type", "name") VALUES(14, 'N-C', 'Night') RETURNING "id", "type", "name";
INSERT INTO "public"."categories"("id", "type", "name") VALUES(15, 'O', 'Outreach') RETURNING "id", "type", "name";



 -- ROLE DATA --
INSERT INTO "public"."user_roles"("id", "role") VALUES(1, 'Member') RETURNING "id", "role";
INSERT INTO "public"."user_roles"("id", "role") VALUES(2, 'Ride Leader') RETURNING "id", "role";
INSERT INTO "public"."user_roles"("id", "role") VALUES(3, 'Ride Admin') RETURNING "id", "role";
INSERT INTO "public"."user_roles"("id", "role") VALUES(4, 'Guest') RETURNING "id", "role";










											-- Foreign Key Restraints --

ALTER TABLE "rides_users" ADD UNIQUE ("ride_id", "user_id");
ALTER TABLE "users" ADD CONSTRAINT "users_fk0" FOREIGN KEY ("role") REFERENCES "user_roles"("id");
ALTER TABLE "users" ADD CONSTRAINT "users_fk1" FOREIGN KEY ("member_id") REFERENCES "member_info"("member_id");
ALTER TABLE "rides" ADD CONSTRAINT "rides_fk0" FOREIGN KEY ("ride_leader") REFERENCES "users"("id");
ALTER TABLE "rides" ADD CONSTRAINT "rides_fk1" FOREIGN KEY ("rides_category") REFERENCES "categories"("id");
ALTER TABLE "rides_users" ADD CONSTRAINT "rides_users_fk0" FOREIGN KEY ("ride_id") REFERENCES "rides"("id");
ALTER TABLE "rides_users" ADD CONSTRAINT "rides_users_fk1" FOREIGN KEY ("user_id") REFERENCES "users"("id");
ALTER TABLE "rides_users" ADD CONSTRAINT "rides_users_fk2" FOREIGN KEY ("selected_distance") REFERENCES "rides_distances"("id");
ALTER TABLE "rides_distances" ADD CONSTRAINT "rides_distances_fk0" FOREIGN KEY ("ride_id") REFERENCES "rides"("id");
ALTER TABLE "public"."rides"
  ADD COLUMN "rides_category" integer,
  ADD FOREIGN KEY ("rides_category") REFERENCES "public"."categories"("id");
  


															-- TEST DATA --

INSERT INTO "public"."users"("id", "password", "first_name", "last_name", "email", "role", "member_id") VALUES(2, '$2a$10$qpFIlkXr.0TJZinWkjIBW.X3tjCipOlSUb6YFWpvzOOeOyqy3OoFK', 'RideLeader', 'Skywalker', 'test.email@gmail.com', 2, 11111) RETURNING "id", "password", "first_name", "last_name", "phone_1", "email", "role", "member_id";


SELECT * FROM categories;

SELECT * FROM rides;


SELECT rides.id AS ride_id, array_agg(rides_distances.distance) AS ride_distance, array_agg(rides_distance.id) AS ride_distance_id,
rides.rides_name,rides.rides_date,rides.description,rides.url,rides.ride_location, users.first_name,users.last_name,users.email,users.phone_1,categories.type,categories.name
FROM rides
JOIN rides_distances on rides.id = rides_distances.ride_id
JOIN users on rides.ride_leader = users.id
JOIN categories on rides.rides_category = categories.id
GROUP BY rides.id;



 --  Get all Rides and associated Data --

SELECT rides.id AS ride_id, array_agg(rides_distances.distance) AS ride_distance, array_agg(rides_distances.id) AS ride_distance_id, rides.rides_name,rides.rides_date,rides.description,rides.url,rides.ride_location, rides.ride_leader, users.first_name, users.last_name,users.phone_1,users.email
FROM rides 
JOIN rides_distances on rides.id = rides_distances.ride_id
JOIN users on rides.ride_leader = users.id
GROUP BY rides.id, users.first_name, users.last_name, users.phone_1,users.email;

 
 --  Adding more information in Categories table --
ALTER TABLE categories
ADD COLUMN 	category_description text,
ADD COLUMN 	notes varchar(100),
ADD COLUMN riders_must_have text,
ADD COLUMN rest_stops varchar(50),
ADD COLUMN ride_leader_notes varchar(50);

UPDATE categories SET
category_description = 'Fast Paced, most difficult terrain, or longer distance', 
notes = '17+ mph',
riders_must_have = 'Advanced cycling skills; spare tube, patch kit, pump',
rest_stops = 'At leader’s discretion',
ride_leader_notes = 'Anywhere'
WHERE id = 1;

UPDATE categories SET
category_description = 'Swift, more difficult terrain, or long distance', 
notes = '15-17 mph',
riders_must_have = 'Intermediate to advanced cycling skills; spare tube, patch kit, pump',
rest_stops = 'About every 20-30 miles',
ride_leader_notes = 'Anywhere'
WHERE id = 2;

UPDATE categories SET
category_description = 'Social, but emphasis is on riding - A good choice for experienced group riders - generally intermediate or greater pace, terrain and distance', 
notes = '13-15 mph',
riders_must_have = 'Intermediate to more advanced cycling skills; spare tube, patch kit, pump',
rest_stops = 'About every 15-20 miles',
ride_leader_notes = 'With group at the published pace'
WHERE id = 3;

UPDATE categories SET
category_description = 'Social emphasis, but for those with riding experience - generally intermediate pace, terrain and distance', 
notes = '11-13 mph',
riders_must_have = 'Intermediate cycling skills; spare tube, patch kit, pump',
rest_stops = 'About every 10-15 miles',
ride_leader_notes = 'With group at the published pace'
WHERE id = 4;

UPDATE categories SET
category_description = 'Easier, for a more “laid-back” time, perfect for newer riders, slower pace and flatter terrain, shorter distance', 
notes = '9-11 mph',
riders_must_have = 'Entry level to intermediate cycling skills; spare tube, patch kit, pump',
rest_stops = 'About every 10-15 miles',
ride_leader_notes = 'With group at the published pace'
WHERE id = 5;

UPDATE categories SET
category_description = 'Very Strenuous, Safety stressed, advanced riding skills stressed.', 
notes = '45 miles',
riders_must_have = 'Expert level bike handling and group riding skills. Spare tube, patch kit, pump. Front and rear fully charged cycling lights, reflective clothing, and smartphone and/or GPS to aid navigation in case of being dropped from group.',
rest_stops = 'At Leader’s Discretion',
ride_leader_notes = '2 Ride Leaders Recommended Ride Anywhere'
WHERE id = 6;

UPDATE categories SET
category_description = 'Strenouous, social, safety stressed, stay together ride.', 
notes = '40 miles',
riders_must_have = 'Advanced level bike handling and group riding skills. Spare tube, patch kit, pump. Front and rear fully charged cycling lights and reflective clothing.',
rest_stops = 'About every 20 miles',
ride_leader_notes = '2 Ride Leaders Required'
WHERE id = 7;

UPDATE categories SET
category_description = 'Brisk, social, safety stressed, stay together ride.', 
notes = '35 miles',
riders_must_have = 'Intermediate to advanced level bike handling and group riding skills. Spare tube, patch kit, pump. Front and rear fully charged cycling lights and reflective clothing.',
rest_stops = 'About every 15-20 miles',
ride_leader_notes = '2 Ride Leaders Required'
WHERE id = 8;

UPDATE categories SET
category_description = 'Moderate, social, safety stressed, stay together ride.', 
notes = '30 miles',
riders_must_have = 'Intermediate level bike handling and group riding skills. Spare tube, patch kit, pump. Front and rear fully charged cycling lights and reflective clothing.',
rest_stops = 'About every 15 miles',
ride_leader_notes = '2 Ride Leaders Required'
WHERE id = 9;

UPDATE categories SET
category_description = 'Relaxed, social, safety stressed, stay together ride.', 
notes = '25 miles',
riders_must_have = 'Entry level to intermediate bike handling and group riding skills. Spare tube, patch kit, pump. Front and rear fully charged cycling lights and reflective clothing.',
rest_stops = 'About every 10-15 miles',
ride_leader_notes = '2 Ride Leaders Required'
WHERE id = 10;

UPDATE categories SET
category_description = 'High Speed, no time limit', 
notes = 'Difficult dirt trails, roots, rocks, many difficult hills, technically very difficult',
riders_must_have = 'Advanced MB skills; spare tube, patch kit, pump, chain tool, water',
rest_stops = 'At group or rider’s discretion',
ride_leader_notes = 'Anywhere'
WHERE id = 11;

UPDATE categories SET
category_description = 'Rapid, less than 6 hours', 
notes = 'Challenging dirt trails or roads, roots, rocks, many hills, technically quite difficult',
riders_must_have = 'Advanced MB skills; spare tube, patch kit, pump, water',
rest_stops = 'At least 1 time each hour',
ride_leader_notes = 'Anywhere'
WHERE id = 12;

UPDATE categories SET
category_description = 'Moderate, less than 4 hours', 
notes = 'Gravel or dirt trails or roads, some hills, technically moderate',
riders_must_have = 'Intermediate MB skills; spare tube, patch kit, pump, water',
rest_stops = 'At least 1 or 2 times each hour',
ride_leader_notes = 'With the group - riders regroup occasionally'
WHERE id = 13;

UPDATE categories SET
category_description = 'Slower, less than 2 hours', 
notes = 'Gravel or dirt trails or roads, few hills, technically simple',
riders_must_have = 'Beginner MB skills; spare tube, patch kit, water',
rest_stops = '2 or more times each hour',
ride_leader_notes = 'With the group - riders regroup occasionally'
WHERE id = 14;

UPDATE categories
SET category_description = 'These special category rides are non-TCBC rides that are eligible for TCBC mileage credit, but are not covered by TCBC insurance. Outreach rides are designed to increase our clubs visibility in and support of non-pledge biking events in the broader biking community. A TCBC ride leader will be present at qualifying Outreach Rides to allow members to sign up for mileage, but it is the sole responsibility of participating members to sign up for the event and pay the registration fee. The organizers of the event are solely responsible for its quality and safety. Members are strongly encouraged to wear their TCBC jerseys when participating in Outreach Rides and ride in a manner that reflects favorably upon TCBC.'
WHERE id = 15;