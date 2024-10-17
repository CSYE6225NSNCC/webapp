# Enable and start MySQL service
sudo systemctl enable mysql
sudo systemctl start mysql

# Switch root authentication to use MySQL native password
sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH 'mysql_native_password' BY '${DB_PASSWORD}';"

# Create the user and group csye6225 if they don't exist
sudo groupadd -f csye6225
sudo id -u csye6225 &>/dev/null || sudo useradd -m -g csye6225 -s /usr/sbin/nologin csye6225

# Create MySQL user with provided password and grant privileges to the database
mysql -u root -p"${DB_PASSWORD}" -e "CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASSWORD}';"
mysql -u root -p"${DB_PASSWORD}" -e "CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;"
mysql -u root -p"${DB_PASSWORD}" -e "GRANT ALL PRIVILEGES ON \`${DB_NAME}\`.* TO '${DB_USER}'@'localhost';"
mysql -u root -p"${DB_PASSWORD}" -e "FLUSH PRIVILEGES;"