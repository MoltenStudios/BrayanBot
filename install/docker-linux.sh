#!/bin/bash

echo "Installing BrayanBot for Linux..."

# Ensure that ./Modules, ./Commands and ./Events exist.
mkdir -p ./Modules
mkdir -p ./Commands
mkdir -p ./Events


# Ensure that onfig.yml, lang.yml and commands.yml exist
for value in config.yml lang.yml commands.yml
do
	if [ ! -f $value ]; then
		touch $value
	fi
done

# Wait for a confirmation
echo "This script will run docker-compose. Do you wish to continue? (Press CTRL+C to continue)"
read -n 1 -s -r -p "Press any key to continue..."

echo Setting up...

# docker-compose up -d
docker-compose up -d && \

# Run setup within the container
docker-compose exec brayanbot npm run setup && \

# Restart the container when complete
docker-compose restart && \

# Done!
echo "BrayanBot is now installed for Linux."
echo "Run the following to view commands:"
echo "$ docker-compose logs -f --tail=50 --no-log-prefix brayanbot"