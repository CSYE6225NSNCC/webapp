#!/bin/bash

# Install MySQL Server
sudo apt-get update
sudo apt-get install -y mysql-server

# Secure MySQL installation
# Note: You may want to customize these commands as per your requirements
sudo mysql_secure_installation 



sudo mysql -e "ALTER USER 'root'@'${DB_HOST}' IDENTIFIED WITH mysql_native_password BY '${DB_PASSWORD}';"
# Create a new MySQL user and database
sudo mysql -e "CREATE DATABASE ${DB_NAME};"
sudo mysql -e "CREATE USER '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASSWORD}';"
sudo mysql -e "GRANT ALL PRIVILEGES ON mydatabase.* TO '${DB_USER}'@'${DB_HOST}';"
sudo mysql -e "FLUSH PRIVILEGES;"