# eth2stats-server

You need to run one instance of the server per configured network. 

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

[eth2stats-dashboard  repo](https://github.com/ConsenSys/eth2stats-dashboard)
  
### Client

[eth2stats-client repo](https://github.com/Alethio/eth2stats-client)