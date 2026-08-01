#!/bin/bash
#set -e

err_report() {
    echo "Error on line $1"
}

trap 'err_report $LINENO' ERR

echo "TRYING TO SETUP DATABASE"

su postgres -c "CREATE DATABASE spreact;"
su postgres -c "CREATE ROLE demo SUPERUSER;"
su postgres -c "ALTER USER demo WITH PASSWORD 'demo';"
su postgres -c "CREATE TABLE contact_details (uuid varchar(32), first_name varchar(16), last_name varchar (32), email varchar(32), phone_no varchar(16));"
su postgres -c "INSERT INTO contact_details (33, Tom, Smith, ts1@example.com, 0697440274);"

echo "SETUP PHASE FINISHED"