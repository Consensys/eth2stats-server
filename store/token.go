package store

import (
	"fmt"
	"time"

	"github.com/thanhpk/randstr"
)

func generateClientToken() string {
	const version = 1
	var buf string

	buf += fmt.Sprintf("%02x", version)
	buf += fmt.Sprintf("%016x", time.Now().UnixNano())
	buf += randstr.Hex(7)

	return buf
}
