FROM postgres
#predefined location for customisation scripts
ADD configure.sh /docker-entrypoint-initdb.d/

EXPOSE 5432:5432

ENV POSTGRES_USER=demo
ENV POSTGRES_PASSWORD=demo
ENV POSTGRES_DB=spreact
