CREATE TABLE quizzes(
  id INTEGER PRIMARY KEY  , 
  name  TEXT
);

CREATE TABLE quizmodules(
  id INTEGER PRIMARY KEY,
  name TEXT,
  quiz INTEGER,
  questions TEXT,
  modules integer
);
  
CREATE TABLE modules(
  id INTEGER PRIMARY KEY,
  name TEXT
);

CREATE TABLE participants(
  id  INTEGER PRIMARY KEY  , 
   name  TEXT,
   quiz  INTEGER ,
   score  INTEGER, 
   totalscore INTEGER
);

  
