# Docker Services

To run this application, you need the MySQL service.

## MySQL with Docker Compose

A `docker-compose.yaml` is provided to spin up a MySQL container.

### 1. Configure `.env`

Create a `.env` file at the root of the project with the following variables:

```sh
DB_HOST=localhost
DB_DATABASE=db_todoapp
DB_USER=app_user
DB_PASSWORD=app_password
DB_PORT=3306
```

> These variables are used both by `docker-compose.yaml` and by the backend.

### 2. Start the container

```sh
docker compose up -d
```

### 3. Stop the container

```sh
docker compose down
```