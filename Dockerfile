FROM golang:1.13.5 AS build

ENV ROOT "/tmp/eth2stats-server"

WORKDIR $ROOT

ADD go.mod go.mod
ADD go.sum go.sum

ADD . .

RUN go test ./...

RUN make build

# Stage 2
FROM ubuntu
RUN apt-get update && apt-get install -y ca-certificates
WORKDIR /
COPY --from=0 /tmp/eth2stats-server/assets ./assets
COPY --from=0 /tmp/eth2stats-server/eth2stats-server .

ENTRYPOINT ["/eth2stats-server"]
