package wsclient

import (
	"sync"
	"time"

	"github.com/gorilla/websocket"
	"github.com/sirupsen/logrus"
)

var log = logrus.WithField("module", "wsclient")

type WSClient struct {
	conn     *websocket.Conn
	dataChan chan interface{}

	close sync.WaitGroup
}

func New(conn *websocket.Conn) *WSClient {
	c := &WSClient{
		conn:     conn,
		dataChan: make(chan interface{}),
	}

	c.close.Add(1)

	go c.SendDataFromChan()

	return c
}

func (c *WSClient) Close() {
	c.conn.Close()
}

func (c *WSClient) NotifyClientsChange() {
	log.Trace("sending clients change notification")
	c.dataChan <- map[string]interface{}{
		"topic": "clients",
	}
	log.Trace("sent clients change notification")
}

func (c *WSClient) SendDataFromChan() {
	for msg := range c.dataChan {
		log.Trace("[sender] got message to send")

		errChan := make(chan error)

		go func() {
			err := c.conn.WriteJSON(msg)
			errChan <- err
		}()

		select {
		case err := <-errChan:
			if err != nil {
				log.Warn(err)
				c.close.Done()
				return
			}

			log.Trace("[sender] message sent")
		case <-time.After(5 * time.Second):
			log.Warn("[sender] timeout reached; message not sent")
			c.close.Done()
			return
		}
	}
}

func (c *WSClient) Wait() {
	c.close.Wait()
}
