/*
	# NODE JS script :
	# Query rss, store in mongodb and serve it as json over http
	# Author : Samuel Huron 
*/

// ----------------------------------
// SETTINGS
// Check if their is a personal setting if it's not the case take the default one 
try{
  var setting     = require("./setting.js")
} catch(e) {
  var setting     = require("./defaultsetting.js")
}


// ----------------------------------
// LOAD LIB 
var http 	   = require('http'),
	request    = require('request'),
    feedparser = require('feedparser')

// LOAD Collection accessible 
var collections= require('./collectionList.js')

// ----------------------------------
// RSS QUERY AND SAVE PART
var query      = require("./query.js").init(setting)

// ----------------------------------
// HTTP Server part 
var read 		= require("./read.js").init(setting,collections)

// Start the RSS provider (server)
http.createServer(
				function(req, res){
					read.server(req, res)
				}).listen(setting.serverPort);

//{"guid":{"$regex":"en"}}