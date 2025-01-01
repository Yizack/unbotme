#!/bin/bash
cd /apps/unbotme
git fetch
git pull
export NVM_DIR=/usr/local/nvm
source /usr/local/nvm/nvm.sh
pnpm install
pnpm build
sudo su -c "export PATH=$PATH; pm2 restart unbotme"
