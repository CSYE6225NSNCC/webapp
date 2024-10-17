sudo mkdir -p /opt/webapp
sudo cp -r /tmp/webapp/. /opt/webapp/
sudo chown -R csye6225:csye6225 /opt/webapp

# Change directory to webapp and install npm dependencies
cd /opt/webapp
if [ -f "package.json" ]; then
    sudo -u csye6225 npm install
else
    echo "package.json not found. Skipping npm install."
fi

# Copy the service file and set permissions
SERVICE_FILE="/tmp/webapp/config/webapp.service"
if [ -f "$SERVICE_FILE" ]; then
    sudo cp "$SERVICE_FILE" /etc/systemd/system/webapp.service
    sudo chown root:root /etc/systemd/system/webapp.service
else
    echo "Service file not found at $SERVICE_FILE. Exiting."
    exit 1
fi

# Create environment variable file for the web application
sudo bash -c "cat <<EOF > /etc/webapp.env
DB_HOST='${DB_HOST}'
DB_NAME='${DB_NAME}'
DB_USER='${DB_USER}'
DB_PASSWORD='${DB_PASSWORD}'
EOF"

sudo chmod 600 /etc/webapp.env
sudo chown root:root /etc/webapp.env

# Create directory /app if not exists
sudo mkdir -p /app
sudo chown csye6225:csye6225 /app

# Reload systemd and enable/start the service
sudo systemctl daemon-reload

if sudo systemctl enable webapp.service; then
    echo "Service enabled successfully."
else
    echo "Failed to enable webapp.service. Exiting."
    exit 1
fi

if sudo systemctl start webapp.service; then
    echo "Service started successfully."
else
    echo "Failed to start webapp.service. Exiting."
    e
xit 1
fi