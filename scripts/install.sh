#!/bin/bash
# scripts/install.sh

# Update package lists
sudo apt-get update -y

# Install necessary packages
sudo apt-get install -y nodejs npm unzip

# Install the CloudWatch agent
sudo apt-get install -y amazon-cloudwatch-agent

# Create a CloudWatch agent configuration file
cat <<EoF > /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json
{
  "agent": {
    "metrics_collection_interval": 60,
    "run_as_user": "root"
  },
  "metrics": {
    "append_dimensions": {
      "InstanceId": "\${aws:InstanceId}",
      "Region": "${AWS_REGION}"  # AWS region should be set as an environment variable
    },
    "metrics_collected": {
      "cpu": {
        "measurement": [
          "usage_active"
        ],
        "metrics_collection_interval": 60
      },
      "disk": {
        "measurement": [
          "used_percent"
        ],
        "metrics_collection_interval": 60,
        "resources": [
          "*"
        ]
      }
    }
  }
}
EoF

# Start the CloudWatch agent
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -s -c file:/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json

# Create the user and group csye6225 if they don't exist
sudo groupadd -f csye6225
sudo id -u csye6225 &>/dev/null || sudo useradd -m -g csye6225 -s /usr/sbin/nologin csye6225
