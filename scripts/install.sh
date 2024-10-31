#!/bin/bash
# scripts/install.sh

# Update package lists
sudo apt-get update -y

# Install prerequisites
sudo apt-get install -y software-properties-common

# Install CloudWatch Agent
curl -O https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i amazon-cloudwatch-agent.deb

#Clean up downloaded CWA
rm amazon-cloudwatch-agent.deb

# Install other required packages
sudo apt-get install -y nodejs npm unzip

# Create the user and group csye6225 if they don't exist
sudo groupadd -f csye6225
sudo id -u csye6225 &>/dev/null || sudo useradd -m -g csye6225 -s /usr/sbin/nologin csye6225


