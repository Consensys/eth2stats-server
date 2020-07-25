package versioncontrol

import (
	"path/filepath"
	"strings"
	"sync"

	"github.com/fsnotify/fsnotify"
	"github.com/hashicorp/go-version"
	"github.com/sirupsen/logrus"
	"github.com/spf13/viper"
)

var instance *VersionControl
var once sync.Once
var log = logrus.WithField("module", "version-control")

type VersionControl struct {
	LatestVersions map[string]string

	viper *viper.Viper
}

func New() {
	vc := &VersionControl{
		LatestVersions: make(map[string]string),
		viper:          viper.New(),
	}
	vc.initVersionViper(viper.GetString("version-file"))
	vc.parseVersions()

	instance = vc
}

func (vc *VersionControl) parseVersions() {
	log.Info("parsing version-file for latest eth2stats-client versions")
	m := vc.viper.Get("client-versions")

	mSlice, ok := m.([]interface{})
	if !ok {
		log.Fatal("invalid client-versions configuration: expected client-versions to be []interface{}")
	}

	for _, el := range mSlice {
		item, ok := el.(map[interface{}]interface{})
		if !ok {
			log.Fatal("invalid client-versions configuration: expected item to be map[interface{}]interface{}")
		}

		namespace, ok := item["namespace"]
		if !ok {
			log.Fatal("invalid client-versions configuration: expected key 'namespace' not found")
		}

		namespaceString, ok := namespace.(string)
		if !ok {
			log.Fatal("invalid client-versions configuration: expected 'namespace' value to be string")
		}

		v, ok := item["version"]
		if !ok {
			log.Fatal("invalid client-versions configuration: expected key 'version' not found")
		}

		versionString, ok := v.(string)
		if !ok {
			log.Fatal("invalid client-versions configuration: expected 'version' value to be string")
		}

		vc.LatestVersions[namespaceString] = versionString
	}

	log.WithField("versions", vc.LatestVersions).Debug("got versions")
	log.Info("done parsing version-file")
}

func (vc *VersionControl) initVersionViper(file string) {
	// get the filepath
	abs, err := filepath.Abs(file)
	if err != nil {
		log.Error("Error reading filepath: ", err.Error())
	}

	// get the config name
	base := filepath.Base(abs)

	// get the path
	path := filepath.Dir(abs)

	//
	vc.viper.SetConfigName(strings.Split(base, ".")[0])
	vc.viper.AddConfigPath(path)
	err = vc.viper.ReadInConfig()
	if err != nil {
		log.Error("could not read version-file: ", err)
	} else {
		vc.viper.WatchConfig()
		vc.viper.OnConfigChange(func(in fsnotify.Event) {
			log.Info("detected version-file change; will reload versions")
			vc.parseVersions()
		})
	}
}

func Lookup(namespace string, v string) string {
	once.Do(New)

	actualVersion, err := version.NewVersion(v)
	if err != nil {
		log.Warnf("could not decode version: %s", err)
		return VersionStatus.Unknown
	}

	expected, exists := instance.LatestVersions[namespace]
	if !exists {
		log.Warnf("unknown namespace: %s", namespace)
		return VersionStatus.Unknown
	}

	expectedVersion, _ := version.NewVersion(expected)

	if actualVersion.GreaterThanOrEqual(expectedVersion) {
		return VersionStatus.Ok
	}

	return VersionStatus.Outdated
}
