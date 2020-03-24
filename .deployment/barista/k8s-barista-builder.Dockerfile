ARG NODE_VERSION=12
# Will be set on Jenkins
ARG DOCKER_REGISTRY

FROM ${DOCKER_REGISTRY}/library/jenkins-slave-cluster-docker-image:5.2

LABEL maintainer="Dynatrace DesignOps Team <designops@dynatrace.com>" \
      description="This image is used as build agent for our Jenkins build"

USER root
ARG NODE_VERSION

RUN  curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash - \
  && apt-get update \
  && apt-get install -y libgtk-3-0 libasound2 libxss1 nodejs pv \
  && apt-get clean \
  && npm install -g n \
  && n ${NODE_VERSION} \
  && npm -v \
  && node -v

WORKDIR /home/dynatrace

COPY --from=designops/workspace-base:latest /dynatrace/ ./
