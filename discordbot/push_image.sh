#!/bin/bash

docker build -t rutkai/napipatrik-discordbot:latest .
docker push rutkai/napipatrik-discordbot:latest

# docker run --name napipatrik-discordbot -e DISCORD_BOT_TOKEN=very-top-secret-token --restart unless-stopped discordbot
