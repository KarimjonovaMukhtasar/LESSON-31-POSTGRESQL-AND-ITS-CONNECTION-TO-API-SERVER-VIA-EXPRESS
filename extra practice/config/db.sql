-- Active: 1759236905510@@127.0.0.1@5432@comments
create database comments;

create table users(id serial primary key,
    username varchar(30),
    email varchar(30) unique,
    password varchar(20),
    age int);

create table comments(id serial primary key,
        text varchar(200),
        rating int,
        userId int REFERENCES users(id));