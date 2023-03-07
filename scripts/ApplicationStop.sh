#!/bin/bash
systemctl daemon-reload
systemctl enable revee-api
systemctl stop revee-api
