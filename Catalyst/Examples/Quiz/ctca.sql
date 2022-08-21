CREATE TABLE ctca_questions(
 id  INTEGER PRIMARY KEY ,
 question  TEXT,
 correct  INTEGER
); 

CREATE TABLE ctca_choices(
  id  INTEGER PRIMARY KEY  , 
  choices  TEXT,
  question  INTEGER 
);


