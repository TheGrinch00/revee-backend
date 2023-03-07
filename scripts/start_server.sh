#!/bin/bash

cd /home/ec2-user/
sudo forever stop app-revee-api
cd app-revee-api/
sudo forever start -a development.json
