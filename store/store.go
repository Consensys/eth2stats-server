package store

import (
	"sort"

	"github.com/sirupsen/logrus"
)

var log = logrus.WithField("module", "store")

type Store struct {
	clients map[string]*Client
}

func New() *Store {
	return &Store{
		clients: make(map[string]*Client),
	}
}

func (s *Store) NewClient(name string) *Client {
	token := generateClientToken()
	client := NewClient(token)
	client.SetName(name)

	s.clients[token] = client

	return client
}

func (s *Store) DeleteClient(token string) {
	delete(s.clients, token)
}

func (s *Store) Exists(token string) bool {
	_, exists := s.clients[token]
	return exists
}

func (s *Store) GetClient(token string) *Client {
	client, exists := s.clients[token]
	if !exists {
		return nil
	}

	return client
}

func (s *Store) GetAllClients() Clients {
	var clients = make(Clients, 0)

	for _, c := range s.clients {
		clients = append(clients, *c)
	}

	sort.Sort(clients)

	return clients
}

func (s *Store) GetRawClients() map[string]*Client {
	return s.clients
}
