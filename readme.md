# Description
This project is a sample bundling together react frontend module, spring backend and monitoring tools.

## Startup
In order to run the project either manually startup each project:
* Spring ``./gradlew spring-backend:clean:build:bootRun``
* React ``npm install`` followed by ``npm run dev``
* Prometheus as per ``https://github.com/prometheus/prometheus``

Alternatively you can use docker-compose to run containers bundled in root directory:
``docker-compose up .``

## Current status
* Spring project uses JPA to connect to H2 (in embedded mode) in memory DB
* Frontend allows only to look up records in DB, other interactions need to be facilitated through direct http calls
* Monitoring currently includes only a simple error rate rule

## TODOs
* non-root container executions
* add missing frontend functionality
* add missing error handling and unhappy paths
* add missing monitoring
* add backend authZ