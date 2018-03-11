drop database if exists unitdb;

create database if not exists unitdb;

  create table if not exists unitdb.unit_list (
    id int auto_increment,
    unitname varchar(30),
    userid varchar(50) primary key
  );

  create table if not exists unitdb.unit_week (
   id int primary key auto_increment,
   userid varchar(50) not null,
   weekno int not null,
   FOREIGN KEY (userid) REFERENCES unit_list(userid)
  );


insert into unitdb.unit_list values(1, 'WEBSCRP', 'dummy data');
