package core

import (
	"context"
	"time"

	proto "github.com/alethio/eth2stats-proto"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (c *Core) Heartbeat(ctx context.Context, req *proto.HeartbeatRequest) (*proto.HeartbeatResponse, error) {
	client := c.authenticate(ctx)

	if client == nil {
		return nil, status.Error(codes.Unauthenticated, "client not found")
	}

	log.WithField("token", client.GetToken()).WithField("name", client.GetName()).
		Trace("got heartbeat from client")
	client.RecordHeartbeat()

	return &proto.HeartbeatResponse{Status: proto.Status_OK}, nil
}

func (c *Core) monitorHeartbeat() {
	log.Info("starting heartbeat monitor")
	for {
		select {
		case <-time.Tick(HeartbeatCheckInterval):
			log.Trace("checking clients heartbeat")
			c.checkHeartbeat()
			log.Trace("done checking clients heartbeat")
		}
	}
}

func (c *Core) checkHeartbeat() {
	for _, client := range c.store.GetRawClients() {
		if client.IsOnline() && time.Since(client.GetLastHeartbeat()) > OfflineTimeout {
			log.WithField("token", client.GetToken()).WithField("name", client.GetName()).
				Warnf("client hasn't sent heartbeat; flagging offline")
			client.SetOnline(false)
			c.notifyClientsChange()
		}

		if time.Since(client.GetLastHeartbeat()) > OfflineKickThreshold {
			log.WithField("token", client.GetToken()).WithField("name", client.GetName()).
				Warn("client offline time exceeded threshold; evicting client")
			c.store.DeleteClient(client.GetToken())
			c.notifyClientsChange()
		}
	}
}
