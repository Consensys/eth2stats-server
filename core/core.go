package core

import (
	"github.com/sirupsen/logrus"

	"github.com/ConsenSys/eth2stats-server/store"
	"github.com/ConsenSys/eth2stats-server/types"
)

var log = logrus.WithField("module", "core")

type Config struct {
}

type Core struct {
	config Config
	store  *store.Store

	notifChan chan types.Notification
}

func New(config Config, store *store.Store, notifChan chan types.Notification) *Core {
	return &Core{
		config:    config,
		store:     store,
		notifChan: notifChan,
	}
}

func (c *Core) Run() {
	go c.monitorHeartbeat()
}

func (c *Core) notifyClientsChange() {
	go func() {
		c.notifChan <- types.Notification{Topic: types.NotificationTopics.ClientsChange}
	}()
}

func (c *Core) Close() {
	log.Info("Got stop signal")
}
