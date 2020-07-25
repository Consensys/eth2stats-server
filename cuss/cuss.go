package cuss

import (
	"bufio"
	"fmt"
	"io"
	"os"
	"strings"
	"sync"

	cussfilter "github.com/JoshuaDoes/gofuckyourself"
	"github.com/sirupsen/logrus"
)

const cussesFile = "./assets/cusses.txt"

var log = logrus.WithField("module", "cuss")

var instance *cussfilter.SwearFilter
var once sync.Once

func Clean(phrase string) (string, error) {
	once.Do(func() {
		fd, err := os.Open(cussesFile)
		if err != nil {
			log.Fatal(err)
		}

		buf := bufio.NewReader(fd)
		var cusses []string
		for {
			line, _, err := buf.ReadLine()
			if err != nil {
				if err == io.EOF {
					break
				}
				log.Fatal(err)
			}
			text := strings.TrimSpace(string(line))
			if text == "" {
				continue
			}
			cusses = append(cusses, text)
		}
		err = fd.Close()
		if err != nil {
			log.Fatal(err)
		}

		filter := cussfilter.New(
			false,
			false,
			false,
			false,
			false,
			cusses...)

		instance = filter
	})

	dirtyPhrase, foundCusses, err := instance.Check(phrase)
	if err != nil {
		return "", fmt.Errorf("could not clean string %s: %s", phrase, err)
	}
	if dirtyPhrase {
		for _, c := range foundCusses {
			censored := string(c[0]) + strings.Repeat("*", len([]rune(c))-2) + string(c[len(c)-1])
			phrase = strings.ReplaceAll(phrase, c, censored)
		}
	}

	return phrase, nil
}
