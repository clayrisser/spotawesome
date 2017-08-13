############################################################
# Dockerfile to run jamrizzi/spotawesome-api
# Based on Alpine
############################################################

FROM alpine:3.5

MAINTAINER Jam Risser (jamrizzi)

EXPOSE 8806

ENV PORT=8806
ENV HOST=0.0.0.0
ENV DEBUG=false
ENV DATABASE_DRIVER=sqlite
ENV DATABASE_FILE=/data/api.db
ENV JWT_SECRET=hellodocker
ENV JWT_EXP=604800
ENV JWT_DOMAIN=""
ENV JWT_SECURE=false
ENV LOG_FILE=/var/log/spotawesome.log
ENV LOG_LEVEL=info

WORKDIR /app/

RUN apk add --no-cache \
        build-base \
        postgresql-dev \
        py-pip \
        python \
        python-dev \
        tini && \
    pip install --upgrade pip

COPY ./requirements.txt /app/requirements.txt
RUN pip install -r requirements.txt
COPY ./ /app/

ENTRYPOINT ["/sbin/tini", "--", "python", "server.py"]
