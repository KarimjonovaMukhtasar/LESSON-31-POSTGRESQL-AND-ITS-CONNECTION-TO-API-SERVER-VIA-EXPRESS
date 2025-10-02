-- Active: 1759236905510@@127.0.0.1@5432@super_blog
create database super_blog;
create table users(id serial primary key,
    first_name varchar not null,
    email varchar not null,
    last_name varchar not null,
    password varchar not null,
    phone_number varchar not null,
    address varchar not null);
create table posts(id serial primary key,
        title varchar not null,
        content text not null,
        slug varchar not null UNIQUE,
        user_id int REFERENCES users(id));
create table comments(id serial primary key,
        content text not null,
        post_id int REFERENCES posts(id),
        user_id int REFERENCES users(id),
        created_at TIMESTAMP not null DEFAULT now());