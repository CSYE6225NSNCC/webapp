#!/bin/bash
# scripts/install.sh

# Update package lists
sudo apt-get update -y


# Install MySQL Server
sudo apt-get install -y nodejs npm unzip

# # Enable and start MySQL
# sudo systemctl enable mysql
# sudo systemctl start mysql

# Create the user and group csye6225 if they don't exist
sudo groupadd -f csye6225
sudo id -u csye6225 &>/dev/null || sudo useradd -m -g csye6225 -s /usr/sbin/nologin csye6225


# Install CloudWatch Agent
sudo apt-get install -y amazon-cloudwatch-agent

# Start and enable CloudWatch Agent
sudo systemctl start amazon-cloudwatch-agent
sudo systemctl enable amazon-cloudwatch-agent