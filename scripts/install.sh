#!/bin/bash
# scripts/install.sh

# Update package lists
sudo apt-get update


# Install MySQL Server
sudo apt-get install -y mysql-server

# Install Node.js and npm
sudo apt-get install -y curl
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash - # For Node.js 16.x
sudo apt-get install nodejs -y

# Enable and start MySQL
sudo systemctl enable mysql
sudo systemctl start mysql