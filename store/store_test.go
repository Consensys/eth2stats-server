package store

import (
	"os"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestStore_NewClient(t *testing.T) {
	os.Chdir("..")
	store := New()

	client := store.NewClient("test")
	assert.NotEmpty(t, client.GetToken())

	token := client.GetToken()

	client.SetVersion("test")
	assert.Equal(t, "test", client.GetVersion())
	assert.Equal(t, "test", store.GetClient(token).GetVersion())

	client.SetGenesisTime(100)
	assert.Equal(t, int64(100), client.GetGenesisTime())
	assert.Equal(t, int64(100), store.GetClient(token).GetGenesisTime())

	client.SetName("shit")
	assert.Equal(t, "s**t", client.GetName())
}
