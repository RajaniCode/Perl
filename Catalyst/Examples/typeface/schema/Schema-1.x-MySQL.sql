-- 
-- Created by SQL::Translator::Producer::MySQL
-- Created on Wed Nov 15 10:51:53 2006
-- 
SET foreign_key_checks=0;

--
-- Table: comments
--
DROP TABLE IF EXISTS comments;
CREATE TABLE comments (
  id integer NOT NULL auto_increment,
  name character varying(255),
  email character varying(255),
  url character varying(255),
  comment text,
  created_at datetime,
  article_id integer(4),
  INDEX (id),
  INDEX (article_id),
  PRIMARY KEY (id),
  CONSTRAINT comments_fk_article_id FOREIGN KEY (article_id) REFERENCES articles (id) ON DELETE CASCADE ON UPDATE CASCADE
) Type=InnoDB;

--
-- Table: categories
--
DROP TABLE IF EXISTS categories;
CREATE TABLE categories (
  id integer NOT NULL auto_increment,
  name character varying(255),
  INDEX (id),
  PRIMARY KEY (id)
) Type=InnoDB;

--
-- Table: users
--
DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id integer NOT NULL auto_increment,
  name character varying(255),
  password character varying(255),
  website character varying(255),
  email character varying(255),
  created_at datetime,
  INDEX (id),
  PRIMARY KEY (id)
) Type=InnoDB;

--
-- Table: pages
--
DROP TABLE IF EXISTS pages;
CREATE TABLE pages (
  id integer NOT NULL auto_increment,
  name character varying(255),
  body text,
  display_sidebar smallint NOT NULL DEFAULT '1',
  display_in_drawer smallint NOT NULL DEFAULT '1',
  INDEX (id),
  PRIMARY KEY (id)
);

--
-- Table: blogs
--
DROP TABLE IF EXISTS blogs;
CREATE TABLE blogs (
  id integer NOT NULL auto_increment,
  name character varying(255),
  INDEX (id),
  PRIMARY KEY (id)
) Type=InnoDB;

--
-- Table: links
--
DROP TABLE IF EXISTS links;
CREATE TABLE links (
  id integer NOT NULL auto_increment,
  url character varying(255),
  name character varying(255),
  description character varying(255),
  INDEX (id),
  PRIMARY KEY (id)
);

--
-- Table: blogs_users
--
DROP TABLE IF EXISTS blogs_users;
CREATE TABLE blogs_users (
  id integer NOT NULL auto_increment,
  blog_id integer(4),
  user_id integer(4),
  INDEX (id),
  INDEX (user_id),
  INDEX (blog_id),
  PRIMARY KEY (id),
  CONSTRAINT blogs_users_fk_user_id FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT blogs_users_fk_blog_id FOREIGN KEY (blog_id) REFERENCES blogs (id) ON DELETE CASCADE ON UPDATE CASCADE
) Type=InnoDB;

--
-- Table: categories_articles
--
DROP TABLE IF EXISTS categories_articles;
CREATE TABLE categories_articles (
  id integer NOT NULL auto_increment,
  category_id integer(4),
  article_id integer(4),
  INDEX (id),
  INDEX (article_id),
  INDEX (category_id),
  PRIMARY KEY (id),
  CONSTRAINT categories_articles_fk_article_id FOREIGN KEY (article_id) REFERENCES articles (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT categories_articles_fk_category_id FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE ON UPDATE CASCADE
) Type=InnoDB;

--
-- Table: articles
--
DROP TABLE IF EXISTS articles;
CREATE TABLE articles (
  id integer NOT NULL auto_increment,
  subject character varying(255),
  body text,
  created_at datetime,
  user_id integer(4),
  INDEX (id),
  INDEX (user_id),
  PRIMARY KEY (id),
  CONSTRAINT articles_fk_user_id FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
) Type=InnoDB;

SET foreign_key_checks=1;

