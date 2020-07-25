package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func Error(c *gin.Context, err error) {
	c.JSON(http.StatusInternalServerError, map[string]interface{}{
		"status": http.StatusInternalServerError,
		"data":   err.Error(),
	})
}

func OK(c *gin.Context, data interface{}, meta ...interface{}) {
	resp := map[string]interface{}{
		"status": http.StatusOK,
		"data":   data,
	}

	if len(meta) > 0 {
		resp["meta"] = meta[0]
	}

	c.JSON(http.StatusOK, resp)
}
