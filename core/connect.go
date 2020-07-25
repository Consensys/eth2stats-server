package core

import (
	"context"
	"fmt"
	"time"

	proto "github.com/alethio/eth2stats-proto"
	"github.com/sirupsen/logrus"

	"github.com/ConsenSys/eth2stats-server/store"
)

var blacklist = []string{
	"109.230.224.77", // vegan
	"54.163.125.244", // ne-pbcn.dev.eth2.alphavirtual.com
}

func (c *Core) Connect(ctx context.Context, req *proto.ConnectRequest) (*proto.ConnectResponse, error) {
	ip := c.extractIP(ctx)
	log.WithFields(logrus.Fields{
		"name": req.GetName(),
		"ip":   ip,
	}).Debug("incoming request: Connect")

	// TODO need to come up with something a lot better
	for _, bip := range blacklist {
		if ip == bip {
			time.Sleep(time.Second * 5)
			log.Infof("dropping connection from %s because it's blacklisted", ip)
			return nil, fmt.Errorf("could not establish connection. please open an issue on https://github.com/Alethio/eth2stats-client")
		}
	}

	// check name is proper length
	nameLen := len(req.GetName())
	if nameLen < 3 || nameLen > 64 {
		log.Infof("dropping connection from %s because of name length", ip)
		return nil, fmt.Errorf("invalid node name")
	}

	var client *store.Client

	clientAuth := c.authenticate(ctx)
	if clientAuth != nil {
		client = c.handleExistingClient(ctx, clientAuth, req)
	} else {
		client = c.handleNewClient(ctx, req)
	}

	client.SetVersion(req.GetVersion())
	client.SetGenesisTime(req.GetGenesisTime())
	client.SetOnline(true)
	client.SetLocation(c.extractIP(ctx))
	client.SetEth2StatsVersion(req.GetEth2StatsVersion())

	loc := client.GetLocation()
	if loc != nil {
		log.Debugf("detected city for %s: %s", ip, loc.City)
	}

	c.notifyClientsChange()
	client.RecordHeartbeat()

	return &proto.ConnectResponse{
		Token:   client.GetToken(),
		Status:  proto.Status_OK,
		Message: "",
	}, nil
}

func (c *Core) handleNewClient(ctx context.Context, req *proto.ConnectRequest) *store.Client {
	log.WithField("name", req.GetName()).Info("incoming connection from new client")
	// if the client didn't send a token in the metadata or a client with that token could not be found
	// create a new client

	return c.store.NewClient(req.GetName())
}

func (c *Core) handleExistingClient(ctx context.Context, client *store.Client, req *proto.ConnectRequest) *store.Client {
	log.WithField("token", client.GetToken()).WithField("name", client.GetName()).
		Info("incoming connection from existing client")
	client.SetName(req.GetName())
	client.SetSyncing(false)

	return client
}
