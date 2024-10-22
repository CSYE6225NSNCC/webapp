#!/bin/bash
# scripts/install.sh

# Update package lists
sudo apt-get update -y


# Install MySQL Server
sudo apt-get install -y nodejs npm unzip

# # Enable and start MySQL
# sudo systemctl enable mysql
# sudo systemctl start mysql