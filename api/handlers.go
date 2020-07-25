package api

import (
	"github.com/gin-gonic/gin"
)

func (a *API) GetAllClients(c *gin.Context) {
	var data = make([]ReadableClient, 0)

	clients := a.store.GetAllClients()
	for _, c := range clients {
		data = append(data, new(ReadableClient).FromClient(c))
	}

	OK(c, data)
}
