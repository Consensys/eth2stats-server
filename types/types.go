package types

type ChainHead struct {
	HeadSlot           uint64 `json:"headSlot"`
	HeadBlockRoot      string `json:"headBlockRoot"`
	FinalizedSlot      uint64 `json:"finalizedSlot"`
	FinalizedBlockRoot string `json:"finalizedBlockRoot"`
	JustifiedSlot      uint64 `json:"justifiedSlot"`
	JustifiedBlockRoot string `json:"justifiedBlockRoot"`
}

type Notification struct {
	Topic string
}

var NotificationTopics = struct {
	ClientsChange string
}{
	ClientsChange: "clients_change",
}

type NetworkConfig struct {
	Name        string
	GenesisTime string
}
