-- 
-- Created by SQL::Translator::Producer::SQLite
-- Created on Wed Nov 15 10:51:53 2006
-- 
BEGIN TRANSACTION;


--
-- Table: comments
--
DROP TABLE comments;
CREATE TABLE comments (
  id INTEGER PRIMARY KEY NOT NULL,
  name character varying(255),
  email character varying(255),
  url character varying(255),
  comment text,
  created_at datetime,
  article_id integer(4)
);


--
-- Table: categories
--
DROP TABLE categories;
CREATE TABLE categories (
  id INTEGER PRIMARY KEY NOT NULL,
  name character varying(255)
);


--
-- Table: users
--
DROP TABLE users;
CREATE TABLE users (
  id INTEGER PRIMARY KEY NOT NULL,
  name character varying(255),
  password character varying(255),
  website character varying(255),
  email character varying(255),
  created_at datetime
);


--
-- Table: pages
--
DROP TABLE pages;
CREATE TABLE pages (
  id INTEGER PRIMARY KEY NOT NULL,
  name character varying(255),
  body text,
  display_sidebar smallint NOT NULL DEFAULT '1',
  display_in_drawer smallint NOT NULL DEFAULT '1'
);


--
-- Table: blogs
--
DROP TABLE blogs;
CREATE TABLE blogs (
  id INTEGER PRIMARY KEY NOT NULL,
  name character varying(255)
);


--
-- Table: links
--
DROP TABLE links;
CREATE TABLE links (
  id INTEGER PRIMARY KEY NOT NULL,
  url character varying(255),
  name character varying(255),
  description character varying(255)
);


--
-- Table: blogs_users
--
DROP TABLE blogs_users;
CREATE TABLE blogs_users (
  id INTEGER PRIMARY KEY NOT NULL,
  blog_id integer(4),
  user_id integer(4)
);


--
-- Table: categories_articles
--
DROP TABLE categories_articles;
CREATE TABLE categories_articles (
  id INTEGER PRIMARY KEY NOT NULL,
  category_id integer(4),
  article_id integer(4)
);


--
-- Table: articles
--
DROP TABLE articles;
CREATE TABLE articles (
  id INTEGER PRIMARY KEY NOT NULL,
  subject character varying(255),
  body text,
  created_at datetime,
  user_id integer(4)
);


COMMIT;
