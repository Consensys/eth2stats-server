package ratecounter

import (
	"time"
)

// TODO can be optimized with a circular buffer
// not thread safe
type RateCounter struct {
	limit  int
	events []event
}

type event struct {
	timestamp int64
	value     uint64
}

func (rc *RateCounter) Add(value uint64) {
	rc.events = append(rc.events, event{
		timestamp: time.Now().Unix(),
		value:     value,
	})
	if len(rc.events) > rc.limit {
		rc.events = rc.events[1:]
	}
}

func (rc *RateCounter) Clear() {
	rc.events = nil
}

func (rc *RateCounter) Rate() float64 {
	if len(rc.events) > 1 {
		last := len(rc.events) - 1
		s := rc.events[0]
		e := rc.events[last]
		ts := e.timestamp - s.timestamp
		if ts > 0 {
			return float64(e.value-s.value) / float64(ts)
		}
	}
	return 0
}

func NewRateCounter(limit int) *RateCounter {
	return &RateCounter{
		limit:  limit,
		events: nil,
	}
}
