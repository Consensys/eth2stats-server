package core

import (
	"context"

	proto "github.com/alethio/eth2stats-proto"
	"github.com/sirupsen/logrus"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

// Deprecated
func (c *Core) Telemetry(ctx context.Context, req *proto.TelemetryRequest) (*proto.TelemetryResponse, error) {
	client := c.authenticate(ctx)

	if client == nil {
		return nil, status.Error(codes.Unauthenticated, "client not found")
	}

	log.WithFields(logrus.Fields{
		"name": client.GetName(),
		"ip":   c.extractIP(ctx),
	}).Debug("incoming request: Telemetry")

	client.SetPeers(req.GetPeers())

	// deprecated
	// client.SetAttestationsInPool(req.GetAttestationsInPool())
	// client.SetSyncing(req.GetSyncing())
	// client.SetMemoryUsage(req.GetMemoryUsage())

	c.notifyClientsChange()

	return &proto.TelemetryResponse{
		Status:  proto.Status_OK,
		Message: "OK",
	}, nil
}

func (c *Core) Peers(ctx context.Context, req *proto.PeersRequest) (*proto.DefaultResponse, error) {
	client := c.authenticate(ctx)

	if client == nil {
		return nil, status.Error(codes.Unauthenticated, "client not found")
	}

	log.WithField("name", client.GetName()).WithField("ip", c.extractIP(ctx)).Debug("incoming request: Peers")

	client.SetPeers(req.GetPeers())
	c.notifyClientsChange()

	return &proto.DefaultResponse{
		Status:  proto.Status_OK,
		Message: "OK",
	}, nil
}

func (c *Core) Syncing(ctx context.Context, req *proto.SyncingRequest) (*proto.DefaultResponse, error) {
	client := c.authenticate(ctx)

	if client == nil {
		return nil, status.Error(codes.Unauthenticated, "client not found")
	}

	log.WithField("name", client.GetName()).WithField("ip", c.extractIP(ctx)).Debug("incoming request: Syncing")

	client.SetSyncing(req.GetSyncing())
	c.notifyClientsChange()

	return &proto.DefaultResponse{
		Status:  proto.Status_OK,
		Message: "OK",
	}, nil
}

func (c *Core) Attestations(ctx context.Context, req *proto.AttestationsRequest) (*proto.DefaultResponse, error) {
	client := c.authenticate(ctx)

	if client == nil {
		return nil, status.Error(codes.Unauthenticated, "client not found")
	}

	log.WithField("name", client.GetName()).WithField("ip", c.extractIP(ctx)).Debug("incoming request: Attestations")

	client.SetAttestationsInPool(req.GetAttestationsInPool())
	c.notifyClientsChange()

	return &proto.DefaultResponse{
		Status:  proto.Status_OK,
		Message: "OK",
	}, nil
}

func (c *Core) MemoryUsage(ctx context.Context, req *proto.MemoryUsageRequest) (*proto.DefaultResponse, error) {
	client := c.authenticate(ctx)

	if client == nil {
		return nil, status.Error(codes.Unauthenticated, "client not found")
	}

	log.WithField("name", client.GetName()).WithField("ip", c.extractIP(ctx)).Debug("incoming request: MemoryUsage")

	client.SetMemoryUsage(req.GetMemoryUsage())
	c.notifyClientsChange()

	return &proto.DefaultResponse{
		Status:  proto.Status_OK,
		Message: "OK",
	}, nil
}
