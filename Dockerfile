FROM node:14
RUN apt update && apt install -y zip && rm -rf /var/lib/apt/lists/*
