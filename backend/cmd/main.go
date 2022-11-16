package main

import (
	"50Cent/backend/app"
)

// @title        50 Cent API
// @version      1.1
// @description  Back end for 50 Cent Application

// @host      localhost:8000
// @BasePath  /api/v1

// @securityDefinitions.apikey  ApiKeyAuth
// @in                          header
// @Name                        Authorization

func main() {
	if err := app.Run(); err != nil {
		panic(err)
	}
}
