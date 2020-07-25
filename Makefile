VERSION := "$(shell git describe --abbrev=0 --tags 2> /dev/null || echo 'v0.0.0')-$(shell git rev-parse --short HEAD)"

build:
	go build -ldflags "-X main.buildVersion=$(VERSION)"

run:
	go run main.go

install:
	go install -ldflags "-X main.buildVersion=$(VERSION)"

build-docker:
	docker build -t ConsenSys/eth2stats-server .

update-assets:
	# TODO update geoipdb
	# update bad words
	wget -O ./assets/cusses.txt https://raw.githubusercontent.com/LDNOOBW/List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words/master/en
