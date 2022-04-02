#!/bin/bash

clear >$(tty)

# Check if the script is ran as root. Throw hands if it is.
if [ "$EUID" -e 0 ]; then
	echo -e "\e[31m - Please do not run this script as root.\e[0m"
	exit 3
fi

echo "Installing BrayanBot for Linux..."


npm install @tycrek/log fs-extra prompt js-yaml
# Ensure that ./Modules, ./Commands and ./Events exist.
mkdir -p ./Modules
mkdir -p ./Commands
mkdir -p ./Events
mkdir -p ./Addons
mkdir -p ./Addon_Configs


# Ensure that config.yml, lang.yml and commands.yml exist
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

# Builds the container (as per Dockerfile) and starts the container
docker-compose up -d && \

# Run setup within the container
docker-compose exec brayanbot npm run setup && \

# Restart the container when complete
docker-compose restart && \

# Done!
echo "BrayanBot is now installed for Linux."
echo "Run the following to view logs:"
echo "$ docker-compose logs -f --tail=50 --no-log-prefix brayanbot"