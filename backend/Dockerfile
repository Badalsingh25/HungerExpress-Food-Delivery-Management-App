# ---------- Build stage ----------
FROM maven:3.9-eclipse-temurin-17 AS build

# Work inside the backend app directory
WORKDIR /app

# Copy Maven descriptor and download dependencies first (better caching)
COPY pom.xml ./
RUN mvn -q dependency:go-offline

# Copy the source code and build the jar
COPY src ./src
RUN mvn -q clean package -DskipTests

# ---------- Run stage ----------
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy the built jar from the build stage
COPY --from=build /app/target/*.jar app.jar

# Render provides PORT; our Spring config reads server.port from ${PORT}
ENV PORT=8080
EXPOSE 8080

# Use prod profile in container (application-prod.yml)
ENTRYPOINT ["java","-jar","app.jar","--spring.profiles.active=prod"]
