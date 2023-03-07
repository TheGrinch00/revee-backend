#!/bin/bash

# Update the system
sudo yum update

# Install things
sudo yum -y install yum-utils
sudo yum-config-manager --enable rhui-REGION-rhel-server-extras rhui-REGION-rhel-server-optional
sudo yum install automake fuse fuse-devel gcc-c++ git libcurl-devel libxml2-devel make openssl-devel ruby wget certbot python2-certbot-nginx nginx

# Install node 8
wget https://rpm.nodesource.com/setup_8.x
sudo bash setup_8.x
rm setup_8.x

# Install the AWS CodeDeploy daemon
wget https://aws-codedeploy-us-east-2.s3.us-east-2.amazonaws.com/latest/install
chmod +x install
sudo ./install auto
sudo service codedeploy-agent start
rm install

# Install S3FS, a virtual file system that allows users to mount S3 buckets as disks
git clone https://github.com/s3fs-fuse/s3fs-fuse.git
cd s3fs-fuse/
./autogen.sh
./configure --prefix=/usr --with-openssl
make
sudo make install
cd ..
rm -rf s3fs-fuse
sudo touch /etc/passwd-s3fs
echo "\n\n\n\n\n\n"
echo "**********************************************************************"
echo "Insert AWS ACCESS KEY ID and AWS SECRET ACCESS KEY in /etc/passwd-s3fs"
echo " - press Ctrl-Z to pause the execution of this script,"
echo " - modify the file with 'sudo nano /etc/passwd-s3fs'"
echo " and resume the script with 'fg'"
read -p "Press [Enter] key to continue..."
sudo chmod 640 /etc/passwd-s3fs
# aggiungi cronjob (ogni 5 minuti controlla che s3 sia montato, montalo altrimenti)
echo '*/5 * * * * root if [ -z "$(mount -l | grep /mnt/storage)" ]; then s3fs revee-file-storage -o allow_other -o uid=1000 -o multireq_max=5  -o mp_umask=0113 /mnt/storage; fi' | sudo tee /etc/crontab > /dev/null

# installa nginx e certbot (per gestire il traffico https
# aggiungi cronjob (aggiorna il certificato se necessario)
echo "0 0,12 * * * root python -c 'import random; import time; time.sleep(random.random() * 3600)' && certbot renew" | sudo tee -a /etc/crontab > /dev/null
sudo certbot certonly
--nginx \
--non-interactive \
--agree-tos \
--email "crm@revee.it" \
--domains "api.revee.it" \
--pre-hook 'sudo service nginx stop' \
--post-hook 'sudo service nginx start'

sudo systemctl enable nginx codedeploy-agent --now

echo "Nginx:"
sudo systemctl is-active nginx
echo "CodeDeploy:"
sudo systemctl is-active codedeploy-agent