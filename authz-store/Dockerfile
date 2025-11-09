FROM quay.io/keycloak/keycloak:26.4.1 AS builder

COPY ./runner.sh /opt/keycloak/
WORKDIR /opt/keycloak

RUN keytool -genkeypair -storepass password -storetype PKCS12 -keyalg RSA -keysize 2048 -dname "CN=server" -alias server -ext "SAN:c=DNS:localhost,IP:127.0.0.1" -keystore conf/server.keystore
RUN /opt/keycloak/bin/kc.sh build

FROM quay.io/keycloak/keycloak:26.4.1
COPY --from=builder /opt/keycloak/ /opt/keycloak/

COPY ./kc-spreact.json /opt/keycloak/data/import/

ENV KC_HOSTNAME=localhost
ENV KC_HTTP_PORT=8020
ENV KC_HOSTNAME_PORT=8030
ENV KC_HOSTNAME_STRICT_BACKCHANNEL="true"
ENV KEYCLOAK_ADMIN=sample-admin
ENV KEYCLOAK_ADMIN_PASSWORD=sample-pass
ENV KC_LOG_LEVEL: info
ENV KC_HEALTH_ENABLED=false
ENV KC_METRICS_ENABLED=false

EXPOSE 8020:8020
EXPOSE 8030:8030
ENTRYPOINT ["/opt/keycloak/runner.sh"]