package main

import (
	"flag"
	"fmt"
	"net/http"
	"strconv"
	"strings"

	limit "github.com/aviddiviner/gin-limit"
	"github.com/gin-gonic/gin"
	"github.com/spf13/viper"
)

var ipBlock = flag.Bool("block", false, "write -block true limit requests by IP in a certain time")

type ClientConn struct {
	Username string `json:"username"`
	Password string `json:"password"`
	Level    int    `json:"level"`
}

// we already know the username
var username string
var password string

func main() {
	// init router
	router := gin.Default()

	flag.Parse()

	// get config file
	viper.SetConfigName("config")
	viper.SetConfigType("json")
	viper.AddConfigPath(".")

	err := viper.ReadInConfig()
	if err != nil {
		fmt.Errorf("Unable to load config file")
	}

	if *ipBlock {
		fmt.Println("Block IPs")
		router.Use(limit.MaxAllowed(5))
	}

	router.LoadHTMLFiles("index.html", "connected.html")

	// form
	router.GET("/", func(c *gin.Context) {
		c.HTML(200, "index.html", nil)
	})

	// connected
	router.GET("/connected", func(c *gin.Context) {
		c.HTML(200, "index.html", nil)
	})

	// connect
	router.POST("/", func(c *gin.Context) {

		c.Request.ParseForm()

		mail := strings.Join(c.Request.PostForm["username"], " ")
		pwd := strings.Join(c.Request.PostForm["password"], " ")
		level, _ := strconv.Atoi(strings.Join(c.Request.PostForm["level"], " "))

		if mail != "" && pwd != "" && level <= 4 {

			// set difficulty (no encryption, this is a test)
			password = viper.GetString("password_level." + strconv.Itoa(level))

			// we already know the username
			username = viper.GetString("username")

			// check password
			if mail == username && password == pwd {
				// send ok code
				c.Redirect(http.StatusMovedPermanently, "/connected")
			} else {
				c.HTML(403, "index.html", nil)
			}
		} else {
			c.HTML(403, "index.html", nil)
		}
	})

	// Run
	router.Run(":9999")
}
