CREATE DATABASE DB_APIMADRID;
USE DB_APIMADRID;

CREATE TABLE RESTAURANT(
    Id char(36),
    Email varchar(50),
    Name varchar (30),
    Address varchar(50),
    constraint PK_Rol PRIMARY KEY (Id),
    UNIQUE (Email) 
);
