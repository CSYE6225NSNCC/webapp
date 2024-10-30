#!/bin/bash
# scripts/install.sh

# Update package lists
sudo apt-get update -y

# Install prerequisites
sudo apt-get install -y software-properties-common

# Add the Amazon CloudWatch Agent repository
sudo add-apt-repository "deb https://apt.us-east-1.amazonaws.com/ubuntu/ $(lsb_release -cs) main"

# Update the package lists again after adding the repository
sudo apt-get update -y

# Install CloudWatch Agent
sudo apt-get install -y amazon-cloudwatch-agent

# Install other required packages
sudo apt-get install -y nodejs npm unzip

# Create the user and group csye6225 if they don't exist
sudo groupadd -f csye6225
sudo id -u csye6225 &>/dev/null || sudo useradd -m -g csye6225 -s /usr/sbin/nologin csye6225

# Enable and start CloudWatch Agent
sudo systemctl enable amazon-cloudwatch-agent
sudo systemctl start amazon-cloudwatch-agent
