package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func (a *API) setRoutes() {
	a.engine.GET("/", func(context *gin.Context) {
		context.String(http.StatusOK, "It works!")
	})

	api := a.engine.Group("/api")
	api.GET("/clients", a.GetAllClients)
	api.GET("/network", func(c *gin.Context) {
		OK(c, map[string]interface{}{
			"name":        a.config.Network.Name,
			"genesisTime": a.config.Network.GenesisTime,
		})
	})

	a.engine.GET("/ws", func(ctx *gin.Context) {
		a.websockets(ctx.Writer, ctx.Request)
	})

}
