# Description
This project is a sample bundling together react frontend module, spring backend and monitoring tools.

## Startup

In order to run the project manually startup each project:
* Spring ``./gradlew spring-backend:clean:build:bootRun``
* React ``npm install`` followed by ``npm run dev``
* Prometheus as per ``https://github.com/prometheus/prometheus``
* Keycloak instance as per ``https://www.keycloak.org/getting-started/getting-started-zip``
  * suggested command for running keycloak is:
    ``[keycloak-root-directory]/bin/kc.sh start-dev --http-port 8020 --metrics-enabled=true --event-metrics-user-enabled=true --event-metrics-user-tags=realm,idp,clientId``
* required DB (default configured as postgresql) run either as provided container or service as per its own instructions
  * expected table is called ``contact_details`` and needs to match ContactDetails schema
* in order to enable kafka messaging in services profile ``kafka-msg`` needs to be active

Alternatively you can use docker-compose to run containers bundled in root directory:
``docker-compose up .``

In order to use OAuth2 authorization it is necessary to start Keycloak service or container with predefined realm as in
./authz-store/docker-compose.yml.

## Current status

* Spring project uses JPA to connect to postgresql database
* Frontend allows only to look up records in DB via backend service (login needed; see below).
* To call any backend endpoints an Access Token is needed, That can be obtained from keycloak service:
  * by using user-agent to obtain access token and make direct requests to backend
  * using frontend as-is with compulsory containers
* Repository includes postman collection which guides through login process and backend interactions.
* Monitoring currently includes only a simple error rate rule

## Known backend issues
* first insertion intermittently causes issues if it overlaps with already existing UUID
* healthcheck test stopped working since update to spring boot 4

## TODOs
* non-root container executions
* add missing monitoring (alerts and alertmanager left)
* add proper backend model hierarchy and sample microservices
* add terraform script for simple AWS deployment
* replace h2 db with something more reasonable
* add missing resources for k8s deployments
* update proxy to work as direct gateway to backend via mTLS protected connection