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
var http 	   = require("http"),
    url 	   = require("url"),
	request    = require('request'),
    feedparser = require('feedparser'),
	db 		   = require("mongojs").connect(setting.dbName, [setting.dbCollection]);

// ----------------------------------
// RSS QUERY AND SAVE PART
var query      = require("./query.js")

// ----------------------------------
// HTTP Server part 
var read 		= require("./read.js")

// ----------------------------------
// UTILE
var utile	= {
	toJson:function(data){
		try{
 		   return JSON.parse(data);
		} catch(e) {
		   console.log("JSON error : ",e)
		   return "{}";
		}
	}
}

query.query(setting)

// ----------------------------------
// Start the RSS recorder
setInterval(function(){
			query.query(setting)},
			setting.delay)