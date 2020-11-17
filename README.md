# CharityBay API

## About

This is a RESTful API for an open marketplace web application. It allows users to interact with data about items, charities, users and categories. It also allows users to post images to an AWS S3 Bucket and trigger Nodemailer events. Built with express, knex, AWS SDK, Nodemailer and Multiparty, built atop a PostgreSQL database.

## Getting Started

Follow the instructions below to get a local version up and running.

### Requirements

You'll need to have the following installed on your machine:

- Node Package Manager
- Node.js
- The Git CLI

### Installation

1. First of all, (fork and) clone this repo.

```
$ git clone https://github.com/jonp2020/be-charity-bay
```

2. Navigate into the directory and install the required dependencies.

```
$ cd be-charity-bay
$ npm install
```

3. Get the app running on your machine.

```
$ npm start
```

4. This will start the server listening locally on port 9090.

5. Enjoy!

## Running the Tests

This app has been fully tested with Supertest and Jest. To run the tests, enter the following into the console

```
$ npm test
```

## Built Using

- Express
- Knex
- Node Postgres
- AWS SDK
- Nodemailer
- Multiparty
- Nodemon
