#!/bin/bash
set -e

err_report() {
    echo "Error on line $1"
}

trap 'err_report $LINENO' ERR

echo "TRYING TO SETUP DATABASE"

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
  CREATE DATABASE spreact;
  CREATE ROLE demo SUPERUSER;
  ALTER USER demo WITH PASSWORD 'demo';
  ALTER ROLE "demo" WITH LOGIN;
  CREATE TABLE contact_details (uuid varchar(32), first_name varchar(16), last_name varchar (32), email varchar(32), phone_no varchar(16));

  CREATE DATABASE keycloak;
  CREATE ROLE keycloak SUPERUSER;
  ALTER USER keycloak WITH PASSWORD 'keycloak';
  ALTER ROLE "keycloak" WITH LOGIN;
EOSQL

echo "SETUP PHASE FINISHED"
echo "VALIDATION OF CONFIGS STARTED"

psql -v ON_ERROR_STOP=1 --username "demo" --dbname "spreact" <<-EOSQL
EOSQL

psql -v ON_ERROR_STOP=1 --username "keycloak" --dbname "keycloak" <<-EOSQL
EOSQL

echo "VALIDATION PASSED"