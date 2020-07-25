package geoip

import (
	"net"
	"sync"

	"github.com/oschwald/maxminddb-golang"
	"github.com/sirupsen/logrus"
)

var log = logrus.WithField("module", "geoip")

var instance *maxminddb.Reader
var once sync.Once

type Location struct {
	City      string  `json:"city"`
	Latitude  float64 `json:"lat"`
	Longitude float64 `json:"long"`
}

func Lookup(ipString string) (*Location, error) {
	once.Do(func() {
		db, err := maxminddb.Open("./assets/GeoLite2-City.mmdb")
		if err != nil {
			log.Fatal(err)
		}

		instance = db
	})

	ip := net.ParseIP(ipString)

	var record struct {
		City struct {
			Names map[string]string `maxminddb:"names"`
		} `maxminddb:"city"`
		Location struct {
			AccuracyRadius uint16  `maxminddb:"accuracy_radius"`
			Latitude       float64 `maxminddb:"latitude"`
			Longitude      float64 `maxminddb:"longitude"`
			MetroCode      uint    `maxminddb:"metro_code"`
			TimeZone       string  `maxminddb:"time_zone"`
		} `maxminddb:"location"`
	}

	err := instance.Lookup(ip, &record)
	if err != nil {
		return nil, err
	}
	city, ok := record.City.Names["en"]
	if ok {
		return &Location{
				City:      city,
				Latitude:  record.Location.Latitude,
				Longitude: record.Location.Longitude,
			},
			nil
	}

	return nil, nil
}
