#FROM eclipse-temurin:21-jdk-jammy as deps
FROM openjdk:21

#RUN TODO: add user group not to run as root

CMD ./gradlew spring-backend:clean:bootJar

WORKDIR /reactive-spring

COPY build/libs/spring-backend-1.0-SNAPSHOT.jar app.jar

EXPOSE 8080:8080
EXPOSE 8071:8071
ENTRYPOINT ["java", "-jar", "app.jar", "--spring.profiles.active=dev"]
