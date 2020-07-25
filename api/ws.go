package api

import (
	"fmt"
	"net/http"

	"github.com/gorilla/websocket"

	"github.com/ConsenSys/eth2stats-server/api/wsclient"
)

var wsupgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin:     func(r *http.Request) bool { return true },
}

func (a *API) websockets(w http.ResponseWriter, r *http.Request) {
	conn, err := wsupgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Printf("Failed to set websocket upgrade: %+v", err)
		return
	}

	client := a.RegisterWSClient(conn)

	client.Wait()
	client.Close()

	a.wsMutex.Lock()
	delete(a.wsApiClients, client)
	a.wsMutex.Unlock()

	log.Debug("wsclient disconnected")
}

func (a *API) RegisterWSClient(conn *websocket.Conn) *wsclient.WSClient {
	client := wsclient.New(conn)

	a.wsMutex.Lock()
	a.wsApiClients[client] = true
	a.wsMutex.Unlock()

	log.Debugf("new wsclient registered")

	return client
}

func (a *API) NotifyWSClientsChange() {
	for client := range a.wsApiClients {
		go client.NotifyClientsChange()
	}
}
