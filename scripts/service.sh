#!/bin/bash
password=""

while getopts u:p: flag; do
  case "${flag}" in
    p) password=${OPTARG} ;;
    *) echo "Usage: $0 -p password" ;;
  esac
done

echo $password | sudo -S su -c "export PATH=$PATH; pm2 restart unbotme"

cd /apps/unbotme
git fetch
git pull
export NVM_DIR=/usr/local/nvm
source /usr/local/nvm/nvm.sh
pnpm install
pnpm build
sudo su -c "export PATH=$PATH; pm2 restart unbotme"
