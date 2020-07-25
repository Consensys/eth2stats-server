package core

import (
	"context"

	proto "github.com/alethio/eth2stats-proto"
	"github.com/sirupsen/logrus"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	"github.com/ConsenSys/eth2stats-server/types"
)

func (c *Core) ChainHead(ctx context.Context, req *proto.ChainHeadRequest) (*proto.ChainHeadResponse, error) {
	client := c.authenticate(ctx)

	if client == nil {
		return nil, status.Error(codes.Unauthenticated, "client not found")
	}
	log.WithFields(logrus.Fields{
		"name": client.GetName(),
		"ip":   c.extractIP(ctx),
	}).Debug("incoming request: ChainHead")

	client.SetLatestHead(types.ChainHead{
		HeadSlot:           req.GetHeadSlot(),
		HeadBlockRoot:      req.GetHeadBlockRoot(),
		FinalizedSlot:      req.GetFinalizedSlot(),
		FinalizedBlockRoot: req.GetFinalizedBlockRoot(),
		JustifiedSlot:      req.GetJustifiedSlot(),
		JustifiedBlockRoot: req.GetJustifiedBlockRoot(),
	})
	c.notifyClientsChange()

	return &proto.ChainHeadResponse{
		Status: proto.Status_OK,
	}, nil
}
