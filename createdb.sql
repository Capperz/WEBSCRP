drop database if exists unitdb;

create database if not exists unitdb;

  create table if not exists unitdb.unit_list (
    id int primary key auto_increment,
    unitname varchar(30),
    userid varchar(100)
  );


insert into unitdb.unit_list values(1, 'WEBSCRP', 'dummy data');
