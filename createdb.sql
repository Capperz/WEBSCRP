DROP DATABASE IF EXISTS unitdb;

CREATE DATABASE unitdb;
use unitdb;

CREATE TABLE IF NOT EXISTS User ( 
     ID INT NOT NULL AUTO_INCREMENT,
     googleToken CHAR(21) UNIQUE NOT NULL,
     PRIMARY KEY (ID)
);

CREATE TABLE IF NOT EXISTS Unit (
  id INT NOT NULL AUTO_INCREMENT,
  unitname VARCHAR(30),
  userID INT NOT NULL,
  colour CHAR(7) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (userID) REFERENCES User(ID)
);

CREATE TABLE IF NOT EXISTS Week (
  id INT NOT NULL AUTO_INCREMENT,
  unitID INT NOT NULL,
  userID INT NOT NULL,
  weekDesc varchar(50) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (unitID) REFERENCES Unit(id),
  FOREIGN KEY (userID) REFERENCES User(ID)
);
