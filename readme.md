Backend Setup Guide

This guide explains how to setup the backend after cloning it from GitHub. The backend is built with Node.js, Express, MySQL database, and Prisma ORM.

Requirements
Before you can setup the backend, make sure you have the following requirements installed:

Node.js (version 14 or higher)
MySQL database, Prisma CLI


Installation
Clone the repository using the following command:
git clone https://github.com/Rayan42/internHUB


Install the required dependencies using npm:
in vscode terminal
cd server
npm install

in .env file make sure the database url point to your server. the followin url should work fine
Copy code
DATABASE_URL="mysql://root:@localhost:3306/internhub"



got to phpmyAdmin and make sure you create a database called internhub
after creating the database you can create the tables from prisma models using the following command:
npx prisma migrate dev
then run:
npx prisma generate or prisma generate

Start the backend server with the following command (make sure mysql server is running):
npm run dev

with this steps you cann access all the routes and backend apis


FOR frontend:
just open vscode terminal

go to client folder using : cd client

install packages using : npm install

start front end dev server using command: npm run dev 
