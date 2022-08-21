--
-- Table: comments
--DROP TABLE "comments";
CREATE TABLE "comments" (
  "id" serial NOT NULL,
  "name" character varying(255),
  "email" character varying(255),
  "url" character varying(255),
  "comment" text,
  "created_at" timestamp,
  "article_id" smallint,
  PRIMARY KEY ("id")
);



--
-- Table: categories
--DROP TABLE "categories";
CREATE TABLE "categories" (
  "id" serial NOT NULL,
  "name" character varying(255),
  PRIMARY KEY ("id")
);



--
-- Table: users
--DROP TABLE "users";
CREATE TABLE "users" (
  "id" serial NOT NULL,
  "name" character varying(255),
  "password" character varying(255),
  "website" character varying(255),
  "email" character varying(255),
  "created_at" timestamp,
  PRIMARY KEY ("id")
);



--
-- Table: pages
--DROP TABLE "pages";
CREATE TABLE "pages" (
  "id" serial NOT NULL,
  "name" character varying(255),
  "body" text,
  "display_sidebar" smallint DEFAULT '1' NOT NULL,
  "display_in_drawer" smallint DEFAULT '1' NOT NULL,
  PRIMARY KEY ("id")
);



--
-- Table: blogs
--DROP TABLE "blogs";
CREATE TABLE "blogs" (
  "id" serial NOT NULL,
  "name" character varying(255),
  PRIMARY KEY ("id")
);



--
-- Table: links
--DROP TABLE "links";
CREATE TABLE "links" (
  "id" serial NOT NULL,
  "url" character varying(255),
  "name" character varying(255),
  "description" character varying(255),
  PRIMARY KEY ("id")
);



--
-- Table: blogs_users
--DROP TABLE "blogs_users";
CREATE TABLE "blogs_users" (
  "id" serial NOT NULL,
  "blog_id" smallint,
  "user_id" smallint,
  PRIMARY KEY ("id")
);



--
-- Table: categories_articles
--DROP TABLE "categories_articles";
CREATE TABLE "categories_articles" (
  "id" serial NOT NULL,
  "category_id" smallint,
  "article_id" smallint,
  PRIMARY KEY ("id")
);



--
-- Table: articles
--DROP TABLE "articles";
CREATE TABLE "articles" (
  "id" serial NOT NULL,
  "subject" character varying(255),
  "body" text,
  "created_at" timestamp,
  "user_id" smallint,
  PRIMARY KEY ("id")
);

--
-- Foreign Key Definitions
--

ALTER TABLE "comments" ADD FOREIGN KEY ("article_id")
  REFERENCES "articles" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "blogs_users" ADD FOREIGN KEY ("user_id")
  REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "blogs_users" ADD FOREIGN KEY ("blog_id")
  REFERENCES "blogs" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "categories_articles" ADD FOREIGN KEY ("article_id")
  REFERENCES "articles" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "categories_articles" ADD FOREIGN KEY ("category_id")
  REFERENCES "categories" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "articles" ADD FOREIGN KEY ("user_id")
  REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE;