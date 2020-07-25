package store

import (
	"strings"
	"sync"
	"time"

	"github.com/ConsenSys/eth2stats-server/cuss"
	"github.com/ConsenSys/eth2stats-server/geoip"
	"github.com/ConsenSys/eth2stats-server/ratecounter"
	"github.com/ConsenSys/eth2stats-server/types"
)

type Eth2StatsVersion struct {
	Namespace string
	Version   *string
}

type Client struct {
	token              string
	name               string
	version            string
	genesisTime        int64
	latestHead         types.ChainHead
	peers              *int64
	attestationsInPool *int64
	syncing            *bool
	syncingRate        *ratecounter.RateCounter
	location           *geoip.Location
	memoryUsage        *int64

	eth2statsVersion Eth2StatsVersion

	online        bool
	lastHeartbeat time.Time

	mu sync.Mutex
}

func (c *Client) SetName(name string) {
	c.mu.Lock()
	defer c.mu.Unlock()

	cleanName, err := cuss.Clean(name)
	if err != nil {
		log.Error(err)
		cleanName = name
	}

	c.name = cleanName
}

func (c *Client) SetVersion(version string) {
	c.mu.Lock()
	defer c.mu.Unlock()

	c.version = version
}

func (c *Client) SetGenesisTime(genesisTime int64) {
	c.mu.Lock()
	defer c.mu.Unlock()

	c.genesisTime = genesisTime
}

func (c *Client) SetOnline(online bool) {
	c.mu.Lock()
	defer c.mu.Unlock()

	c.online = online
}

func (c *Client) RecordHeartbeat() {
	c.mu.Lock()
	defer c.mu.Unlock()

	c.lastHeartbeat = time.Now()
	c.online = true
}

func (c *Client) SetLatestHead(head types.ChainHead) {
	c.mu.Lock()
	defer c.mu.Unlock()

	c.latestHead = head
	if c.syncing != nil && *c.syncing {
		c.syncingRate.Add(head.HeadSlot)
	} else {
		c.syncingRate.Clear()
	}
}

func (c *Client) SetPeers(count int64) {
	c.mu.Lock()
	defer c.mu.Unlock()

	c.peers = &count
}

func (c *Client) SetAttestationsInPool(count int64) {
	c.mu.Lock()
	defer c.mu.Unlock()

	c.attestationsInPool = &count
}

func (c *Client) SetSyncing(syncing bool) {
	c.mu.Lock()
	defer c.mu.Unlock()

	c.syncing = &syncing
	if syncing == false {
		c.syncingRate.Clear()
	}
}

func (c *Client) SetLocation(ip string) {
	c.mu.Lock()
	defer c.mu.Unlock()

	c.location, _ = geoip.Lookup(ip)
}

func (c *Client) SetMemoryUsage(val int64) {
	c.mu.Lock()
	defer c.mu.Unlock()

	c.memoryUsage = &val
}

func (c *Client) SetEth2StatsVersion(val string) {
	c.mu.Lock()
	defer c.mu.Unlock()

	v := strings.Split(val, "/")
	if len(v) != 2 {
		c.eth2statsVersion.Namespace = "unknown"
		c.eth2statsVersion.Version = nil

		return
	}

	c.eth2statsVersion.Namespace = v[0]
	c.eth2statsVersion.Version = &v[1]
}

func (c *Client) GetName() string {
	c.mu.Lock()
	defer c.mu.Unlock()

	name := c.name

	return name
}

func (c *Client) GetToken() string {
	c.mu.Lock()
	defer c.mu.Unlock()

	token := c.token

	return token
}

func (c *Client) GetVersion() string {
	c.mu.Lock()
	defer c.mu.Unlock()

	version := c.version

	return version
}

func (c *Client) GetGenesisTime() int64 {
	c.mu.Lock()
	defer c.mu.Unlock()

	gt := c.genesisTime

	return gt
}

func (c *Client) IsOnline() bool {
	c.mu.Lock()
	defer c.mu.Unlock()

	o := c.online

	return o
}

func (c *Client) GetLastHeartbeat() time.Time {
	c.mu.Lock()
	defer c.mu.Unlock()

	hb := c.lastHeartbeat

	return hb
}

func (c *Client) GetLatestHead() types.ChainHead {
	c.mu.Lock()
	defer c.mu.Unlock()

	lh := c.latestHead

	return lh
}

func (c *Client) GetPeers() *int64 {
	c.mu.Lock()
	defer c.mu.Unlock()

	p := c.peers

	return p
}

func (c *Client) GetAttestationsInPool() *int64 {
	c.mu.Lock()
	defer c.mu.Unlock()

	p := c.attestationsInPool

	return p
}

func (c *Client) GetSyncing() *bool {
	c.mu.Lock()
	defer c.mu.Unlock()

	s := c.syncing

	return s
}

func (c *Client) GetSyncingRate() *float64 {
	c.mu.Lock()
	defer c.mu.Unlock()

	if c.online && c.syncing != nil && *c.syncing {
		r := c.syncingRate.Rate()

		return &r
	}
	return nil
}

func (c *Client) GetLocation() *geoip.Location {
	c.mu.Lock()
	defer c.mu.Unlock()

	return c.location
}

func (c *Client) GetMemoryUsage() *int64 {
	c.mu.Lock()
	defer c.mu.Unlock()

	return c.memoryUsage
}

func (c *Client) GetEth2StatsVersion() Eth2StatsVersion {
	c.mu.Lock()
	defer c.mu.Unlock()

	return c.eth2statsVersion
}

func NewClient(token string) *Client {
	return &Client{
		token:       token,
		syncingRate: ratecounter.NewRateCounter(20),
	}
}

type Clients []Client

func (a Clients) Len() int           { return len(a) }
func (a Clients) Less(i, j int) bool { return a[i].token < a[j].token }
func (a Clients) Swap(i, j int)      { a[i], a[j] = a[j], a[i] }
