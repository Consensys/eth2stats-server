package commands

import (
	"fmt"
	"net"
	"os"
	"os/signal"
	"syscall"
	"time"

	proto "github.com/alethio/eth2stats-proto"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
	"google.golang.org/grpc"

	"github.com/ConsenSys/eth2stats-server/api"
	"github.com/ConsenSys/eth2stats-server/core"
	"github.com/ConsenSys/eth2stats-server/store"
	"github.com/ConsenSys/eth2stats-server/types"
)

var runCmd = &cobra.Command{
	Use:   "run",
	Short: "Say hello!",
	Long:  "Address a wonderful greeting to the majestic executioner of this CLI",
	Run: func(cmd *cobra.Command, args []string) {
		stopChan := make(chan os.Signal, 1)
		signal.Notify(stopChan, syscall.SIGINT)
		signal.Notify(stopChan, syscall.SIGTERM)

		s := store.New()
		notifChan := make(chan types.Notification)

		c := core.New(core.Config{}, s, notifChan)
		go c.Run()

		// start gRPC server
		log.Info("setting up gRPC server")
		grpcServer := grpc.NewServer(grpc.MaxRecvMsgSize(64 * 1024 * 1024))

		log.Info("registering Eth2stats gRPC server")
		proto.RegisterEth2StatsServer(grpcServer, c)
		proto.RegisterTelemetryServer(grpcServer, c)

		log.Infof("setting up tcp listener on port %s", viper.GetString("grpc.port"))
		lis, err := net.Listen("tcp", fmt.Sprintf(":%s", viper.GetString("grpc.port")))
		if err != nil {
			log.Fatalf("failed to listen: %v", err)
		}

		log.Info("starting gRPC server")
		go grpcServer.Serve(lis)

		log.Info("starting HTTP API")
		a := api.New(api.Config{
			Port:           viper.GetString("http.port"),
			DevCorsEnabled: viper.GetBool("http.dev-cors"),
			DevCorsHost:    viper.GetString("http.dev-cors-host"),
			Network: types.NetworkConfig{
				Name:        viper.GetString("network.name"),
				GenesisTime: viper.GetString("network.genesis-time"),
			},
		}, s, notifChan)
		go a.Run()

		log.Info("ready")

		select {
		case <-stopChan:
			log.Info("Got stop signal. Finishing work.")

			c.Close()

			log.Info("Work done. Goodbye!")
		}
	},
}

func init() {
	runCmd.Flags().String("version-file", "./client-versions.yml", "The list of clients and their latest versions")
	viper.BindPFlag("version-file", runCmd.Flag("version-file"))

	// grpc
	runCmd.Flags().String("grpc.port", "9090", "gRPC server port")
	viper.BindPFlag("grpc.port", runCmd.Flag("grpc.port"))

	// api
	runCmd.Flags().String("http.port", "8080", "HTTP API port")
	viper.BindPFlag("http.port", runCmd.Flag("http.port"))

	runCmd.Flags().Bool("http.dev-cors", false, "Enable development cors for HTTP API")
	viper.BindPFlag("http.dev-cors", runCmd.Flag("http.dev-cors"))

	runCmd.Flags().String("http.dev-cors-host", "", "Allowed host for HTTP API dev cors")
	viper.BindPFlag("http.dev-cors-host", runCmd.Flag("http.dev-cors-host"))

	// network
	runCmd.Flags().String("network.name", "test", "The name of the network on which we're currently running (for informational purposes)")
	viper.BindPFlag("network.name", runCmd.Flag("network.name"))

	runCmd.Flags().String("network.genesis-time", time.Now().UTC().Format(time.RFC3339), "The genesis time of the network (RFC3339 format)")
	viper.BindPFlag("network.genesis-time", runCmd.Flag("network.genesis-time"))
}
