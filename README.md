# eth2stats-server

You need to run one instance of the server per configured network. 
The dashboard can connect to multiple networks so you only need a single instance running.

### Server

To start the server in development mode you need to:
- create a `client-versions.yml`  
  `cp client-versions-sample.yml client-versions.yml`  
  versions below the version number in  this file will appear with a warning in the dashboard
  
- create a `config.yml`   
  `cp config-sample.yml config.yml`  
  set proper network name and genesis time under `network:`
  
- run it  
  `go run main.go run -vv`
  
### Dashboard

- install dependencies
  ```
  cd dashboard
  npm install
  npm run install-dev
  ```
  
- create a `config.dev.jsonc`
  `cp config/config.dev.sample.jsonc config/config.dev.jsonc`
  
- in two terminals run  
  `npm run start`  
  `npm run watch`