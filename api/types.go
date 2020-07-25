package api

import (
	"crypto/sha1"
	"encoding/hex"
	"time"

	"github.com/ConsenSys/eth2stats-server/geoip"
	"github.com/ConsenSys/eth2stats-server/store"
	"github.com/ConsenSys/eth2stats-server/types"
	"github.com/ConsenSys/eth2stats-server/versioncontrol"
)

type ReadableClient struct {
	ID                  string          `json:"id"`
	Name                string          `json:"name"`
	BeaconClientVersion string          `json:"beaconClientVersion"`
	GenesisTime         string          `json:"genesisTime"`
	LatestHead          types.ChainHead `json:"latestHead"`
	Online              bool            `json:"online"`
	Peers               *int64          `json:"peers"`
	AttestationsInPool  *int64          `json:"attestations"`
	Syncing             *bool           `json:"syncing"`
	SyncingRate         *float64        `json:"syncingRate"`
	Location            *geoip.Location `json:"location"`
	MemoryUsage         *int64          `json:"memoryUsage"`
	ClientVersion       string          `json:"clientVersion"`
	ClientVersionStatus string          `json:"clientVersionStatus"`
}

func (c *ReadableClient) FromClient(client store.Client) ReadableClient {
	c.ID = generateID(client.GetToken())
	c.Name = client.GetName()
	c.BeaconClientVersion = client.GetVersion()
	c.Online = client.IsOnline()

	gt := time.Unix(client.GetGenesisTime(), 0)
	c.GenesisTime = gt.UTC().Format(time.RFC3339)

	c.LatestHead = client.GetLatestHead()
	c.Peers = client.GetPeers()
	c.AttestationsInPool = client.GetAttestationsInPool()
	c.Syncing = client.GetSyncing()
	c.SyncingRate = client.GetSyncingRate()
	c.Location = client.GetLocation()
	c.MemoryUsage = client.GetMemoryUsage()

	c.setClientVersion(client)

	return *c
}

func (c *ReadableClient) setClientVersion(client store.Client) {
	cv := client.GetEth2StatsVersion()
	c.ClientVersion = cv.Namespace
	if cv.Version == nil {
		c.ClientVersionStatus = versioncontrol.VersionStatus.Unknown
		return
	}

	c.ClientVersion += "/" + *cv.Version
	c.ClientVersionStatus = versioncontrol.Lookup(cv.Namespace, *cv.Version)
}

func generateID(token string) string {
	s := sha1.New()
	s.Write([]byte(token))
	sum := s.Sum(nil)

	return hex.EncodeToString(sum)
}
