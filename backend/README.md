# Backend Usage Guide

Go to `backend` folder:

## Project Setup

```sh
npm install
```

## DB connection

The backend uses MySQL. The connection is configured via individual variables in the root  of the project `.env` file:

```sh
DB_HOST=localhost
DB_DATABASE=db_todoapp
DB_USER=app_user
DB_PASSWORD=app_password
DB_PORT=3306
```

`DB_URL` can still be set directly to override the individual variables if needed.

## Run and Hot-Reload for Development

```sh
npm run start
```

For testing the frontend a custom route `/test/reset` is necessary to cleanup the DB before each test.
To active such route, start the backend with:

```sh
npm run start:e2e
```
