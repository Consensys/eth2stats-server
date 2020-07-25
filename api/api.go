package api

import (
	"sync"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"

	"github.com/ConsenSys/eth2stats-server/api/wsclient"
	"github.com/ConsenSys/eth2stats-server/store"
	"github.com/ConsenSys/eth2stats-server/types"
)

var log = logrus.WithField("module", "api")

type Config struct {
	Port           string
	DevCorsEnabled bool
	DevCorsHost    string

	Network types.NetworkConfig
}

type API struct {
	config Config
	engine *gin.Engine
	store  *store.Store

	wsMutex      sync.Mutex
	wsApiClients map[*wsclient.WSClient]bool

	notifChan chan types.Notification
}

func New(config Config, store *store.Store, notifChan chan types.Notification) *API {
	return &API{
		config:       config,
		store:        store,
		wsApiClients: make(map[*wsclient.WSClient]bool),
		notifChan:    notifChan,
	}
}

func (a *API) Run() {
	a.engine = gin.Default()

	if a.config.DevCorsEnabled {
		a.engine.Use(cors.New(cors.Config{
			AllowOrigins:     []string{a.config.DevCorsHost},
			AllowMethods:     []string{"PUT", "PATCH", "GET", "POST"},
			AllowHeaders:     []string{"Origin"},
			ExposeHeaders:    []string{"Content-Length"},
			AllowCredentials: true,
		}))
	}

	a.setRoutes()

	go func() {
		for notif := range a.notifChan {
			switch notif.Topic {
			case types.NotificationTopics.ClientsChange:
				a.NotifyWSClientsChange()
			}
		}
	}()

	err := a.engine.Run(":" + a.config.Port)
	if err != nil {
		log.Fatal(err)
	}
}

func (a *API) Close() {
}
