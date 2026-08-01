# Description
This project is a sample bundling together react frontend module, spring backend and monitoring tools.

## Startup

In order to run the project manually startup each project:
* Spring ``./gradlew spring-backend:clean:build:bootRun``
* React ``npm install`` followed by ``npm run dev``
* Prometheus as per ``https://github.com/prometheus/prometheus``
* Keycloak instance as per ``https://www.keycloak.org/getting-started/getting-started-zip``
* Postgres as described in ``https://www.postgresql.org/docs/18/tutorial-start.html``

Alternatively you can use docker-compose to run containers bundled in root directory:
``docker-compose up .``
Notice that some of the connections are hardcoded to a specific IP address. It is likely that your bridge network will
be created on a different IP and those values might require realignment.

## Current status

* Spring project uses JPA to connect to postgres db
* Frontend allows only to look up records in DB via backend service (login needed; see below).
* To call any backend endpoints an Access Token is needed, That can be obtained from keycloak service:
  * by using user-agent to obtain access token and make direct requests to backend
  * using frontend as-is with all compulsory containers
* Repository includes postman collection which guides through login process and backend interactions.
* Monitoring currently includes only a simple error rate rule

## TODOs
* non-root container executions
* add missing monitoring
* add proper backend model hierarchy and sample microservices
* add terraform script for simple AWS deployment