package core

import "time"

const OfflineTimeout = 30 * time.Second
const OfflineKickThreshold = 2 * time.Hour
const HeartbeatCheckInterval = 5 * time.Second
