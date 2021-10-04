# Git

git submodule add https://cloud273.com:8027/library/node.git
git clone --recurse-submodules https://cloud273.com:8027/service/sso.git
git pull --recurse-submodules

// commmit submodules
git pull origin HEAD:master
git push origin HEAD:master


# Update all packages

npm i -g npm-check-updates
ncu -u
npm install