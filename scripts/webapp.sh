sudo mkdir -p /opt/webapp
sudo cp -r /tmp/webapp/. /opt/webapp/
sudo chown -R csye6225:csye6225 /opt/webapp

cd /opt/webapp/
sudo -u csye6225 npm install

sudo cp /tmp/webapp/config/webapp.service /etc/systemd/system/
sudo chown root:root /etc/systemd/system/webapp.service

sudo bash -c cat <<EOF>/etc/webapp.env
DB_HOST='${DB_HOST}'
DB_USER='${DB_USER}'
DB_PASS='${DB_PASSWORD}'
DB_NAME='${DB_NAME}'
EOF"

sudo chmod 600 /etc/webapp.env
sudo chown root:root /etc/webapp.env

sudo mkdir -p /app
sudo chown csye6225:csye6225 /app

sudo systemctl daemon-reload
sudo systemctl enable webapp.service
sudo systemctl start webapp.service