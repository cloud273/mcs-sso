# Content

- Account service is a micro service to help your server manage account token for authenticate
- Api list: https://github.com/cloud273/mcs-sso/blob/main/doc/openapi.yaml

# Todo:

- Migrate to OIDC protocol for more security and standard

# Develop

### Add submodule

`
git submodule add https://github.com/cloud273/node-utility.git node
`

### Main

`
git clone --recurse-submodules https://github.com/cloud273/mcs-sso.git
`

`
git pull --recurse-submodules
`

### Sub-modules

`
git pull origin HEAD:master
`

`
git push origin HEAD:master
`


# Update all packages

`
npm i -g npm-check-updates
`

`
ncu -u
`

`
npm install
`
