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

 # Create CloudWatch Agent configuration file
 sudo mkdir -p /opt/aws/amazon-cloudwatch-agent/etc/
 
cat << 'EOF' | sudo tee /opt/aws/amazon-cloudwatch-agent/etc/cwagent-config.json
{
    "agent": {
        "metrics_collection_interval": 10,
        "logfile":"/var/log/amazon-cloudwatch-agent.log"
    },
    "logs": {
        "logs_collected": {
            "files": {
                "collect_list": [
                 {
                    "file_path": "/var/log/syslog",
                    "log_group_name": "syslog",
                    "log_stream_name": "webapp"
                 }
                ]
            }
        }
    },
    "metrics": {
        "metrics_collected": {
            "statsd":{
                "service_address":":8125",
                "metrics_collection_interval":60,
                "metrics_aggregation_interval":300
            }
        }
    }
}
EOF

# Create the user and group csye6225 if they don't exist
sudo groupadd -f csye6225
sudo id -u csye6225 &>/dev/null || sudo useradd -m -g csye6225 -s /usr/sbin/nologin csye6225

sudo chown -R csye6225:csye6225 /opt/aws/amazon-cloudwatch-agent/etc
sudo chmod 775 /opt/aws/amazon-cloudwatch-agent/etc 